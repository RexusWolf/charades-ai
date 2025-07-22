import type { Card } from '../types';

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

export async function generateDeckWithGemini(topic: string, userApiKey?: string, cardCount: number = 15): Promise<Card[]> {
    const apiKey = userApiKey || import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables or provide it in the app.');
    }

    const prompt = `Generate ${cardCount} charades cards for the topic "${topic}". 
	
	IMPORTANT LANGUAGE INSTRUCTIONS:
	- If the topic mentions a specific language (e.g., "Spanish", "French", "German", "Italian", "Portuguese", "Japanese", "Chinese", "Korean", "Russian", "Arabic", "Hindi", etc.), generate cards in that language
	- If no specific language is mentioned, generate cards in English
	- For non-English cards, provide both the word in the target language AND its English translation in the category field
	- Example: For "Spanish animals" → {"word": "Elefante", "category": "Animals (Spanish)"}
	
	Requirements:
	- Each card should have a word/phrase and a category
	- Words should be appropriate for charades (can be acted out)
	- Categories should be relevant to the topic and indicate the language if applicable
	- Return as JSON array with format: [{"word": "example", "category": "category"}]
	- Keep words simple and well-known in the target language
	- Avoid offensive or inappropriate content
	- For language-specific topics, use common, recognizable words in that language
	- Generate exactly ${cardCount} cards
	
	Examples:
	For "animals" (English):
	[
		{"word": "Elephant", "category": "Animals"},
		{"word": "Lion", "category": "Animals"},
		{"word": "Penguin", "category": "Animals"}
	]
	
	For "Spanish TV Series":
	[
		{"word": "La Casa de Papel", "category": "TV Series (Spanish)"},
		{"word": "Élite", "category": "TV Series (Spanish)"},
		{"word": "Narcos", "category": "TV Series (Spanish)"}
	]
	
	For "French food":
	[
		{"word": "Croissant", "category": "Food (French)"},
		{"word": "Baguette", "category": "Food (French)"},
		{"word": "Ratatouille", "category": "Food (French)"}
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
        } catch (parseError) {
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
            category: card.category || topic
        }));

    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error(`Failed to generate deck: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
} 