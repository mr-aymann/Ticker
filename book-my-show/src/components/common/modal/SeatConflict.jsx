import React from 'react';
import MainModal from './Main';
import Button from '../Button';

const SeatConflictModal = ({ isOpen, onClose, setCurrentLocation }) => {
    if (!isOpen) return null;
    return (
        <MainModal width="50">
            <div className="flex flex-col justify-center items-center  w-full gap-5 p-10">
                <h3 className='text-xl font-bold text-center'>Something went wrong! Please try again later.</h3>
                <p className='text-xs text-center text-black'>This seat is currently being booked by another user. Please select a different seat or wait a moment for the booking to be completed.</p>
                <Button label="Try Again" onClickHandler={onClose}/>
            </div>
        </MainModal>
    );
};

export default SeatConflictModal;
