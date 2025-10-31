import { GoogleGenAI, Modality } from "@google/genai";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  // This provides a clear error if the API key isn't configured in the deployment environment.
  throw new Error("API_KEY environment variable is not set. Please ensure it is configured in your deployment environment.");
}

const ai = new GoogleGenAI({ apiKey });

export async function generateSpeech(
  text: string, 
  voiceName: 'Zephyr' | 'Kore' | 'Puck' | 'Charon' | 'Fenrir' = 'Zephyr',
  stylePrompt?: string
): Promise<string> {
  try {
    // Sanitize text for TTS, removing non-pronounced symbols.
    const cleanText = text.replace(/[۞۩]/g, '').trim();
    if (!cleanText) {
        throw new Error("Input text is empty after sanitization.");
    }

    const finalText = stylePrompt ? `${stylePrompt}${cleanText}` : cleanText;
      
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
