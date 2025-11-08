import { Surah, Ayah } from '../types';
import { SURAH_METADATA } from '../constants/surahNames';
import { QURAN_TEXT_TANZIL as QURAN_TEXT } from '../Quran';
import { QURAN_TRANSLITERATION } from '../data/en_buckwalter';

let arabicSurahs: Surah[] | null = null;
const surahCache: { [key: string]: Surah[] } = {};

function parseQuran(): Surah[] {
  if (arabicSurahs) {
    return arabicSurahs;
  }

  const transliterationMap = new Map<string, string>();
  const translitLines = QURAN_TRANSLITERATION.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));
  for (const line of translitLines) {
    const parts = line.split('|');
    if (parts.length === 3) {
      transliterationMap.set(`${parts[0]}|${parts[1]}`, parts[2].trim());
    }
  }

  const surahsMap: Map<number, Surah> = new Map();
  const lines = QURAN_TEXT.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));

  for (const line of lines) {
    const parts = line.split('|');
    if (parts.length === 3) {
      const surahId = parseInt(parts[0], 10);
      const ayahId = parseInt(parts[1], 10);
      const text = parts[2].trim();
      const transliteration = transliterationMap.get(`${surahId}|${ayahId}`);

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
        currentSurah.ayahs.push({ id: ayahId, text, transliteration });
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
        // PERF: Avoid re-mapping if transliteration is already present and no translation is needed.
        // Also, ensure `translation` property is explicitly set to undefined for consistent object shape.
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