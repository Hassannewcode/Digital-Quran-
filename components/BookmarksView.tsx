import React from 'react';
import { Bookmark, Surah, Ayah } from '../types';

interface BookmarksViewProps {
  bookmarks: Bookmark[];
  allSurahs: Surah[];
  onNavigate: (surah: Surah) => void;
}

const BookmarksView: React.FC<BookmarksViewProps> = ({ bookmarks, allSurahs, onNavigate }) => {
    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-zinc-600">bookmark</span>
                <h2 className="mt-4 text-2xl font-semibold text-slate-700 dark:text-zinc-300">No Bookmarks Yet</h2>
                <p className="mt-2 text-slate-500 dark:text-zinc-400">You can bookmark verses as you read them.</p>
            </div>
        )
    }

    const getBookmarkedAyahDetails = (bookmark: Bookmark): { surah: Surah | undefined, ayah: Ayah | undefined } => {
        const surah = allSurahs.find(s => s.id === bookmark.surahId);
        const ayah = surah?.ayahs.find(a => a.id === bookmark.ayahId);
        return { surah, ayah };
    }

    return (
        <div className="space-y-4">
             <h2 className="text-xl font-bold text-slate-700 dark:text-zinc-300 mb-4 font-arabic">المفضلات</h2>
            {bookmarks.map((bookmark, index) => {
                const { surah, ayah } = getBookmarkedAyahDetails(bookmark);
                if (!surah || !ayah) return null;

                return (
                    <button
                        key={`${surah.id}-${ayah.id}-${index}`}
                        onClick={() => onNavigate(surah)}
                        className="w-full text-left p-4 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-label={`Go to Surah ${surah.name}, Ayah ${ayah.id}`}
                    >
                        <div className="mb-2">
                           <span className="font-semibold text-blue-600 dark:text-blue-400">{surah.name}</span>
                           <span className="text-slate-500 dark:text-zinc-400 mx-2">&bull;</span>
                           <span className="text-slate-500 dark:text-zinc-400">Verse {ayah.id}</span>
                        </div>
                        <p dir="rtl" className="font-amiri-quran text-2xl text-slate-800 dark:text-zinc-200">{ayah.text}</p>
                        {ayah.translation && <p className="mt-2 text-slate-600 dark:text-zinc-400 text-sm">{ayah.translation}</p>}
                    </button>
                )
            })}
        </div>
    );
};

export default BookmarksView;