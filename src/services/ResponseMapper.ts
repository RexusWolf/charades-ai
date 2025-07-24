/** biome-ignore-all lint/complexity/noStaticOnlyClass: Mappers are allowed to use only static methods */
import type { DeckCard } from "../components/Card/DeckCard";
import type { GeminiResponse } from "./ai";

type AIGeneratedCard = string;

export class ResponseMapper {
    /**
     * Maps a Gemini API response to an array of DeckCard objects
     */
    static mapGeminiResponseToCards(response: GeminiResponse): DeckCard[] {
        const content = response.candidates[0]?.content?.parts[0]?.text;
        const finishReason = response.candidates[0]?.finishReason;

        if (!content) {
            throw new Error('No response content from Gemini');
        }

        return ResponseMapper.parseCardsFromContent(content, finishReason);
    }

    /**
     * Parses card strings from AI response content
     */
    static parseCardsFromContent(content: string, finishReason?: string): AIGeneratedCard[] {
        const cleanContent = ResponseMapper.cleanResponseContent(content);

        // If response was truncated due to token limit, extract valid strings
        if (finishReason === 'MAX_TOKENS') {
            return ResponseMapper.extractValidStringsFromIncomplete(cleanContent);
        }

        // Try to parse as complete JSON first
        try {
            const cards = JSON.parse(cleanContent);

            if (!Array.isArray(cards)) {
                throw new Error('AI response is not an array');
            }

            return cards.filter((card: AIGeneratedCard): card is string => typeof card === 'string');
        } catch {
            // If JSON parsing fails, try to extract valid strings
            return ResponseMapper.extractValidStringsFromIncomplete(cleanContent);
        }
    }

    /**
     * Extracts valid string entries from incomplete content
     */
    private static extractValidStringsFromIncomplete(content: string): string[] {
        const strings: string[] = [];

        // First, try to find complete array items
        const completeItemRegex = /"([^"]+)"(?:\s*,\s*|(?:\s*\]))/g;
        let match: RegExpExecArray | null = completeItemRegex.exec(content);

        while (match !== null) {
            strings.push(match[1]);
            match = completeItemRegex.exec(content);
        }

        return strings;
    }

    /**
     * Cleans response content by removing markdown formatting
     */
    private static cleanResponseContent(content: string): string {
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

        return cleanContent;
    }
} 