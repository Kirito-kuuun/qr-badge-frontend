import React from 'react';
import logo from '../images/logo.jpeg';

const Header = () => {
  return (
    <header className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src={logo} 
            alt="MITUKI Logo" 
            className="h-12 w-auto mr-3"
          />
          <h1 className="text-xl font-bold">QR Badge App</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="/" className="hover:text-blue-400">Accueil</a></li>
            <li><a href="/scan" className="hover:text-blue-400">Scanner</a></li>
            <li><a href="/badge" className="hover:text-blue-400">Mon Badge</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
