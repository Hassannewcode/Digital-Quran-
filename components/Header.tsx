import React from 'react';
import { Surah, View } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface HeaderProps {
  currentView: View;
  selectedSurah: Surah | null;
  onNavigate: (view: 'list' | 'bookmarks' | 'settings') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Logo = () => (
    <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="64" height="64" rx="12" fill="#3B82F6"/>
        <path fill="white" d="M30,52 C30,58, 12,52, 12,52 V12 C12,6, 30,12, 30,12 V52 Z" />
        <path fill="white" d="M34,52 C34,58, 52,52, 52,52 V12 C52,6, 34,12, 34,12 V52 Z" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ currentView, selectedSurah, onNavigate, searchQuery, onSearchChange }) => {
  const { t, lang } = useLanguage();

  const getTitle = () => {
    if (currentView === 'detail' && selectedSurah) {
      return `${t('surah')} ${selectedSurah.name}`;
    }
    if (currentView === 'bookmarks') {
      return t('bookmarks');
    }
    if (currentView === 'settings') {
        return t('about_settings');
    }
    return t('holy_quran');
  };
  
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm border-b border-slate-200 dark:bg-zinc-900/80 dark:border-zinc-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          { currentView === 'detail' ? (
            <button
              onClick={() => onNavigate('list')}
              className="text-slate-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors duration-200 p-2 rounded-full -ml-2 rtl:-mr-2 rtl:-ml-0"
              aria-label={t('back_to_surah_list')}
            >
              <span className="material-symbols-outlined transform rtl:scale-x-[-1]">arrow_back</span>
            </button>
          ) : <Logo />}
           {currentView !== 'list' && (
            <h1 className={`text-2xl font-bold tracking-wide ${lang === 'ar' ? 'font-arabic' : ''} text-slate-800 dark:text-zinc-200 truncate`}>
              {getTitle()}
            </h1>
           )}
        </div>

        {currentView === 'list' ? (
            <div className="flex-1 flex justify-center px-4">
                <div className="relative w-full max-w-md">
                    <span className="material-symbols-outlined absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-slate-500 dark:text-zinc-400 pointer-events-none" aria-hidden="true">search</span>
                    <input
                        type="search"
                        placeholder={t('search_surah_placeholder')}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2 rounded-full bg-slate-100 dark:bg-zinc-800 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
                        aria-label={t('search_surah_label')}
                    />
                </div>
            </div>
        ) : (
            <div className="flex-1"></div>
        )}
        
        <nav className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={() => onNavigate('list')}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center justify-center ${currentView === 'list' || currentView === 'detail' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-zinc-600 hover:bg-slate-200 dark:text-zinc-300 dark:hover:bg-zinc-800'}`}
              aria-current={currentView === 'list' || currentView === 'detail'}
              aria-label={t('home')}
              title={t('home')}
            >
                <span className="material-symbols-outlined sm:hidden">home</span>
                <span className="hidden sm:inline">{t('home')}</span>
            </button>
            <button 
                onClick={() => onNavigate('bookmarks')}
                className={`p-2 sm:px-3 sm:py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center justify-center ${currentView === 'bookmarks' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-zinc-600 hover:bg-slate-200 dark:text-zinc-300 dark:hover:bg-zinc-800'}`}
                aria-current={currentView === 'bookmarks'}
                aria-label={t('bookmarks')}
                title={t('bookmarks')}
            >
                <span className="material-symbols-outlined sm:hidden">bookmark</span>
                <span className="hidden sm:inline">{t('bookmarks')}</span>
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className={`p-2 rounded-full transition-colors ${currentView === 'settings' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-zinc-600 hover:bg-slate-200 dark:text-zinc-300 dark:hover:bg-zinc-800'}`}
              aria-label={t('about_settings')}
              title={t('about_settings')}
            >
                <span className="material-symbols-outlined">settings</span>
            </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;