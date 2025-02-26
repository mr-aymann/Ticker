import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const MainLayout = () => {
  return (
    <div>
      <Header />
        <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
