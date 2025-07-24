import { describe, expect, it } from 'vitest';
import { ResponseMapper } from '../src/services/ResponseMapper';

describe('ResponseMapper', () => {
    describe('parseCardsFromContent', () => {
        it('should parse complete JSON array', () => {
            const content = '["Elephant","Lion","Penguin"]';
            const result = ResponseMapper.parseCardsFromContent(content);
            expect(result).toEqual(['Elephant', 'Lion', 'Penguin']);
        });

        it('should parse JSON with markdown formatting', () => {
            const content = '```json\n["Elephant","Lion","Penguin"]\n```';
            const result = ResponseMapper.parseCardsFromContent(content);
            expect(result).toEqual(['Elephant', 'Lion', 'Penguin']);
        });

        it('should handle incomplete response with MAX_TOKENS finish reason', () => {
            const content = '["Titanic","Dexter\'s Laboratory","Courage the Cowardly Dog","Ed,"';
            const result = ResponseMapper.parseCardsFromContent(content, 'MAX_TOKENS');
            expect(result).toEqual(['Titanic', 'Dexter\'s Laboratory', 'Courage the Cowardly Dog']);
        });

        it('should handle incomplete response without finish reason', () => {
            const content = '["Elephant","Lion","Pengu';
            const result = ResponseMapper.parseCardsFromContent(content);
            expect(result).toEqual(['Elephant', 'Lion']);
        });

        it('should filter out non-string items', () => {
            const content = '["Elephant",123,"Lion",null,"Penguin"]';
            const result = ResponseMapper.parseCardsFromContent(content);
            expect(result).toEqual(['Elephant', 'Lion', 'Penguin']);
        });

        it('should handle empty array', () => {
            const content = '[]';
            const result = ResponseMapper.parseCardsFromContent(content);
            expect(result).toEqual([]);
        });

        it('should handle single item array', () => {
            const content = '["Elephant"]';
            const result = ResponseMapper.parseCardsFromContent(content);
            expect(result).toEqual(['Elephant']);
        });

        it('should handle complex incomplete response', () => {
            const content = '```json\n["Titanic","Dexter\'s Laboratory","Courage the Cowardly Dog","Ed,"';
            const result = ResponseMapper.parseCardsFromContent(content);
            expect(result.length).toBe(3);
            expect(result[0]).toBe('Titanic');
            expect(result[result.length - 1]).toBe('Courage the Cowardly Dog');
        });
    });

    describe('mapGeminiResponseToCards', () => {
        it('should map complete response to DeckCard array', () => {
            const response = {
                candidates: [{
                    content: {
                        parts: [{
                            text: '["Elephant","Lion","Penguin"]'
                        }]
                    },
                    finishReason: 'STOP'
                }]
            };
            const result = ResponseMapper.mapGeminiResponseToCards(response);
            expect(result).toEqual(['Elephant', 'Lion', 'Penguin']);
        });

        it('should map incomplete response with MAX_TOKENS to DeckCard array', () => {
            const response = {
                candidates: [{
                    content: {
                        parts: [{
                            text: '["Titanic","Dexter\'s Laboratory","Courage the Cowardly Dog","Ed,"'
                        }]
                    },
                    finishReason: 'MAX_TOKENS'
                }]
            };
            const result = ResponseMapper.mapGeminiResponseToCards(response);
            expect(result).toEqual(['Titanic', 'Dexter\'s Laboratory', 'Courage the Cowardly Dog']);
        });

        it('should throw error for empty response', () => {
            const response = {
                candidates: []
            };
            expect(() => ResponseMapper.mapGeminiResponseToCards(response)).toThrow('No response content from Gemini');
        });

        it('should throw error for response without content', () => {
            const response = {
                candidates: [{
                    content: {
                        parts: []
                    }
                }]
            };
            expect(() => ResponseMapper.mapGeminiResponseToCards(response)).toThrow('No response content from Gemini');
        });
    });
}); 