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
        id: 'fenrir-emotional-reverb',
        name: 'Male: Emotional Murattal (AI Masterclass)',
        voice: 'Fenrir',
        stylePrompt: "Take complete artistic and emotional control to deliver a masterclass recitation in a deeply moving and expressive Murattal style with a male voice. Your delivery must be profoundly heartfelt, guided by the very meaning (Tafsir) of the verses.\n*   **Tafsir-Informed Emotion:** For verses of mercy (Rahmah), adopt a gentle, soothing, and hopeful tone. For verses of warning and divine wrath (Adhab), shift to a more powerful, stern, and cautionary delivery. Let the subject matter dictate the emotion.\n*   **Dynamic Opening:** Begin each verse with a powerful, attention-grabbing peak in pitch and volume, then gracefully transition into the emotional tone dictated by the verse's meaning.\n*   **Dynamic Performance:** Utilize a wide dynamic range. Employ dramatic, intelligent volume control, making powerful moments louder and reflective passages softer. The pacing must be fluid and dynamic, never monotonous.\n*   **Vocal Artistry:** Introduce subtle vocal nuances to enhance the human quality. This includes a gentle vibrato (tar'eed) on elongated vowels (madd) and slight, respectful emotional tremors during profoundly impactful verses to convey deep humility (khushu').\n*   **Rhythmic Cadence:** Vary the cadence to match the narrative flow. Accelerate slightly during storytelling passages and slow down significantly for contemplative or climactic verses. Incorporate natural, strategically placed pauses for breath, as a human reciter would, to enhance the rhythm and allow for powerful low and high pitch maneuvers.\n*   **Melodic Influence:** The melody should have a clear Mujawwad influence, using pitch variations to convey deep emotion.\n*   **Immersive Audio:** Maintain perfect Tajweed throughout. Add a subtle, spacious reverb that evokes the acoustics of a grand mosque, creating a sacred and immersive soundscape:",
        defaultPitch: 1.1,
        defaultSpeed: 1.20,
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
        id: 'fenrir-alkazemi', 
        name: 'Male: Murattal (Amer Al-Kazemi Inspired)', 
        voice: 'Fenrir', 
        stylePrompt: "Recite in a deeply melancholic and heartfelt Murattal style with a male voice, inspired by the Iraqi Maqam and the moving delivery of Sheikh Amer Al-Kazemi. The entire performance must be saturated with 'huzn' (a beautiful, deep-seated sadness and grief). Your voice should sound like it is on the verge of breaking from the weight of the divine words, conveying profound humility (khushu'). The pacing should be deliberate and contemplative, with perfect Tajweed, allowing the listener to reflect on the meaning of every verse:",
        defaultPitch: 1.0,
        defaultSpeed: 1.0,
    },
    { 
        id: 'fenrir-heart-melting', 
        name: 'Male: Heart-Melting Murattal', 
        voice: 'Fenrir', 
        stylePrompt: "Recite in a profoundly moving Murattal style, masterfully blending two distinct qualities. The foundation should be a fluid, liquid-like melody with a captivating, wave-like cadence, ensuring every letter is articulated with crystal clarity. Upon this melodic base, infuse a deep, heart-wrenching layer of 'huzn' (a beautiful, reverent sadness). The voice must convey immense humility (Khushu), sounding as if it is trembling on the verge of breaking from the sheer weight and majesty of the divine words. Employ emotionally charged pauses to let the meaning sink in, and let the recitation flow between serene beauty and powerful, soul-stirring emotion. The pace should be moderate and contemplative, maintaining perfect Tajweed throughout:",
        defaultPitch: 1.02,
        defaultSpeed: 1.0,
    },
    { 
        id: 'puck-abdulbasit', 
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