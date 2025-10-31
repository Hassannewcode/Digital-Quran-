import { Reciter, Translation } from '../types';
import { EN_SAHIH_TRANSLATION } from '../data/en_sahih';
import { EN_QARAI_TRANSLATION } from '../data/en_qarai';

export const RECITERS: Reciter[] = [
    { id: 'zephyr', name: 'Female: Murattal (Clear, Teacher-like)', voice: 'Zephyr', stylePrompt: "Recite in a clear, beautiful, and reverent Murattal style with a female voice:" },
    { id: 'kore', name: 'Female: Murattal (Serene & Reflective)', voice: 'Kore', stylePrompt: "Recite in a serene, reflective, and beautiful Murattal style with a female voice:" },
    { id: 'puck-tadwir', name: 'Male: Tadwir (Moderate & Rhythmic)', voice: 'Puck', stylePrompt: "Recite in a rhythmic and flowing Tadwir style with a male voice:" },
    { id: 'charon', name: 'Male: Tahqiq (Slow & Meticulous)', voice: 'Charon', stylePrompt: "Recite in a slow, meticulous, and clear Tahqiq style for teaching, with a male voice:" },
    { id: 'fenrir', name: 'Male: Mujawwad (Minshawi Inspired)', voice: 'Fenrir', stylePrompt: "Recite in a deeply spiritual and melodic Mujawwad style, inspired by Sheikh Al-Minshawi:" },
    { id: 'puck', name: 'Male: Mujawwad (Abdul Basit Inspired)', voice: 'Puck', stylePrompt: "Recite in a powerful and emotional Mujawwad style, inspired by Sheikh Abdul Basit:" },
    { id: 'puck-warsh', name: 'Male: Warsh (North African Style)', voice: 'Puck', stylePrompt: "Recite with the Warsh transmission, known for its distinct North African melodic tradition:" },
    { id: 'charon-instructional', name: 'Male: Instructional (For Tajweed Students)', voice: 'Charon', stylePrompt: "Recite with exceptionally clear and precise Instructional Tajweed for students, with a male voice:" },
];

export const TRANSLATIONS: Translation[] = [
    { id: 'none', name: 'None', translator: 'Display Arabic only', data: null },
    { id: 'en_sahih', name: 'English', translator: 'Sahih International', data: EN_SAHIH_TRANSLATION },
    { id: 'en_qarai', name: 'English', translator: 'Ali Quli Qara\'i', data: EN_QARAI_TRANSLATION },
];