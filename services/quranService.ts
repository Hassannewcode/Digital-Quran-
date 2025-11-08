import { Surah, Ayah } from '../types';
import { SURAH_METADATA } from '../constants/surahNames';
import { QURAN_TEXT_TANZIL as QURAN_TEXT } from '../Quran';

let arabicSurahs: Surah[] | null = null;
const surahCache: { [key: string]: Surah[] } = {};

function parseQuran(): Surah[] {
  if (arabicSurahs) {
    return arabicSurahs;
  }

  const surahsMap: Map<number, Surah> = new Map();
  const lines = QURAN_TEXT.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));

  for (const line of lines) {
    const parts = line.split('|');
    if (parts.length === 3) {
      const surahId = parseInt(parts[0], 10);
      const ayahId = parseInt(parts[1], 10);
      const text = parts[2].trim();

      if (!surahsMap.has(surahId)) {
        const surahMeta = SURAH_METADATA[surahId - 1];
        if (surahMeta) {
          surahsMap.set(surahId, {
            id: surahId,
            name: surahMeta.name,
            revelationType: surahMeta.type,
            ayahs: [],
          });
        }
      }
      
      const currentSurah = surahsMap.get(surahId);
      if(currentSurah) {
        currentSurah.ayahs.push({ id: ayahId, text });
      }
    }
  }

  arabicSurahs = Array.from(surahsMap.values()).sort((a, b) => a.id - b.id);
  return arabicSurahs;
}


export function getSurahsWithTranslation(translationData: Record<string, Record<string, string>> | null): Surah[] {
    const cacheKey = translationData ? Object.keys(translationData).length.toString() : 'none';
    if (surahCache[cacheKey]) {
        return surahCache[cacheKey];
    }
    
    const baseSurahs = parseQuran();
    
    if (!translationData) {
        const result = baseSurahs.map(surah => ({ ...surah, ayahs: surah.ayahs.map(ayah => ({...ayah, translation: undefined})) }));
        surahCache[cacheKey] = result;
        return result;
    }

    const translatedSurahs = baseSurahs.map(surah => ({
        ...surah,
        ayahs: surah.ayahs.map(ayah => ({
            ...ayah,
            translation: translationData[surah.id]?.[ayah.id] || ''
        }))
    }));
    
    surahCache[cacheKey] = translatedSurahs;
    return translatedSurahs;
}
