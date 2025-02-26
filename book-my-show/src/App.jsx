// src/App.js
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Loader from './components/common/Loader';

const Home = lazy(() => import('./pages/Home'));
const MovieDetails = lazy(() => import('./pages/MovieDetails'));
const Theatre = lazy(() => import('./pages/Theatre'));
const AvailableSeats = lazy(() => import('./pages/AvailableSeats'));

const App = () => {
  return (
    
    <Router>
      <Suspense fallback={<Loader/>}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/theatre/:movieName/:movieId" element={<Theatre />} />
            <Route path="/theatre/:movieName/:movieId/seats/:theatreId/:screenNo/:timeSlotId/:date/:showId" element={<AvailableSeats />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
    
  );
};

export default App;
