import type { Card } from "../components/Card/Card";
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

interface AIGeneratedCard {
    word: string;
    category: string;
}

export async function generateDeckWithGemini(topic: string, userApiKey?: string, cardCount: number = 30, language: Language = Language.universal()): Promise<Card[]> {
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
	- Each card should have a word/phrase and a category
	- Words should be appropriate for charades (can be acted out)
	- Categories should be relevant to the topic
	- Return as JSON array with format: [{"word": "example", "category": "category"}]
	- Keep words simple and well-known in the target language
	- Avoid offensive or inappropriate content
	- Generate exactly ${cardCount} cards
	
	Examples:
	For "animals" in English:
	[
		{"word": "Elephant", "category": "Animals"},
		{"word": "Lion", "category": "Animals"},
		{"word": "Penguin", "category": "Animals"}
	]
	
	For "animals" in Spanish:
	[
		{"word": "Elefante", "category": "Animals (Spanish)"},
		{"word": "León", "category": "Animals (Spanish)"},
		{"word": "Pingüino", "category": "Animals (Spanish)"}
	]`;

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
                                text: `You are a helpful assistant that generates charades cards. Always respond with valid JSON arrays. ${prompt}`
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
            const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
            cards = JSON.parse(cleanContent);
        } catch {
            console.error('Failed to parse Gemini response:', content);
            throw new Error('Invalid response format from AI');
        }

        // Validate and convert to Card format
        if (!Array.isArray(cards)) {
            throw new Error('AI response is not an array');
        }

        // Convert to Card format with IDs
        return cards.map((card, index) => ({
            id: Date.now() + index,
            word: card.word || `Generated ${index + 1}`,
            deckId: undefined // AI generated cards don't belong to a specific deck
        }));

    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error(`Failed to generate deck: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
} 