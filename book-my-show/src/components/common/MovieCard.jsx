import React from 'react'
import { AiFillStar } from "react-icons/ai";
import { Link } from 'react-router-dom';

const MovieCard = ({ movie, type = "movie" }) => {
    // console.log("movie", movieq)
    return (
        <Link to={`/movie/${movie?.id}`}
            className="relative flex justify-center items-center h-[400px] w-[250px] px-2"
            onClick={() => navigate(`/movie/${movie?.id}`)}
        >
            <div className='flex flex-col w-full h-full'>
            <img
                src={movie?.poster_url}
                alt={movie?.title}
                className="h-full w-full object-cover"
            />
            {type !=="premier" && <p className='mt-1 w-full text-lg font-semiBold'>{movie?.title?.length > 25 ? `${movie?.title.slice(0,25)}...` : movie?.title}</p>}

            </div>
            {
                type == "premier" ? <div className="absolute top-0 left-0 w-[70%] bg-red-100 text-sm p-1 rounded-b-md">
                    <span className="text-2xl font-bold text-white">PREMIERE</span>
                </div> :
                    <div className="absolute bottom-7 left-2 w-[93.5%] bg-black text-sm p-2 rounded-b-md">
                        <div className="w-full text-center">
                            <div className="flex items-center justify-center text-white">
                                <AiFillStar className="text-yellow-500 mr-1 w-6 h-6" />
                                <span className="text-base font-normal">{Number(movie?.rating)?.toFixed(1)} / 10</span>
                            </div>
                        </div>
                    </div>
            }
            
        </Link>
    )
}

export default MovieCard