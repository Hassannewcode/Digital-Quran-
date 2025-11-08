import { Language } from '../types';

export const locales: Record<Language, { title: string }> = {
  en: { title: 'English' },
  ar: { title: 'العربية' },
};

export const defaultLang: Language = 'en';
