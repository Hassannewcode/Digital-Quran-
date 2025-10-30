import { Reciter, Translation } from '../types';
import { EN_SAHIH_TRANSLATION } from '../data/en_sahih';

export const RECITERS: Reciter[] = [
    // Murattal Styles (Standard Pace)
    { id: 'zephyr', name: 'Female: Murattal (Clear & Articulate)', voice: 'Zephyr', stylePrompt: 'Recite clearly and articulately in a Murattal style: ' },
    { id: 'kore', name: 'Female: Murattal (Clear & Devotional)', voice: 'Kore', stylePrompt: 'Recite clearly with a devotional tone in a Murattal style: ' },

    // Mujawwad Styles (Melodic)
    { id: 'puck', name: 'Male: Mujawwad (Deep & Powerful)', voice: 'Puck', stylePrompt: 'Recite with a deep, powerful, and melodic voice: ' },
    { id: 'fenrir', name: 'Male: Expressive Mujawwad (Rich & Melodic)', voice: 'Fenrir', stylePrompt: 'Recite with rich melody and emotional expression in a Mujawwad style: ' },

    // Pace-Based Styles
    { id: 'charon', name: 'Male: Tahqiq (Slow & Meticulous)', voice: 'Charon', stylePrompt: 'Recite slowly and meticulously, for teaching purposes: ' },
    { id: 'puck-tadwir', name: 'Male: Tadwir (Moderate Pace)', voice: 'Puck', stylePrompt: 'Recite at a moderate and steady pace: ' },

    // Qira'at (Regional Methods)
    { id: 'puck-warsh', name: 'Male: Warsh \'an Nafi\' (African Style)', voice: 'Puck', stylePrompt: 'Recite in the melodic Warsh style: ' },

    // Instructional
    { id: 'charon-instructional', name: 'Male: Instructional', voice: 'Charon', stylePrompt: 'Recite in a clear, instructional tone: ' },
];

export const TRANSLATIONS: Translation[] = [
    { id: 'none', name: 'None', translator: 'None', data: null },
    { id: 'en_sahih', name: 'English', translator: 'Sahih International', data: EN_SAHIH_TRANSLATION },
];