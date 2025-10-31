export interface Ayah {
  id: number;
  text: string;
  translation?: string;
}

export interface Surah {
  id: number;
  name: string;
  revelationType: 'Meccan' | 'Medinan';
  ayahs: Ayah[];
}

export type PlayingStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';
export type PlayingMode = 'single' | 'verse-by-verse' | 'full-surah';
export type LearningModeType = 'none' | 'highlight' | 'memory';
export type View = 'list' | 'detail' | 'bookmarks' | 'settings';

export type PlayingState = {
    status: 'idle';
} | {
    // Fix: Made PlayingState a proper discriminated union by ensuring 'idle' status is only in one part of the union.
    status: 'loading' | 'playing' | 'paused' | 'error';
    surahId: number;
    ayahId: number; // For single/verse-by-verse: current ayah. For range modes: start ayah of range/chunk.
    mode: PlayingMode;
};


export interface Reciter {
    id: string;
    name: string;
    voice: 'Zephyr' | 'Kore' | 'Puck' | 'Charon' | 'Fenrir';
    stylePrompt?: string;
    defaultPitch?: number;
    defaultSpeed?: number;
}

export interface Translation {
    id: string;
    name: string;
    translator: string;
    data: Record<string, Record<string, string>> | null;
}

export type Bookmark = {
    surahId: number;
    ayahId: number;
};

export interface Note {
    surahId: number;
    ayahId: number;
    text: string;
};