import React from 'react';
import { Surah, Ayah, PlayingState, Note, Reciter, Translation, PlayingMode, LearningModeType } from '../types';
import AyahView from './AyahView';
import PlaybackControls from './PlaybackControls';
import SettingsPanel from './SettingsPanel';

interface SurahDetailProps {
  surah: Surah;
  onPlay: (ayah: Ayah, surahId: number) => void;
  onStop: () => void;
  playingState: PlayingState;
  isBookmarked: (surahId: number, ayahId: number) => boolean;
  getNoteForAyah: (surahId: number, ayahId: number) => string;
  onToggleBookmark: (surahId: number, ayahId: number) => void;
  onSaveNote: (surahId: number, ayahId: number, text: string) => void;
  onPlayRange: (surah: Surah, mode: 'verse-by-verse' | 'full-surah') => void;
  onStartLearning: (surah: Surah, range: { start: number, end: number }, mode: LearningModeType) => void;
  notes: Note[];
  reciters: Reciter[];
  translations: Translation[];
  selectedReciterId: string;
  selectedTranslationId: string;
  onReciterChange: (id: string) => void;
  onTranslationChange: (id: string) => void;
  playbackRange: { start: number; end: number };
  onPlaybackRangeChange: (range: { start: number; end: number }) => void;
  repeatCount: number;
  onRepeatCountChange: (count: number) => void;
  isInfinite: boolean;
  onIsInfiniteChange: (isInfinite: boolean) => void;
  onRegenerateAyah: (surahId: number, ayahId: number) => void;
}

const AYAH_THRESHOLD_FOR_CONTINUOUS_PLAY = 4500;

const SurahDetail: React.FC<SurahDetailProps> = ({ 
    surah, 
    onPlay, 
    onStop,
    playingState,
    isBookmarked,
    getNoteForAyah,
    onToggleBookmark,
    onSaveNote,
    onPlayRange,
    onStartLearning,
    notes,
    reciters,
    translations,
    selectedReciterId,
    selectedTranslationId,
    onReciterChange,
    onTranslationChange,
    playbackRange,
    onPlaybackRangeChange,
    repeatCount,
    onRepeatCountChange,
    isInfinite,
    onIsInfiniteChange,
    onRegenerateAyah
}) => {
  const surahNotes = notes
    .filter(note => note.surahId === surah.id)
    .sort((a, b) => a.ayahId - b.ayahId);
  const hasNotes = surahNotes.length > 0;

  const ayahsInRange = surah.ayahs.slice(playbackRange.start - 1, playbackRange.end);
  const charCountInRange = ayahsInRange.reduce((acc, ayah) => acc + ayah.text.length, 0);
  const isLargeForContinuous = charCountInRange > AYAH_THRESHOLD_FOR_CONTINUOUS_PLAY;

  return (
    <>
    <SettingsPanel
        reciters={reciters}
        translations={translations}
        selectedReciterId={selectedReciterId}
        selectedTranslationId={selectedTranslationId}
        onReciterChange={onReciterChange}
        onTranslationChange={onTranslationChange}
    />
    {selectedTranslationId === 'none' && (
        <div className="my-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg text-blue-700 dark:text-blue-300">
          <p className="font-semibold">View Translation</p>
          <p className="text-sm">To display an English translation, please choose one from the dropdown menu above.</p>
        </div>
      )}
    <div className={`flex flex-col ${hasNotes ? 'lg:flex-row-reverse' : ''} gap-8 items-start`}>
      {hasNotes && (
        <aside className="w-full lg:w-1/3">
          <div className="sticky top-24">
            <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-zinc-300 font-arabic">ملاحظات</h3>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
              {surahNotes.map(note => (
                <div key={note.ayahId} id={`note-${note.surahId}-${note.ayahId}`} className="p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-sm">
                  <p className="font-bold text-sm text-blue-600 dark:text-blue-400">Verse {note.ayahId}</p>
                  <p className="text-sm text-slate-700 dark:text-zinc-300 mt-1 whitespace-pre-wrap">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}
      <div className={`w-full ${hasNotes ? 'lg:w-2/3' : 'lg:w-full'}`}>
        <PlaybackControls 
          surah={surah}
          playingState={playingState}
          onPlayRange={onPlayRange}
          onStartLearning={(mode) => onStartLearning(surah, playbackRange, mode)}
          playbackRange={playbackRange}
          onPlaybackRangeChange={onPlaybackRangeChange}
          repeatCount={repeatCount}
          onRepeatCountChange={onRepeatCountChange}
          isInfinite={isInfinite}
          onIsInfiniteChange={onIsInfiniteChange}
          isLargeForContinuous={isLargeForContinuous}
        />
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md divide-y divide-slate-200 dark:divide-zinc-800">
          {surah.id !== 1 && surah.id !== 9 && (
            <div className="p-4 md:p-6">
                <p className="text-center text-2xl font-amiri-quran text-slate-700 dark:text-zinc-300">
                بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
                </p>
            </div>
          )}
          {surah.ayahs.map((ayah) => (
            <AyahView
                key={ayah.id}
                ayah={ayah}
                surah={surah}
                onPlay={() => onPlay(ayah, surah.id)}
                onStop={onStop}
                onStartLearning={() => onStartLearning(surah, {start: ayah.id, end: ayah.id}, 'highlight')}
                playingState={playingState}
                isBookmarked={isBookmarked(surah.id, ayah.id)}
                note={getNoteForAyah(surah.id, ayah.id)}
                onToggleBookmark={() => onToggleBookmark(surah.id, ayah.id)}
                onSaveNote={(text) => onSaveNote(surah.id, ayah.id, text)}
                onRegenerate={() => onRegenerateAyah(surah.id, ayah.id)}
            />
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default SurahDetail;
