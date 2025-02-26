import  { useEffect, useState } from 'react'
import { getTheatres } from '../api/movies';
import { Link, useParams } from 'react-router-dom';
//import SeatSelectionModal from '../components/common/modal/NoOfSeats';
import NotFound from '../components/common/NotFound';
import { useLocationContext } from '../context/LocationContext';

const Theatre = () => {
    const { movieName, movieId } = useParams();
    const [ currentLocation ] = useLocationContext();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    const [selectedDate, setSelectedDate] = useState(formattedDate);
    const [theatreList, setTheatreList] = useState([]);
    const [error, setError] = useState(null);


    const getNextFiveDays = () => {
        const days = [];

        for (let i = 0; i < 5; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);

            const formattedDate = {
                dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
                day: date.getDate(),
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                fullDate: date.toISOString().split('T')[0]
            };

            days.push(formattedDate);
        }

        return <>
            {days.map((date) => (
                <div className={`flex justify-center items-center flex-col rounded-md px-4 py-1 cursor-pointer ${date.fullDate == selectedDate ? 'bg-red-100 text-white' : 'text-black'}`} key={date?.fullDate} onClick={() => setSelectedDate(date.fullDate)}>
                    <p className='text-[10px]'>{date.dayOfWeek.toUpperCase()}</p>
                    <p className='text-base font-semibold'>{date.day}</p>
                    <p className='text-[10px]'>{date.month.toUpperCase()}</p>
                </div>
            ))}
        </>
    };

    const convertTo12HourFormat = (time) => {
        const [hour, minute] = time.split(':');
        const hourNum = parseInt(hour, 10);

        const period = hourNum >= 12 ? 'PM' : 'AM';
        const formattedHour = hourNum % 12 || 12;

        return `${formattedHour}:${minute} ${period}`;
    };

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await getTheatres(movieId, currentLocation, selectedDate);
                console.log("response", response);
                setTheatreList(response?.data?.theatres)
                setError(null)
            } catch (err) {
                if (err && err?.response.status == 400) {
                    setError(err?.response?.data?.message)
                }
                console.log("Error in fetching movie details", err);
            }
        };

        fetchMovie();
    }, [selectedDate,currentLocation]);


    console.log("theatreList", theatreList)

    return (
        <div className='flex justify-start items-start w-full flex-col'>
            <div className='flex flex-col bg-white w-full'>
                <div className='px-24 py-8 border-b-2 border-gray-100'>
                    <h3 className='text-3xl'>{movieName}</h3>
                </div>
                <div className='w-1/2 flex justify-start items-start gap-2 px-24 py-1'>
                    {getNextFiveDays()}
                </div>
            </div>

            <div className='flex w-full justify-center items-center flex-col mt-5'>
                {error ? error : theatreList?.map(theatre => <div className='flex justify-start items-center gap-5 w-[88%] bg-white px-5 py-8 border-b border-gray-100' key={theatre?.theater_id}>
                    <div className='flex flex-col gap-1 w-[20%]'>
                        <h4 className='text-base whitespace-nowrap'>{theatre?.theater_name}</h4>
                        <p className='text-[10px]'>{theatre?.address}</p>
                    </div>
                    <div className='flex gap-3 w-[80%]'>
                        {theatre?.shows?.map(show => (
                            <Link to={`/theatre/${movieName}/${movieId}/seats/${theatre?.theater_id}/${show?.screen_number}/${show?.slot_id}/${selectedDate}/${show?.show_id}`} className='px-5 py-1 border border-gray-100  rounded-lg flex justify-center items-center flex-col'>
                                <p className='text-green-600'>{convertTo12HourFormat(show?.show_time)}</p>
                                <h5 className='text-sm'>{show?.screen_number} </h5>
                            </Link>
                        ))}

                        {theatre.length == 0 && <NotFound/>}
                    </div>
                </div>)}
            </div>
        </div>
    )
}

export default Theatre