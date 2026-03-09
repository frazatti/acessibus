import React from 'react';
import { User } from '../types';
import { UserIcon } from '../components/Icons';

interface ProfilePageProps {
  currentUser: User;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onLogout }) => {
  return (
    <div className="flex flex-col items-center min-h-screen-minus-header-footer bg-gray-50 p-0 pt-16 pb-20 overflow-y-auto">
      <div className="relative w-full h-48 bg-gradient-to-r from-blue-500 to-blue-700 flex justify-center items-center overflow-hidden">
        {/* Wavy background - SVG or complex CSS could be here, for simplicity, a gradient */}
        {/* Placeholder for wavy pattern - can be replaced with a complex SVG if needed */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#ffffff" fillOpacity="0.2" d="M0,64L48,85.3C96,107,192,149,288,149.3C384,149,480,107,576,106.7C672,107,768,149,864,154.7C960,160,1056,128,1152,112C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <path fill="#ffffff" fillOpacity="0.3" d="M0,32L48,42.7C96,53,192,75,288,85.3C384,96,480,96,576,106.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="relative -mt-20 w-36 h-36 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
        {currentUser.profilePicUrl ? (
          <img
            src={currentUser.profilePicUrl}
            alt={`Foto de perfil de ${currentUser.name}`}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <UserIcon size={96} className="text-gray-500" />
        )}
      </div>

      <div className="text-center mt-6 px-4">
        <h2 className="text-3xl font-bold text-gray-900">{currentUser.name}</h2>
        <p className="text-md text-gray-600 mt-2">Endereço de email: {currentUser.email}</p>
      </div>

      <button
        onClick={() => alert('Funcionalidade de Editar Perfil ainda não implementada!')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md transition duration-300 mt-8"
        aria-label="Editar perfil"
      >
        Editar Perfil
      </button>

      <button
        onClick={onLogout}
        className="mt-4 text-red-600 hover:text-red-700 font-semibold py-2 px-4 rounded-full text-md transition duration-300"
        aria-label="Sair da conta"
      >
        Sair
      </button>
    </div>
  );
};

export default ProfilePage;