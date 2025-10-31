import { Reciter, Translation } from '../types';
import { EN_SAHIH_TRANSLATION } from '../data/en_sahih';

// Placeholder for new translation data.
const EN_QARAI_TRANSLATION: Record<string, Record<string, string>> = {};

export const RECITERS: Reciter[] = [
    // Murattal Styles
    { id: 'zephyr', name: 'Female: Murattal (Clear, Teacher-like)', voice: 'Zephyr', stylePrompt: "Recite in a clear, articulate, and masterfully controlled Murattal (Tarteel) style. Use a warm, nurturing, and encouraging female voice, like a teacher. Ensure flawless Tajweed, crisp pronunciation, and a measured, steady pace for clarity: " },
    { id: 'kore', name: 'Female: Murattal (Serene & Reflective)', voice: 'Kore', stylePrompt: "Recite in a serene, deeply moving, and devotional Murattal style, as if in prayer. Use a warm, sincere, and heartfelt female voice with an ethereal quality, full of humble submission (khushu'). The pace is gentle and flowing to inspire tranquility. Ensure flawless Tajweed and a natural, understated melodic rhythm: " },
    { id: 'puck-tadwir', name: 'Male: Tadwir (Moderate & Rhythmic)', voice: 'Puck', stylePrompt: "Recite in a masterful, flowing Tadwir style (a moderate pace). Use a resonant, powerful, and confident male voice with a clear, steady rhythm that is engaging and easy to follow. Ensure flawless Tajweed, including all rules of Madd, Ghunnah, and articulation: " },
    { id: 'charon', name: 'Male: Tahqiq (Slow & Meticulous)', voice: 'Charon', stylePrompt: "Recite in a flawless Tahqiq style. Use a deep, commanding, yet humble voice filled with reverence. The pace must be exceptionally slow, clear, and meticulous, focusing on perfect articulation (Makharij) of every letter and Tajweed rule. The tone should be deeply reverent and authoritative: " },

    // Mujawwad Styles
    { id: 'fenrir', name: 'Male: Mujawwad (Minshawi Inspired)', voice: 'Fenrir', stylePrompt: "Recite in a masterful Mujawwad style inspired by Sheikh al-Minshawi. The voice must be deeply resonant, conveying a profound sense of huzn (reverent sadness) and humility with a pure, slightly nasal timbre. Use varied pacing with contemplative pauses, flawless Tajweed, clear articulation, and masterful control over melodic transitions and elongations (Madd), with a beautiful ghunnah (nasalization): " },
    { id: 'puck', name: 'Male: Mujawwad (Abdul Basit Inspired)', voice: 'Puck', stylePrompt: "Recite in a grand, majestic, and melodic Mujawwad style inspired by Sheikh Abdul Basit. Use a powerful, golden, and exceptionally controlled voice filled with awe. Feature flawless Tajweed and legendary breath control for long, soaring melodic phrases. Use dynamic vocal modulation and precise, resonant elongations (Madd): " },

    // Other Styles
    { id: 'puck-warsh', name: 'Male: Warsh (North African Style)', voice: 'Puck', stylePrompt: "Recite with mastery, strictly following the Warsh 'an Nafi' recitation method. Use a powerful, resonant voice with a distinctive North African timbre and melodic flow. Ensure flawless and authentic Tajweed on every letter, including all rules of pronunciation, merging, and elongation: " },
    { id: 'charon-instructional', name: 'Male: Instructional (For Tajweed Students)', voice: 'Charon', stylePrompt: "Recite in a clear, instructional tone for teaching Tajweed. The pace should be moderate and deliberate. Use an authoritative yet encouraging male voice with a clear, higher-pitched tone. Articulate every letter and rule with exceptional clarity and textbook perfection, slightly emphasizing points of articulation for students to imitate: " },
];

export const TRANSLATIONS: Translation[] = [
    { id: 'none', name: 'None', translator: 'Display Arabic only', data: null },
    { id: 'en_sahih', name: 'English', translator: 'Sahih International', data: EN_SAHIH_TRANSLATION },
    { id: 'en_qarai', name: 'English', translator: 'Ali Quli Qara\'i', data: EN_QARAI_TRANSLATION },
];