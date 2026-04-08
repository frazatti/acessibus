import { BusLine, User } from './types';

export const MOCK_BUS_LINES: BusLine[] = [
  {
    id: '1',
    line: '102 CIRCULAR VIA CENTRO',
    timeRange: 'das 08:30 às 18:18',
    origin: 'saída terminal de SP',
    destination: 'destino terminal Santo Antônio',
    travelTime: 'tempo de percurso 45 min',
    isFavorite: false,
  },
  {
    id: '2',
    line: '205 LESTE SENTIDO NORTE',
    timeRange: 'das 07:00 às 19:00',
    origin: 'saída terminal Leste',
    destination: 'destino terminal Norte',
    travelTime: 'tempo de percurso 30 min',
    isFavorite: true,
  },
  {
    id: '3',
    line: '301 EXPRESSO VIA PONTE',
    timeRange: 'das 06:15 às 20:30',
    origin: 'saída rodoviária Central',
    destination: 'destino estação Ponte',
    travelTime: 'tempo de percurso 60 min',
    isFavorite: false,
  },
  {
    id: '4',
    line: '102 CIRCULAR VIA CENTRO',
    timeRange: 'das 08:30 às 18:18',
    origin: 'saída terminal de SP',
    destination: 'destino terminal Santo Antônio',
    travelTime: 'tempo de percurso 45 min',
    isFavorite: false,
  },
  {
    id: '5',
    line: '102 CIRCULAR VIA CENTRO',
    timeRange: 'das 08:30 às 18:18',
    origin: 'saída terminal de SP',
    destination: 'destino terminal Santo Antônio',
    travelTime: 'tempo de percurso 45 min',
    isFavorite: false,
  },
];

export const MOCK_USER: User = {
  id: 'user-123',
  name: 'Patrícia Minitti',
  email: 'patriciaminitti1971@gmail.com',
  profilePicUrl: 'https://picsum.photos/60/60?random=1',
};
