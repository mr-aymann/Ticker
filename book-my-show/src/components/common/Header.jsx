import React, { useState } from 'react';
import { BiChevronDown, BiMenu, BiSearch } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { FaAngleDown } from 'react-icons/fa6';
import LocationModal from './modal/Location';
import Auth from './modal/Auth';
import { useAuth } from '../../context/AuthContext';
import { clearToken, getToken } from '../../utils/token';
import { useLocationContext } from '../../context/LocationContext';

const Header = () => {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [currentLocation] = useLocationContext();
  const { isSignInOpen, openAuthModal, closeAuthModal } = useAuth();
  const isLoggedIn = getToken();

  const logoutHandler = () => {
    clearToken();
    window.location.reload(); // Reload the page to reflect the logout state
  };

  return (
    <>
      <div className="container flex mx-auto px-4 py-3 items-center justify-between">
        <div className="flex justify-center items-center w-1/2 gap-5">
          <Link to="/" className="flex justify-start items-center gap-0">
            <h4 className="font-normal text-lg">book</h4>
            <div className="w-10 h-10">
              <img
                src="https://i.ibb.co/zPBYW3H/imgbin-bookmyshow-office-android-ticket-png.png"
                alt="logo"
                className="w-full h-full"
              />
            </div>
            <h4 className="font-normal text-lg">show</h4>
          </Link>
          <div className="w-full flex items-center gap-3 border border-gray-100 px-3 py-2 rounded-md">
            <BiSearch />
            <input
              type="search"
              className="w-full bg-transparent border-none focus:outline-none"
              placeholder="Search for movies, events, plays, sports and activities"
            />
          </div>
        </div>
        <div className="flex justify-center items-center gap-5">
          <button
            className="flex justify-center items-center gap-2 text-sm font-light"
            onClick={() => setIsLocationModalOpen(true)}
          >
            <span>{currentLocation}</span>
            <p>
              <FaAngleDown size={10} color="#666666" />
            </p>
          </button>
          <button
            className="bg-red-100 text-white text-xs px-3 py-1 rounded font-light"
            onClick={() => {
              isLoggedIn ? logoutHandler() : openAuthModal();
            }}
          >
            {isLoggedIn ? 'Logout' : 'Sign in'}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8">
              <BiMenu className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
      <Auth 
        isOpen={isSignInOpen} 
        onClose={closeAuthModal} 
        header={true} // Added true value for header prop
      />
    </>
  );
};

export default Header;
