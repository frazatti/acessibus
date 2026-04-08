import React from 'react';
import { BusLine } from '../types';
import { BusIcon, HeartIcon, FilledHeartIcon } from '../components/Icons';

interface FavoritesPageProps {
  favoriteBusLines: BusLine[];
  onToggleFavorite: (id: string) => void;
  onRegisterClick: () => void;
  isLoggedIn: boolean;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({
  favoriteBusLines,
  onToggleFavorite,
  onRegisterClick,
  isLoggedIn,
}) => {
  return (
    <div className="flex flex-col items-center min-h-screen-minus-header-footer bg-gray-50 p-4 pt-16 pb-20 overflow-y-auto">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between py-4 border-b border-gray-200 mb-4">
          <h2 className="text-3xl font-bold text-gray-900">Favoritos</h2>
          <FilledHeartIcon size={32} className="text-red-500" />
        </div>

        {favoriteBusLines.length === 0 ? (
          <div className="text-center mt-16 p-6 bg-white rounded-lg shadow-md">
            <p className="text-lg text-gray-700 mb-6">
              Você ainda não possui nenhuma linha favorita! Se {isLoggedIn ? 'quiser adicionar' : 'cadastre-se'} para adicionar linhas.
            </p>
            {!isLoggedIn && (
              <button
                onClick={onRegisterClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-md transition duration-300"
                aria-label="Cadastre-se para adicionar linhas favoritas"
              >
                Cadastre-se
              </button>
            )}
            {isLoggedIn && (
              <p className="text-md text-gray-500 mt-4">
                Encontre e adicione suas linhas favoritas na página de Recentes.
              </p>
            )}
          </div>
        ) : (
          <ul className="space-y-4">
            {favoriteBusLines.map((line) => (
              <li
                key={line.id}
                className="flex items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100"
              >
                <BusIcon size={32} className="text-blue-600 flex-shrink-0 mr-4" />
                <div className="flex-grow">
                  <p className="text-lg font-semibold text-gray-900">{line.line}</p>
                  <p className="text-sm text-gray-600">{line.timeRange}</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Saída:</span> {line.origin}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Destino:</span> {line.destination}
                  </p>
                  <p className="text-sm text-gray-600">{line.travelTime}</p>
                </div>
                <button
                  onClick={() => onToggleFavorite(line.id)}
                  className="p-2 ml-4 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                  aria-label={`Remover ${line.line} dos favoritos`}
                >
                  <FilledHeartIcon size={28} className="text-red-500" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;