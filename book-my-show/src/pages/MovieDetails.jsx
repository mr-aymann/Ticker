import React, { useEffect, useState } from 'react';
import { getMovieDetail } from '../api/movies';
import { Link, useParams } from 'react-router-dom';
import { AiFillLike } from 'react-icons/ai';

const MovieDetails = () => {
    const { id } = useParams();
    const [movieInfo, setMovieInfo] = useState(null);

    const convertMinutesToHours = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}min`;
    };


    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const movieData = await getMovieDetail(id);
                console.log("movieData", movieData);
                setMovieInfo(movieData?.data);
            } catch (err) {
                console.log("Error in fetching movie details", err);
            }
        };

        fetchMovie();
    }, [id]);

    if (!movieInfo) return <div>Loading...</div>;

    return (
        <>
            <div className="relative w-full h-[450px]">
                <img
                    src={movieInfo?.cover_url}
                    alt={movieInfo.title}
                    className="absolute top-0 left-0 w-full h-full object-cover object-top"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
                <div className="relative z-10 p-10 flex justify-start items-center gap-10 ml-20">
                    <img
                        src={movieInfo?.poster_url}
                        alt={movieInfo.title}
                        className="w-60 h-[350px] rounded-md"
                    />

                    <div className=" text-white flex flex-col">
                        <h2 className="text-3xl font-bold">{movieInfo.title}</h2>
                        <div className="flex items-center mt-2">
                            <div className="flex text-yellow-500">
                                {Array.from({ length: 5 }, (_, index) => (
                                    <span key={index}>
                                        {index < Math.round(movieInfo.rating) ? '★' : '☆'}
                                    </span>
                                ))}
                            </div>
                            <span className="ml-2 text-white">{movieInfo.rating} / 10</span>
                        </div>
                        <div className="mt-4 flex justify-between items-center w-[70%] gap-5 border border-white rounded-lg p-3">
                            <div className='flex flex-col justify-start items-start gap-1'>
                                <div className='flex gap-2 justify-center items-center'>
                                    <AiFillLike size={24} className="text-green-500" />
                                    <p className="text-sm">17k are intrrested</p>
                                </div>
                                <p className="text-[10px]">Are you interested in watching this movie?</p>
                            </div>
                            <button className="mt-2 bg-gray-100 text-black text-xs rounded p-2">I'm interested</button>
                        </div>
                        <div className="mt-4 flex justify-start items-center gap-5">
                            <p className="text-sm">2D, 3D, IMAX 3D, MX4D 3D, 4DX 3D, ICE 3D, 3D SCREEN X, ICE, 2D SCREEN X, 4DX, MX4D</p>
                        </div>

                        <p className="text-sm">{movieInfo?.language}</p>

                        <div className="mt-4 flex justify-start items-center gap-1">
                            <p className="text-sm">{convertMinutesToHours(movieInfo?.duration)}</p>
                            <p className="text-sm relative before:content-['•'] before:mx-2 before:text-xl">{movieInfo?.genre}</p>
                            <p className="text-sm relative before:content-['•'] before:mx-2 before:text-xl">UA</p>
                        </div>


                        <Link to={`/theatre/${movieInfo?.title}/${movieInfo?.id}`} className="mt-4 bg-red-100 text-white rounded p-4 w-1/2 text-center">Book tickets</Link>
                    </div>
                </div>
            </div>

            <div className="py-8 px-32">
                <h3 className="text-2xl font-bold">About the movie</h3>
                <p className="mt-2 text-sm">
                    {movieInfo?.synopsis}
                </p>
                <div className='w-full h-[1px] bg-gray-100 mt-7'></div>

                <h3 className="mt-6 text-2xl font-bold">Cast</h3>
                <div className="mt-4 flex justify-start items-center flex-wrap gap-10">
                    {movieInfo?.cast?.map(cast => <div className="flex justify-center items-center flex-col">
                        <img
                            src={cast?.image_url}
                            alt={cast?.name}
                            className="w-32 h-32 object-cover rounded-full mr-4"
                        />
                        <div className='flex justify-center items-center w-full flex-col'>
                            <p className="font-normal">{cast?.name}</p>
                            <p className="text-sm font-light">{cast?.role}</p>
                        </div>
                    </div>)}
                </div>
            </div>
        </>
    );
};

export default MovieDetails;
