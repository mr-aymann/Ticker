import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getAllMovies } from "../../../api/movies";
import { useNavigate } from "react-router-dom";
import MovieCard from "../../common/MovieCard";

const MovieCardCarousel = () => {
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])

  const [currentIndex, setCurrentIndex] = useState(0);
  const moviesToShow = 4;

  const next = () => {
    if (currentIndex < movies.length - moviesToShow) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const allMovies = await getAllMovies();
        setMovies(allMovies?.data);
      } catch (err) {
        console.log("Error in fetching movies", err);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="w-full flex justify-center items-center overflow-hidden relative py-10">
      <div className="w-[90%] flex flex-col items-start overflow-hidden">
        <h4 className="text-2xl font-bold px-2 py-5">Recommended Movies</h4>
        <div className="flex items-center relative w-full">
          <button
            onClick={prev}
            className="bg-red-100 text-white rounded-full p-2 absolute left-0 transform -translate-y-1/2 top-1/2 z-10 "
            disabled={currentIndex === 0}
            aria-label="Previous"
          >
            <FaChevronLeft size={20} />
          </button>
          <div className="flex overflow-hidden w-full">
            <div
              className="flex transition-transform cursor-pointer"
              style={{
                transform: `translateX(-${(currentIndex * 100) / moviesToShow}%)`,
                width: `${(movies.length / moviesToShow) * 100}%`,
              }}
            >
              {movies?.map((movie, index) => (
                <MovieCard key={index} movie={movie}/>
              ))}
            </div>
          </div>
          <button
            onClick={next}
            className="bg-red-100 text-white rounded-full p-2 absolute right-0 transform -translate-y-1/2 top-1/2 z-10"
            disabled={currentIndex >= movies.length - moviesToShow}
            aria-label="Next"
          >
            <FaChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCardCarousel;
