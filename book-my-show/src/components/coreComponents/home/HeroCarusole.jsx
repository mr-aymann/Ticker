import React, { useState } from "react";
import HeroSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BannerImage1 from '../../../assets/banner1.avif'
import BannerImage2 from '../../../assets/banner2.avif'

const NextArrow = (props) => {
  return (
    <div
      className={props.className}
      style={{ ...props.style }}
      onClick={props.onClick}
    ></div>
  );
};

const PrevArrow = (props) => {
  return (
    <div
      className={props.className}
      style={{ ...props.style }}
      onClick={props.onClick}
    ></div>
  );
};

const HeroCarousel = () => {
  const [images, setImages] = useState([
    {
      backdrop_path: BannerImage1,
      title: "Elemental",
    },
    {
      backdrop_path: BannerImage2,
      title: "Oppenheimer",
    },
    {
      backdrop_path: BannerImage1,
      title: "Sound of Freedom",
    },
    {
      backdrop_path: BannerImage2,
      title: "Joy Ride",
    },
  ]);

  const settings = {
    arrows: true,
    slidesToShow: 1,
    infinite: false,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: false,
    speed: 3000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    dotsClass: "slick-dots tailwind-dots",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
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
    <div className="w-full h-auto relative bg-gray-100">
      <HeroSlider {...settings}>
        {images?.map((image, index) => (
          <div className="w-full h-80 px-2 py-3" key={index}>
            <img
              src={image?.backdrop_path}
              alt={image?.title}
              className="w-full h-full rounded-md object-cover"
            />
          </div>
        ))}
      </HeroSlider>
    </div>
  );
};

export default HeroCarousel;
