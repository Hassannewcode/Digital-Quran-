import React from 'react';
import { Surah, View } from '../types';

interface HeaderProps {
  currentView: View;
  selectedSurah: Surah | null;
  onNavigate: (view: 'list' | 'bookmarks' | 'settings') => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const Logo = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600 dark:text-blue-400">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5V4.5A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 7h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 11h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);


const Header: React.FC<HeaderProps> = ({ currentView, selectedSurah, onNavigate, theme, onThemeToggle }) => {
  const getTitle = () => {
    if (currentView === 'detail' && selectedSurah) {
      return `سورة ${selectedSurah.name}`;
    }
    if (currentView === 'bookmarks') {
      return 'Bookmarks';
    }
    if (currentView === 'settings') {
        return 'About & Settings';
    }
    return 'القرآن الكريم';
  };
  
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm border-b border-slate-200 dark:bg-zinc-900/80 dark:border-zinc-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          { currentView === 'detail' ? (
            <button
              onClick={() => onNavigate('list')}
              className="text-slate-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors duration-200 p-2 rounded-full -ml-2"
              aria-label="Back to Surah list"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          ) : <Logo />}
          <h1 className={`text-2xl font-bold tracking-wide ${['list', 'detail'].includes(currentView) ? 'font-arabic' : ''} ${['detail', 'settings', 'bookmarks'].includes(currentView) ? 'text-slate-800 dark:text-zinc-200' : 'text-blue-600 dark:text-blue-400'}`}>
            {getTitle()}
          </h1>
        </div>
        
        <nav className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={() => onNavigate('list')}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${currentView === 'list' || currentView === 'detail' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-zinc-600 hover:bg-slate-200 dark:text-zinc-300 dark:hover:bg-zinc-800'}`}
              aria-current={currentView === 'list' || currentView === 'detail'}
            >
                Home
            </button>
            <button 
                onClick={() => onNavigate('bookmarks')}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${currentView === 'bookmarks' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-zinc-600 hover:bg-slate-200 dark:text-zinc-300 dark:hover:bg-zinc-800'}`}
                aria-current={currentView === 'bookmarks'}
            >
                Bookmarks
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className={`p-2 rounded-full transition-colors ${currentView === 'settings' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-zinc-600 hover:bg-slate-200 dark:text-zinc-300 dark:hover:bg-zinc-800'}`}
              aria-label="Settings"
            >
                <span className="material-symbols-outlined">settings</span>
            </button>
             <button
              onClick={onThemeToggle}
              className="text-slate-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors duration-200 p-2 rounded-full"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              <span className="material-symbols-outlined">
                {theme === 'light' ? 'dark_mode' : 'light_mode'}
              </span>
            </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;