import React from 'react';
import DelhiImage from '../../../assets/location/delhi.png'
import kolkataImage from '../../../assets/location/kolkata.png'
import MumbaiImage from '../../../assets/location/mumbai.png'
import HyderabadImage from '../../../assets/location/hyd.png'
import MainModal from './Main';
import { useLocationContext } from '../../../context/LocationContext';

const cities = [
    {
        id: 1,
        name: 'New Delhi',
        image: DelhiImage,
    },
    {
        id: 2,
        name: 'Mumbai',
        image: MumbaiImage,
    },
    {
        id: 3,
        name: 'Kolkata',
        image: kolkataImage,
    },
    {
        id: 4,
        name: 'Hyderabad',
        image: HyderabadImage,
    },
];


const LocationModal = ({ isOpen, onClose }) => {
    const [currentLocation, setCurrentLocation] = useLocationContext();

    const handleLocationSelect = (cityName) => {
        setCurrentLocation(cityName);
        console.log('Location selected:', cityName);
        onClose(); // Ensure this is called
    };

    return (
        <MainModal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Select City</h2>
                <div className="grid grid-cols-2 gap-4">
                    {cities.map((city) => (
                        <button
                            key={city.id}
                            className={`p-3 border rounded-md hover:bg-red-100 hover:text-white 
                                      flex flex-col items-center gap-2 transition-all duration-200
                                      ${currentLocation === city.name ? 'bg-red-100 text-white' : ''}`}
                            onClick={() => handleLocationSelect(city.name)}
                        >
                            <img 
                                src={city.image} 
                                alt={city.name} 
                                className="w-16 h-16 object-cover rounded-md"
                            />
                            <span className={`font-medium ${currentLocation === city.name ? 'text-white' : 'text-gray-800'}`}>
                                {city.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </MainModal>
    );
};

export default LocationModal;