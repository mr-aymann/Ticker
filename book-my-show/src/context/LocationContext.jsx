import React, { createContext, useContext, useState } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [currentLocation, setCurrentLocation] = useState('New Delhi');

    return (
        <LocationContext.Provider value={[currentLocation, setCurrentLocation]}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocationContext = () => useContext(LocationContext);