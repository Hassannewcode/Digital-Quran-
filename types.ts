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
    status: 'loading' | 'playing' | 'paused' | 'error';
    surahId: number;
    ayahId: number;
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

export type ThemeSetting = 'system' | 'light' | 'dark';

export type Language = 'en' | 'ar';

export type LearningSession = {
  surah: Surah;
  range: { start: number; end: number };
  mode: LearningModeType;
};
