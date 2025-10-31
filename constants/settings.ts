import { Reciter, Translation } from '../types';
import { EN_SAHIH_TRANSLATION } from '../data/en_sahih';

// Placeholder for new translation data.
const EN_QARAI_TRANSLATION: Record<string, Record<string, string>> = {};

export const RECITERS: Reciter[] = [
    { id: 'zephyr', name: 'Female: Murattal (Clear, Teacher-like)', voice: 'Zephyr', stylePrompt: "Recite in a clear, nurturing female Murattal style. The pace should be steady and easy to follow, like a teacher guiding a student: " },
    { id: 'kore', name: 'Female: Murattal (Serene & Reflective)', voice: 'Kore', stylePrompt: "Recite in a serene and devotional female Murattal style. The pace should be gentle and flowing, inviting reflection: " },
    { id: 'puck-tadwir', name: 'Male: Tadwir (Moderate & Rhythmic)', voice: 'Puck', stylePrompt: "Recite in the Tadwir style. The male voice should be resonant and confident, with a moderate and rhythmic pace: " },
    { id: 'charon', name: 'Male: Tahqiq (Slow & Meticulous)', voice: 'Charon', stylePrompt: "Recite in the Tahqiq style. The male voice should be deep and reverent, at an exceptionally slow and meticulous pace, clarifying every letter: " },
    { id: 'fenrir', name: 'Male: Mujawwad (Minshawi Inspired)', voice: 'Fenrir', stylePrompt: "Recite in a deeply spiritual Mujawwad style, inspired by Sheikh al-Minshawi. The male voice should be resonant and humble, conveying a sense of reverent sadness and beautiful melody: " },
    { id: 'puck', name: 'Male: Mujawwad (Abdul Basit Inspired)', voice: 'Puck', stylePrompt: "Recite in a grand and majestic Mujawwad style, inspired by Sheikh Abdul Basit. The male voice should be powerful and golden, with exceptional control and a wide vocal range: " },
    { id: 'puck-warsh', name: 'Male: Warsh (North African Style)', voice: 'Puck', stylePrompt: "Recite with mastery in the Warsh 'an Nafi' method. The male voice should be powerful, with a resonant and distinctly North African melodic flow: " },
    { id: 'charon-instructional', name: 'Male: Instructional (For Tajweed Students)', voice: 'Charon', stylePrompt: "Recite with an instructional tone for students of Tajweed. The male voice should be authoritative and exceptionally clear, articulating every point of pronunciation distinctly: " },
];

export const TRANSLATIONS: Translation[] = [
    { id: 'none', name: 'None', translator: 'Display Arabic only', data: null },
    { id: 'en_sahih', name: 'English', translator: 'Sahih International', data: EN_SAHIH_TRANSLATION },
    { id: 'en_qarai', name: 'English', translator: 'Ali Quli Qara\'i', data: EN_QARAI_TRANSLATION },
];
