import React, { useState } from 'react';

const SeatSelectionModal = ({ isOpen, onClose, seatTypes, onSeatCountChange }) => {
    const [selectedCount, setSelectedCount] = useState(1);
    const [seatCategory, setSeatCategory] = useState("NORMAL");

    const getTransportImage = () => {
        if (selectedCount === 1) return "https://cdn-icons-png.flaticon.com/512/2972/2972457.png";
        if (selectedCount === 2) return "https://cdn-icons-png.flaticon.com/512/1047/1047785.png";
        if (selectedCount >= 3 && selectedCount <= 4) return "https://cdn-icons-png.flaticon.com/512/2966/2966327.png";
        if (selectedCount >= 5 && selectedCount <= 7) return "https://cdn-icons-png.flaticon.com/512/3097/3097364.png";
        return "https://cdn-icons-png.flaticon.com/512/148/148920.png";
    };

    const handleSeatSelection = (count) => {
        setSelectedCount(count);
    };

    const handleConfirm = () => {
        if (onSeatCountChange) {
            onSeatCountChange(selectedCount);
        }
        onClose();
    };

    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-10 relative w-[500px]">
                <div className='flex flex-col justify-center items-center w-full gap-5'>
                    <h2 className="text-xl font-semibold mb-4 text-center">How Many Seats?</h2>

                    <div className="flex justify-center mb-4">
                        <img 
                            src={getTransportImage()} 
                            alt="Transport" 
                            className="w-24 h-24 object-contain"
                        />
                    </div>

                    <div className="flex justify-center items-center gap-3 mb-6 flex-wrap">
                        {[...Array(6)].map((_, i) => (
                            <button
                                key={`seat-${i + 1}`}
                                className={`
                                    w-12 h-12 rounded-full flex justify-center items-center
                                    transition-all duration-200 ease-in-out
                                    ${selectedCount === i + 1 
                                        ? 'bg-red-500 text-white' 
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
                                    cursor-pointer font-medium text-lg
                                `}
                                onClick={() => handleSeatSelection(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-6 w-full">
                        {seatTypes?.map((seat, index) => (
                            <div
                                key={`seat-type-${seat.name}-${index}`}
                                className={`
                                    flex flex-col items-center p-4 rounded-lg
                                    border border-gray-200 hover:border-red-500
                                    cursor-pointer transition-all duration-200
                                    ${seatCategory === seat.name ? 'border-red-500 bg-red-50' : ''}
                                `}
                                onClick={() => setSeatCategory(seat.name)}
                            >
                                <p className="text-sm text-gray-600 mb-1">{seat.name}</p>
                                <p className="text-base font-bold text-gray-800">₹{seat.price}</p>
                                <p className="text-xs text-green-500 mt-1">Available</p>
                            </div>
                        ))}
                    </div>

                    <div className="w-full flex gap-4">
                        <button
                            onClick={onClose}
                            className="w-1/3 bg-gray-200 text-gray-700 font-semibold py-3 rounded-md
                                     hover:bg-gray-300 transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="w-2/3 bg-red-500 text-white font-semibold py-3 rounded-md
                                     hover:bg-red-600 transition-all duration-200"
                        >
                            Confirm Selection
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatSelectionModal;