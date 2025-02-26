import React from 'react';
import { AiOutlineClose } from "react-icons/ai";

const MainModal = ({ isOpen, onClose, children, header = false, width = '70' }) => {
    if (!isOpen) return null; // Conditionally render the modal only when isOpen is true

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-300">
            <div
                className={`bg-white rounded-lg shadow-lg relative ${header ? 'p-10' : ''}`}
                style={{ width: `${width}%` }}
            >
                {header && (
                    <div className='mb-16 relative'>
                        <AiOutlineClose
                            className='absolute top-[6%] right-[5%] cursor-pointer'
                            onClick={onClose}
                        />
                        <h2 className='absolute top-[1%] left-1/2 transform -translate-x-1/2 text-lg font-medium py-5'>
                            Get Started
                        </h2>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
};

export default MainModal;
