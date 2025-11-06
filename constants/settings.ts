import { Reciter, Translation } from '../types';
import { EN_SAHIH_TRANSLATION } from '../data/en_sahih';
import { EN_QARAI_TRANSLATION } from '../data/en_qarai';

export const RECITERS: Reciter[] = [
    { 
        id: 'zephyr', 
        name: 'Female: Murattal (Clear, Teacher-like)', 
        voice: 'Zephyr', 
        stylePrompt: "Recite clearly and sincerely with a female voice in the Murattal style. Focus on perfect Tajweed, clear articulation, and a measured pace for teaching. The tone should be reverent and humble (Khushu):",
        defaultPitch: 0.98,
        defaultSpeed: 0.98,
    },
    { 
        id: 'kore', 
        name: 'Female: Murattal (Serene & Reflective)', 
        voice: 'Kore', 
        stylePrompt: "Recite with a serene and deeply reflective female voice in a beautiful Murattal style. The delivery should be gentle, with perfect Tajweed and full of humility (Khushu) to encourage contemplation (Tadabbur):",
        defaultPitch: 1.0,
        defaultSpeed: 1.0,
    },
    { 
        id: 'kore-mujawwad', 
        name: 'Female: Mujawwad (Melodic & Emotive)', 
        voice: 'Kore', 
        stylePrompt: "Recite with a highly melodic and emotive female voice in the Mujawwad style. Use an ornamental, artistic delivery with various Maqamat to convey the meaning and emotion of the verses, while maintaining perfect Tajweed:",
        defaultPitch: 1.02,
        defaultSpeed: 0.98,
    },
    { 
        id: 'puck-murattal', 
        name: 'Male: Murattal (Standard, Clear)', 
        voice: 'Puck', 
        stylePrompt: "Recite in a standard Murattal style with a clear, melodious male voice. Use a measured pace with correct Tajweed and articulation (Makharij). The tone should be reverent:",
        defaultPitch: 1.0,
        defaultSpeed: 1.0,
    },
    { 
        id: 'puck-tadwir', 
        name: 'Male: Tadwir (Moderate & Rhythmic)', 
        voice: 'Puck', 
        stylePrompt: "Recite with a powerful and rhythmic male voice in the Tadwir style. The pace should be moderate and flowing, with impeccable Tajweed and a clear, sincere delivery:",
        defaultPitch: 1.0,
        defaultSpeed: 1.05,
    },
    { 
        id: 'fenrir-emotional', 
        name: 'Male: Murattal (Emotional & Intense)', 
        voice: 'Fenrir', 
        stylePrompt: "Recite in a deeply emotional and intense Murattal style with a male voice. Incorporate a slight influence from Tahqiq for meticulous articulation. The delivery should be dramatic and heartfelt with powerful breath control:",
        defaultPitch: 1.0,
        defaultSpeed: 1.0,
    },
    { 
        id: 'charon', 
        name: 'Male: Tahqiq (Slow & Meticulous)', 
        voice: 'Charon', 
        stylePrompt: "Recite in the Tahqiq style with a clear, authoritative, and meticulous male voice for teaching Tajweed. The pace must be slow and deliberate, ensuring every letter is perfectly articulated with humility and reverence:",
        defaultPitch: 1.0,
        defaultSpeed: 0.95,
    },
    { 
        id: 'fenrir', 
        name: 'Male: Mujawwad (Minshawi Inspired)', 
        voice: 'Fenrir', 
        stylePrompt: "Recite in a Mujawwad style with a deeply spiritual and heartfelt male voice, inspired by Sheikh Muhammad Siddiq al-Minshawi. The delivery should be melodic with profound humility (huzn), masterful Tajweed, and controlled pacing:",
        defaultPitch: 1.0,
        defaultSpeed: 1.0,
    },
    { 
        id: 'puck', 
        name: 'Male: Mujawwad (Abdul Basit Inspired)', 
        voice: 'Puck', 
        stylePrompt: "Recite in a powerful and beautiful Mujawwad style with a male voice, inspired by Sheikh Abdul Basit Abdus-Samad. The delivery should be majestic and emotional, with exceptional breath control and intricate melodic variations (Tarannum):",
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
        stylePrompt: "Recite for instructional purposes with an exceptionally clear, precise, and patient male voice. Use a very slow Tahqiq style to emphasize Tajweed rules, with perfectly articulated letters and vowels:",
        defaultPitch: 1.0,
        defaultSpeed: 0.9,
    },
    {
        id: 'charon-maqamat',
        name: 'Male: Maqamat (Dramatic & Melodic)',
        voice: 'Charon',
        stylePrompt: "Recite in a highly melodic and rhythmic Maqamat style, combining the articulation of Tahqiq with the pace of Tadwir. The voice should be clear, rich, and inspired by the grand masters, conveying both majestic beauty and profound humility (Khushu). Use dynamic Maqamat intonation (like Rast, Bayati, Sikah) and add a slight reverb effect:",
        defaultPitch: 1.2,
        defaultSpeed: 1.18
    }
];

export const TRANSLATIONS: Translation[] = [
    { id: 'none', name: 'None', translator: 'Display Arabic only', data: null },
    { id: 'en_sahih', name: 'English', translator: 'Sahih International', data: EN_SAHIH_TRANSLATION },
    { id: 'en_qarai', name: 'English', translator: 'Ali Quli Qara\'i', data: EN_QARAI_TRANSLATION },
];