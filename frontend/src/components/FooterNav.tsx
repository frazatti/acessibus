import React from 'react';
import { HomeIcon, HistoryIcon, HeartIcon } from './Icons';
import { ActiveTab } from '../types';

interface FooterNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const FooterNav: React.FC<FooterNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { tab: ActiveTab.Home, icon: HomeIcon, label: 'Home' },
    { tab: ActiveTab.Recents, icon: HistoryIcon, label: 'Recentes' },
    { tab: ActiveTab.Favorites, icon: HeartIcon, label: 'Favoritos' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10 w-full">
      <nav className="flex justify-around items-center h-16 max-w-md mx-auto" role="navigation">
        {navItems.map((item) => (
          <button
            key={item.tab}
            onClick={() => onTabChange(item.tab)}
            className={`flex flex-col items-center justify-center flex-1 h-full text-gray-500
              ${activeTab === item.tab ? 'text-blue-600 font-semibold' : 'hover:text-blue-500'}`}
            aria-label={item.label}
            aria-pressed={activeTab === item.tab}
          >
            <item.icon size={28} className="mb-1" color={activeTab === item.tab ? '#2563eb' : 'currentColor'} />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </nav>
    </footer>
  );
};

export default FooterNav;