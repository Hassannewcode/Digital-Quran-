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

export type PlayingState = {
    status: 'idle';
} | {
    status: 'loading' | 'playing' | 'error';
    surahId: number;
    ayahId: number;
    continuous?: boolean;
}

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