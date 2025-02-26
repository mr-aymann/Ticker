import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const openAuthModal = () => {
    console.log('Opening auth modal');
    setIsSignInOpen(true);
  };

  const closeAuthModal = () => {
    console.log('Closing auth modal');
    setIsSignInOpen(false);
  };

  return (
    <AuthContext.Provider value={{ isSignInOpen, openAuthModal, closeAuthModal }}>
      {children}
    </AuthContext.Provider>
  );
};
