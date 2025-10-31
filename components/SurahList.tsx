import React from 'react';
import { Surah } from '../types';

interface SurahListProps {
  surahs: Surah[];
  onSelect: (surah: Surah) => void;
}

const SurahList: React.FC<SurahListProps> = ({ surahs, onSelect }) => {
  return (
    <div className="space-y-2">
        <h2 className="text-xl font-bold text-slate-700 dark:text-zinc-300 mb-4 font-arabic">السور</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {surahs.map((surah) => (
            <button
            key={surah.id}
            onClick={() => onSelect(surah)}
            className="group text-right p-4 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`Select Surah ${surah.name}`}
            >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 bg-slate-100 group-hover:bg-blue-100 rounded-lg text-slate-500 group-hover:text-blue-600 dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-blue-900/50 dark:group-hover:text-blue-400 transition-colors duration-300">
                        <span className="font-bold text-lg font-sans">{surah.id}</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 dark:text-zinc-200 dark:group-hover:text-blue-400 transition-colors duration-300">{surah.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-zinc-400">{surah.revelationType}</p>
                    </div>
                </div>
                <div className="text-left rtl:text-right">
                    <p className="text-xl font-amiri-quran text-slate-700 dark:text-zinc-300">سورة {surah.name}</p>
                    <p className="text-xs text-slate-400 dark:text-zinc-500 font-sans">{surah.ayahs.length} verses</p>
                </div>
            </div>
            </button>
        ))}
        </div>
    </div>
  );
};

export default SurahList;