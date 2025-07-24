import type { DeckCard } from "../components/Card/DeckCard";
import { Language } from "../data/language";

interface GeminiResponse {
    candidates: Array<{
        content: {
            parts: Array<{
                text: string;
            }>;
        };
    }>;
}

type AIGeneratedCard = string;

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
	- Generate up to ${cardCount} cards, but return less if the topic is too specific or narrow
	
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
        const content = data.candidates[0]?.content?.parts[0]?.text;

        if (!content) {
            throw new Error('No response content from Gemini');
        }

        // Try to parse the JSON response
        let cards: AIGeneratedCard[];
        try {
            // Clean the response in case it has markdown formatting
            let cleanContent = content.trim();

            // Remove markdown code blocks
            if (cleanContent.startsWith('```json')) {
                cleanContent = cleanContent.replace(/^```json\n?/, '');
            }
            if (cleanContent.startsWith('```')) {
                cleanContent = cleanContent.replace(/^```\n?/, '');
            }
            if (cleanContent.endsWith('```')) {
                cleanContent = cleanContent.replace(/\n?```$/, '');
            }

            // Remove any trailing text after the JSON array
            const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                cleanContent = jsonMatch[0];
            }

            cards = JSON.parse(cleanContent);
        } catch (error) {
            console.error('Failed to parse Gemini response:', content);
            console.error('Parse error:', error);
            throw new Error('Invalid response format from AI');
        }

        // Validate and convert to Card format
        if (!Array.isArray(cards)) {
            throw new Error('AI response is not an array');
        }

        return cards;

    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error(`Failed to generate deck: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
} 