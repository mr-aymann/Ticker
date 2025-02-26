import React, { useEffect, useState } from 'react';
import Seat from '../components/common/Seats';
import { getSeatsLayout, seatBooking, seatBookingVerify } from '../api/movies';
import SeatSelectionModal from '../components/common/modal/NoOfSeats';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button'
import { useAuth } from '../context/AuthContext';
import { getUser } from '../utils/token';
import SeatConflictModal from '../components/common/modal/SeatConflict';
import { getSeatLayoutWithConflicts, setConflictSeatLocally } from '../utils/conflictSeats';


const AvailableSeats = () => {
    const navigate = useNavigate()
    const { theatreId, screenNo, timeSlotId, date, showId } = useParams();
    const { openAuthModal } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSeatCount, setSelectedSeatCount] = useState(1);
    const [isSeatCountModalOpen, setIsSeatCountModalOpen] = useState(true);
    const [isSeatConflict, setIsSeatConflict] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Added missing state
    const [selectedSeat, setSelectedSeat] = useState({
        seat_row: null,
        seat_number: null,
        seat_class: null,
        seat_price: null,
        quantity: 1,
        seat_index: null
    });
    const [seatLayout, setSeatLayout] = useState([]);
    const [updateSeat, setUpdateSeat]= useState(false)

    const selectSeatHandler = (value) => {
        setSelectedSeat(value);
    };

    const handleSeatCountChange = (count) => {
        setSelectedSeatCount(count);
        setSelectedSeat(prev => ({
            ...prev,
            quantity: count
        }));
    };

    const getSeatLayout = async () => {
        try {
            const response = await getSeatsLayout(theatreId, screenNo, timeSlotId, date);
            if (response?.status == 200) {
                const conflictedSeats = getSeatLayoutWithConflicts(response?.data?.seats, showId, theatreId, screenNo, date);
                setSeatLayout(conflictedSeats)
            }
        } catch (err) {
            console.log("Error in fetching seat layout", err)
        }
    }

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    const ticketBookingHandler = async () => {
        setIsLoading(true);
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        // const { name, email, contactNo } = getUser();

        let amount
        let currency
        let orderId
        let receipt

        try {
            const response = await seatBooking(showId, theatreId, selectedSeat?.seat_row, selectedSeat?.seat_number, 19, screenNo, selectedSeat?.seat_class, selectedSeat?.seat_price)
            if (response.status == 200) {
                amount = response?.data?.amount
                currency = response?.data?.currency
                orderId = response?.data?.orderId
                receipt = response?.data?.receipt
            }

        } catch (err) {
            if (err?.response?.status == 401) {
                return openAuthModal()
            }
            if(err?.response?.status == 409){
                setConflictSeatLocally(showId, theatreId, selectedSeat?.seat_row, selectedSeat?.seat_number, screenNo, selectedSeat?.seat_class, selectedSeat?.seat_price, selectedSeat?.seat_index, date)
                return setIsSeatConflict(true)
            }   
            console.log("Error in payment", err)
        }finally{
            setIsLoading(false)
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            amount,
            currency,
            name: "Movie Seat Booking",
            description: "Test Transaction",
            image: "https://yourapp.com/logo.png",
            order_id: orderId,
            handler: async (response) => {
                try {
                    const verifyPaymentResponse = await seatBookingVerify(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature, receipt)
                    console.log("verifyPaymentResponse", verifyPaymentResponse)
                    if(verifyPaymentResponse?.status == 200){
                        return navigate("/")
                    }
                } catch (err) {
                    console.log("Error in verfiying payment")
                }
            },
            // prefill: {
            //     name: name || "Ali Imaran",
            //     email: email || "test@gmail.com",
            //     contact: contactNo || "1234567890",
            // },
            theme: {
                color: "#F84464",
            },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    }

    const conflictModalCloseHandler = () => {
        setSelectedSeat({ 
            seat_row: null,
            seat_number: null,
            seat_class: null,
            seat_price: null,
            quantity: 1,
            seat_index: null
        }) , 
        setUpdateSeat(!updateSeat) ,
        setIsSeatConflict(false)
    }

    useEffect(() => {
        getSeatLayout()
    }, [updateSeat]);

    return (
        <div className='flex justify-center items-center w-full flex-col py-10 relative'>
            <div className='flex justify-center items-center flex-col'>
                {seatLayout?.length > 0 && seatLayout?.map((seatType, index) => (
                    <div className='flex flex-col w-full mb-6' key={index}>
                        <div className='font-normal text-sm border-b border-gray-100 py-3 mb-5'>Rs {Math.round(seatType?.price)} {(seatType.name).toUpperCase()}</div>
                        {seatType?.seats.map((seat, seatIndex) => (

                            <div className='flex justify-center items-center gap-2 mb-4' key={seatIndex}>
                                <p className='text-gray-100 flex justify-center items-center w-[2%]'>{seat?.row}</p>
                                {seat?.values?.map((seatInfo, seatInfoIndex) => (
                                    <Seat
                                        value={seat?.status[seatInfoIndex]}
                                        seatNo={seatInfo}
                                        row={seat.row}
                                        seatClass={seatType?.name}
                                        seatPrice={seatType?.price}
                                        selectedSeat={selectedSeat}
                                        selectSeatHandler={selectSeatHandler}
                                        index={seatInfoIndex}
                                        key={seatInfoIndex}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
                <div className='mt-20 flex justify-center items-center w-full flex-col gap-2'>
                    <p className='text-red-90'>All eyes here</p>
                <div className='relative w-[50%] h-2 bg-[#f5f5f5] rounded-b-full overflow-hidden'>
                    <div className='absolute inset-x-0 bottom-0 h-16 bg-red-100 rounded-b-full'></div>
                </div>
                </div>
            </div>
            {selectedSeat?.seat_price && <div className='bottom-0 left-0 w-full fixed bg-white flex justify-center items-center p-2'
                style={{ boxShadow: '0 -4px 8px rgba(0, 0, 0, 0.3)' }}
            >
                <Button
                    label={`Pay ${Number(selectedSeat?.seat_price) * selectedSeat?.quantity}`}
                    classNames={'w-[30%]'}
                    loading={isLoading}
                    onClickHandler={ticketBookingHandler}
                />
            </div>}
            <SeatSelectionModal 
                isOpen={isSeatCountModalOpen} 
                onClose={() => setIsSeatCountModalOpen(false)} 
                seatTypes={seatLayout} 
                onSeatCountChange={handleSeatCountChange}
                selectedCount={selectedSeatCount}
            />
            <SeatConflictModal 
                isOpen={isSeatConflict} 
                onClose={conflictModalCloseHandler}
            />
        </div>
    );
}

export default AvailableSeats;
