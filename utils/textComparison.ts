import { Surah, Ayah } from '../types';

export type WordStatus = 'pending' | 'correct' | 'incorrect' | 'current';

const normalizeArabic = (text: string): string => {
  // This function simplifies Arabic text for more lenient matching.
  // It removes diacritics, normalizes Alef variants, and Taa Marbuta.
  return text
    .replace(/[\u064B-\u0652]/g, '') // Remove harakat (vowels)
    .replace(/\u0640/g, '') // Remove Tatweel
    .replace(/[أإآ]/g, 'ا') // Normalize Alef variants
    .replace(/ة/g, 'ه')     // Normalize Taa Marbuta
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()؟]/g, '') // Remove punctuation
    .trim();
};

const levenshteinDistance = (a: string, b: string): number => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) {
        matrix[0][i] = i;
    }
    for (let j = 0; j <= b.length; j++) {
        matrix[j][0] = j;
    }

    for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1, // deletion
                matrix[j - 1][i] + 1, // insertion
                matrix[j - 1][i - 1] + cost // substitution
            );
        }
    }

    return matrix[b.length][a.length];
};

export const getWordStatuses = (
  originalWords: string[], 
  spokenText: string
): { statuses: WordStatus[], currentWordIndex: number, correctCount: number, incorrectCount: number } => {
    const spokenWords = spokenText.trim().split(/\s+/).filter(w => w.length > 0);
  
    const normalizedOriginals = originalWords.map(normalizeArabic);
    const normalizedSpokens = spokenWords.map(normalizeArabic);

    const statuses: WordStatus[] = Array(originalWords.length).fill('pending');
    let correctCount = 0;
    let incorrectCount = 0;
    
    let originalIdx = 0;
    for (let spokenIdx = 0; spokenIdx < normalizedSpokens.length; spokenIdx++) {
        if (originalIdx >= normalizedOriginals.length) break;

        const spokenWord = normalizedSpokens[spokenIdx];
        let foundMatch = false;
        
        const searchWindow = 2; // How many words to look ahead for a match

        for (let lookahead = 0; lookahead <= searchWindow && originalIdx + lookahead < normalizedOriginals.length; lookahead++) {
            const originalWord = normalizedOriginals[originalIdx + lookahead];
            const distance = levenshteinDistance(originalWord, spokenWord);
            const threshold = originalWord.length > 3 ? 1 : 0;

            if (distance <= threshold) {
                // Mark skipped words as incorrect
                for (let i = 0; i < lookahead; i++) {
                    if (statuses[originalIdx + i] === 'pending') {
                        statuses[originalIdx + i] = 'incorrect';
                        incorrectCount++;
                    }
                }
                statuses[originalIdx + lookahead] = 'correct';
                correctCount++;
                originalIdx += lookahead + 1;
                foundMatch = true;
                break;
            }
        }

        if (!foundMatch) {
            // No match in window, assume current word is incorrect and move on
            statuses[originalIdx] = 'incorrect';
            incorrectCount++;
            originalIdx++;
        }
    }
    
    const currentWordIndex = originalIdx;
    if (currentWordIndex < originalWords.length) {
        statuses[currentWordIndex] = 'current';
    }

    return { statuses, currentWordIndex, correctCount, incorrectCount };
};

export const getFullTextAndWordMap = (surah: Surah, range: {start: number, end: number}) => {
    const ayahsInRange = surah.ayahs.slice(range.start - 1, range.end);
    
    let fullText = '';
    const wordMap: {ayahId: number, wordIndex: number, originalWord: string}[] = [];
    
    ayahsInRange.forEach((ayah: Ayah) => {
        const words = ayah.text.split(/\s+/).filter(Boolean);
        words.forEach((word: string, index: number) => {
            wordMap.push({
                ayahId: ayah.id,
                wordIndex: index,
                originalWord: word
            });
        });
        fullText += ayah.text + ' ';
    });
    
    const originalWords = fullText.trim().split(/\s+/).filter(Boolean);
    return {
        fullText: fullText.trim(),
        wordMap,
        originalWords,
    };
};