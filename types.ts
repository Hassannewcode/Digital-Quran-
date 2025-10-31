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

export type PlayingStatus = 'idle' | 'loading' | 'playing' | 'error';
export type PlayingMode = 'single' | 'verse-by-verse' | 'continuous' | 'full-surah' | 'asap-continuous';
export type LearningModeType = 'none' | 'highlight' | 'memory';

export type PlayingState = {
    status: 'idle';
} | {
    status: PlayingStatus;
    surahId: number;
    ayahId: number;
    mode: PlayingMode;
};


export interface Reciter {
    id: string;
    name: string;
    voice: 'Zephyr' | 'Kore' | 'Puck' | 'Charon' | 'Fenrir';
    stylePrompt?: string;
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