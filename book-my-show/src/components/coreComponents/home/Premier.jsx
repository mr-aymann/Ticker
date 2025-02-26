import React, { useEffect, useState } from 'react'
import EntertainmentCardSlider from './Entertainment'
import MovieCard from '../../common/MovieCard';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getAllMovies } from '../../../api/movies';
import Slider from 'react-slick';
import { FaPlay } from "react-icons/fa6";

const Premier = () => {

    const [premiers, setPremiers] = useState([{
        backdrop_path: "/jZIYaISP3GBSrVOPfrp98AMa8Ng.jpg",
        title: "Elemental",
        rating: 7.5,
    },
    {
        backdrop_path: "/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
        title: "Oppenheimer",
        rating: 8.4,
    },
    {
        backdrop_path: "/waBWlJlMpyFb7STkFHfFvJKgwww.jpg",
        title: "Sound of Freedom",
        rating: 6.8,
    },
    {
        backdrop_path: "/fIQfdZ6fqf9mIbqBaexbgIEIk5K.jpg",
        title: "Joy Ride",
        rating: 5.5,
    },
    {
        backdrop_path: "/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
        title: "wqwqw",
        rating: 7.0,
    },
    {
        backdrop_path: "/waBWlJlMpyFb7STkFHfFvJKgwww.jpg",
        title: "kk",
        rating: 4.5,
    },
    ]);

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
                setPremiers(allMovies?.data);
            } catch (err) {
                console.log("Error in fetching movies", err);
            }
        };

        fetchMovies();
    }, []);

    const settings = {
        infinte: false,
        autoplay: false,
        slidesToShow: 5,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };



    return (
        <div className='bg-blue-100 px-5 py-14'>
            <div className="w-[90%] mx-auto">
                <div className='flex justify-start items-center gap-5'>
                    <div className=' bg-red-100 w-16 h-16 rounded-full flex justify-center  items-center'>
                        <FaPlay color="white" size={30} />
                    </div>
                    <div className='text-gray-70'>
                        <h4 className='font-semibold text-2xl tracking-widest'>PREMIERE</h4>
                        <p className='font-light text-sm'>watch new movies at home , every friday</p>
                    </div>
                </div>
                <div className='mt-16'>
                    <Slider {...settings}>
                        {premiers?.map((movie, index) => (
                            <MovieCard movie={movie} key={index} type='premier' />
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    )
}

export default Premier