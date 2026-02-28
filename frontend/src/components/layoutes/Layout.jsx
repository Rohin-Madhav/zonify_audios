import React from 'react';
import Navbar from '../common/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../common/Footer';

const Layout = () => {
    return (
       <div className="min-h-screen flex flex-col">
  <Navbar />
  <main className="flex-1 pt-24">
    <Outlet />
  </main>
  <Footer />
</div>
    );
}

export default Layout;
