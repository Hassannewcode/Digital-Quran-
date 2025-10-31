import { Reciter, Translation } from '../types';
import { EN_SAHIH_TRANSLATION } from '../data/en_sahih';
import { EN_QARAI_TRANSLATION } from '../data/en_qarai';

export const RECITERS: Reciter[] = [
    { 
        id: 'zephyr', 
        name: 'Female: Murattal (Clear, Teacher-like)', 
        voice: 'Zephyr', 
        stylePrompt: "Recite with a clear, confident, and sincere female voice. The style should be Murattal, with perfect Tajweed, focusing on clear articulation and a measured pace suitable for teaching and contemplation. The tone should be beautiful, reverent, and full of humility (Khushu):",
        defaultPitch: 1.0,
        defaultSpeed: 1.0,
    },
    { 
        id: 'kore', 
        name: 'Female: Murattal (Serene & Reflective)', 
        voice: 'Kore', 
        stylePrompt: "Recite with a serene, deeply reflective, and sincere female voice. The style should be a beautiful Murattal, perfect in its Tajweed. The delivery should be gentle and full of humility, encouraging contemplation (Tadabbur) and connecting the listener's heart to the meaning of the verses:",
        defaultPitch: 1.0,
        defaultSpeed: 1.0,
    },
    { 
        id: 'puck-tadwir', 
        name: 'Male: Tadwir (Moderate & Rhythmic)', 
        voice: 'Puck', 
        stylePrompt: "Recite with a powerful, confident, and rhythmic male voice in the Tadwir style. The pace should be moderate and flowing, faster than Tahqiq but slower than Hadr, with impeccable Tajweed. The delivery must be clear, sincere, and emotionally connected to the text:",
        defaultPitch: 1.0,
        defaultSpeed: 1.05,
    },
    { 
        id: 'charon', 
        name: 'Male: Tahqiq (Slow & Meticulous)', 
        voice: 'Charon', 
        stylePrompt: "Recite with a clear, authoritative, and meticulous male voice in the Tahqiq style, ideal for teaching Tajweed. The pace must be slow and deliberate, ensuring every letter's articulation point (makhraj) and characteristic (sifat) is perfectly clear. The recitation should be full of humility and reverence:",
        defaultPitch: 1.0,
        defaultSpeed: 0.95,
    },
    { 
        id: 'fenrir', 
        name: 'Male: Mujawwad (Minshawi Inspired)', 
        voice: 'Fenrir', 
        stylePrompt: "Recite with a deeply spiritual, heartfelt, and melodic male voice in the Mujawwad style, capturing the profound humility and reflective sadness (huzn) reminiscent of Sheikh Muhammad Siddiq al-Minshawi. The recitation must have masterful Tajweed, with controlled pacing and a powerful emotional connection that moves the heart:",
        defaultPitch: 1.0,
        defaultSpeed: 1.0,
    },
    { 
        id: 'puck', 
        name: 'Male: Mujawwad (Abdul Basit Inspired)', 
        voice: 'Puck', 
        stylePrompt: "Recite with a powerful, confident, and astonishingly beautiful male voice in the Mujawwad style, inspired by the mastery of Sheikh Abdul Basit Abdus-Samad. The delivery should be majestic and emotional, with exceptional breath control, intricate melodic variations (Tarannum), and perfect Tajweed, creating a deeply moving spiritual experience:",
        defaultPitch: 1.0,
        defaultSpeed: 1.0,
    },
    { 
        id: 'puck-warsh', 
        name: 'Male: Warsh (North African Style)', 
        voice: 'Puck', 
        stylePrompt: "Recite with a rich and melodious male voice according to the Warsh 'an Nafi' transmission. The style should reflect the distinct and beautiful North African melodic tradition, delivered with flawless Tajweed, sincerity, and proper pacing:",
        defaultPitch: 1.0,
        defaultSpeed: 1.0,
    },
    { 
        id: 'charon-instructional', 
        name: 'Male: Instructional (For Tajweed Students)', 
        voice: 'Charon', 
        stylePrompt: "Recite with an exceptionally clear, precise, and patient male voice, designed for instructional purposes. The style should be a very slow Tahqiq, emphasizing the rules of Tajweed, with each letter and vowel perfectly articulated. The delivery should be straightforward and authoritative to aid students in learning correct pronunciation:",
        defaultPitch: 1.0,
        defaultSpeed: 0.9,
    },
    {
        id: 'charon-maqamat',
        name: 'Male: Maqamat (Dramatic & Melodic)',
        voice: 'Charon',
        stylePrompt: `Recite with a clear, sincere, serene, and rich male voice. The style should be an exceptionally melodic and rhythmic union of recitation arts, delivered at a faster, flowing pace. It must combine the meticulous articulation of Tahqiq with the moderate speed of Tadwir. The emotional and melodic character should be inspired by the grand masters: capturing the majestic beauty of Sheikh Abdul Basit Abdus-Samad and the profound, heartfelt humility (Khushu) of Sheikh Muhammad Siddiq al-Minshawi. The recitation must have incredible breath control, following a powerful, rhythmic breathing pattern where each phrase is delivered like a long, controlled exhalation with a gradually falling pitch, preceded by a powerful inhalation that raises the pitch to create a continuous, wave-like melodic flow. Use Maqamat (like Rast, Bayati, and Sikah) for a captivating and dynamic intonation. On long vowels (Madd), hold the sound for 4-6 seconds with a clear 'low-high-low' pitch curve and controlled vibrato. On letters requiring Ghunnah (nasalization), produce a deep, rich, buzzing nasal resonance for two full counts. The final audio should have a slight reverb and echo:`,
        defaultPitch: 1.2,
        defaultSpeed: 1.18
    }
];

export const TRANSLATIONS: Translation[] = [
    { id: 'none', name: 'None', translator: 'Display Arabic only', data: null },
    { id: 'en_sahih', name: 'English', translator: 'Sahih International', data: EN_SAHIH_TRANSLATION },
    { id: 'en_qarai', name: 'English', translator: 'Ali Quli Qara\'i', data: EN_QARAI_TRANSLATION },
];