import React from 'react';
import { AcessiBusLogo, UserIcon } from './Icons';
import { User } from '../types';

interface HeaderProps {
  onProfileClick: () => void;
  currentUser?: User;
}

const Header: React.FC<HeaderProps> = ({ onProfileClick, currentUser }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200 sticky top-0 z-10 w-full">
      <div className="flex items-center">
        <AcessiBusLogo size={32} color="#2563eb" className="h-8 w-auto" />
      </div>
      <button
        onClick={onProfileClick}
        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={currentUser ? `Ver perfil de ${currentUser.name}` : "Abrir página de perfil/login"}
      >
        {currentUser && currentUser.profilePicUrl ? (
          <img
            src={currentUser.profilePicUrl}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <UserIcon size={32} className="text-gray-600" />
        )}
      </button>
    </header>
  );
};

export default Header;