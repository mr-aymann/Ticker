import React from 'react'
import HeroCarousel from '../components/coreComponents/home/HeroCarusole'
import Movies from '../components/coreComponents/home/Movie'
import EntertainmentCardSlider from '../components/coreComponents/home/Entertainment'
import MovieCard from '../components/common/MovieCard'
import Premier from '../components/coreComponents/home/Premier'


const Home = () => {
  return (
    <>
      <HeroCarousel />
      <Movies />
      <EntertainmentCardSlider />
      <Premier />
    </>
  )
}

export default Home



