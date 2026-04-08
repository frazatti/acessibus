import React from 'react';
import { BusLine } from '../types';
import { BusIcon, HeartIcon, FilledHeartIcon, HistoryIcon } from '../components/Icons';

interface RecentsPageProps {
  recentBusLines: BusLine[];
  onToggleFavorite: (id: string) => void;
}

const RecentsPage: React.FC<RecentsPageProps> = ({ recentBusLines, onToggleFavorite }) => {
  return (
    <div className="flex flex-col items-center min-h-screen-minus-header-footer bg-gray-50 p-4 pt-16 pb-20 overflow-y-auto">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between py-4 border-b border-gray-200 mb-4">
          <h2 className="text-3xl font-bold text-gray-900">Recentes</h2>
          <HistoryIcon size={32} className="text-gray-600" />
        </div>

        {recentBusLines.length === 0 ? (
          <p className="text-center text-gray-600 mt-8">Nenhuma linha recente encontrada.</p>
        ) : (
          <ul className="space-y-4">
            {recentBusLines.map((line) => (
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
                  aria-label={line.isFavorite ? `Remover ${line.line} dos favoritos` : `Adicionar ${line.line} aos favoritos`}
                >
                  {line.isFavorite ? (
                    <FilledHeartIcon size={28} className="text-red-500" />
                  ) : (
                    <HeartIcon size={28} className="text-gray-400 hover:text-red-400" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecentsPage;