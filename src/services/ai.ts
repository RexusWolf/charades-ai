import type { DeckCard } from "../components/Card/DeckCard";
import { Language } from "../data/language";
import { ResponseMapper } from "./ResponseMapper";

export interface GeminiResponse {
    candidates: Array<{
        content: {
            parts: Array<{
                text: string;
            }>;
        };
        finishReason?: string;
    }>;
}

export async function generateDeckWithGemini(topic: string, userApiKey?: string, cardCount: number = 30, language: Language = Language.universal()): Promise<DeckCard[]> {
    const apiKey = userApiKey || import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables or provide it in the app.');
    }

    const languageInstruction = language.code === "universal"
        ? "Generate cards in the most appropriate language based on the topic. If the topic mentions a specific language, use that language. Otherwise, use English."
        : `Generate all cards in ${language.display}. Use words and phrases that are common and well-known in ${language.display}.`;

    const prompt = `Generate ${cardCount} charades cards for the topic "${topic}". 
	
	LANGUAGE INSTRUCTION: ${languageInstruction}
	
	Requirements:
	- Return ONLY a simple JSON array like: ["word1","word2","word3"]
	- No formatting, no newlines, no extra text
	- Keep words simple and well-known in the target language
	- Avoid offensive or inappropriate content
	- Generate a maximum of ${cardCount} cards.
    If the topic is too specific or narrow, less than ${cardCount} cards are allowed.
	
	Examples:
	For "animals" in English: ["Elephant","Lion","Penguin"]
	For "animals" in Spanish: ["Elefante","León","Pingüino"]`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `You are a helpful assistant that generates charades cards. Always respond with valid arrays. ${prompt}`
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000,
                }
            }),
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
        }

        const data: GeminiResponse = await response.json();
        return ResponseMapper.mapGeminiResponseToCards(data);

    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error(`Failed to generate deck: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
} 