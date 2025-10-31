import { GoogleGenAI, Modality } from "@google/genai";

function sanitizeAndPreparePrompt(
    text: string, 
    stylePrompt?: string,
    pitch: number = 1.0,
    speed: number = 1.0
): string {
    // Sanitize text for TTS, removing non-pronounced symbols.
    let cleanText = text.replace(/[۞۩]/g, '').trim();
    
    // UNIVERSAL FIX for audio artifacts on long vowels (Madd).
    // The pre-composed character 'آ' (ALEF WITH MADDA ABOVE) can cause a buzzing/vibrating sound.
    // Replacing it with two standard Alefs 'اا' produces a more natural long vowel sound from the TTS model.
    cleanText = cleanText.replace(/آ/g, 'اا');

    const speedAndPitchInstruction = (speed !== 1.0 || pitch !== 1.0) 
        ? `Say at ${speed}x speed and ${pitch}x pitch: ` 
        : '';
    
    const finalPrompt = stylePrompt 
        ? `${stylePrompt} ${speedAndPitchInstruction}`
        : speedAndPitchInstruction;

    return `${finalPrompt}${cleanText}`.trim();
}


export async function generateSpeech(
  text: string, 
  voiceName: 'Zephyr' | 'Kore' | 'Puck' | 'Charon' | 'Fenrir' = 'Zephyr',
  stylePrompt?: string,
  pitch: number = 1.0,
  speed: number = 1.0,
): Promise<string> {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    // Throw a specific error that the UI can catch and handle gracefully.
    throw new Error("API_KEY is not configured. Please set it in your environment variables.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  try {
    const finalText = sanitizeAndPreparePrompt(text, stylePrompt, pitch, speed);
    if (!finalText) {
        throw new Error("Input text is empty after sanitization.");
    }
      
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: finalText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      console.error("API response did not contain audio data.", JSON.stringify(response, null, 2));
      throw new Error("No audio data returned from API.");
    }

    return base64Audio;
  } catch (error) {
    console.error(`Error generating speech for voice ${voiceName}:`, error);
    // Re-throw the error so it can be handled by the UI layer
    throw error;
  }
}