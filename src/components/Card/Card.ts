// Simple card definition for deck files
export type DeckCard = string;

// Game card with additional properties needed during gameplay
export interface Card {
    id: number;
    word: string;
    deckId?: string; // Optional: tracks which deck the card came from
}
