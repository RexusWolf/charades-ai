import type { Card } from '../types';

export interface SavedDeck {
    id: string;
    name: string;
    topic: string;
    cards: Card[];
    createdAt: Date;
    lastUsed?: Date;
    useCount: number;
}

const STORAGE_KEY = 'charades-saved-decks';

export function saveDeck(deck: Card[], topic: string, name?: string): SavedDeck {
    const savedDecks = getSavedDecks();

    const newDeck: SavedDeck = {
        id: `deck-${Date.now()}`,
        name: name || topic,
        topic,
        cards: deck,
        createdAt: new Date(),
        useCount: 0
    };

    savedDecks.push(newDeck);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDecks));

    return newDeck;
}

export function getSavedDecks(): SavedDeck[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const decks = JSON.parse(stored);
        // Convert date strings back to Date objects
        return decks.map((deck: any) => ({
            ...deck,
            createdAt: new Date(deck.createdAt),
            lastUsed: deck.lastUsed ? new Date(deck.lastUsed) : undefined
        }));
    } catch (error) {
        console.error('Error loading saved decks:', error);
        return [];
    }
}

export function loadDeck(deckId: string): Card[] | null {
    const savedDecks = getSavedDecks();
    const deck = savedDecks.find(d => d.id === deckId);

    if (!deck) return null;

    // Update usage statistics
    deck.lastUsed = new Date();
    deck.useCount++;

    // Save updated stats
    const updatedDecks = savedDecks.map(d =>
        d.id === deckId ? deck : d
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDecks));

    return deck.cards;
}

export function deleteDeck(deckId: string): boolean {
    const savedDecks = getSavedDecks();
    const filteredDecks = savedDecks.filter(d => d.id !== deckId);

    if (filteredDecks.length === savedDecks.length) {
        return false; // Deck not found
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredDecks));
    return true;
}

export function renameDeck(deckId: string, newName: string): boolean {
    const savedDecks = getSavedDecks();
    const deck = savedDecks.find(d => d.id === deckId);

    if (!deck) return false;

    deck.name = newName;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDecks));
    return true;
}

export function getDeckStats(): { total: number; totalCards: number; mostUsed: SavedDeck | null } {
    const savedDecks = getSavedDecks();
    const total = savedDecks.length;
    const totalCards = savedDecks.reduce((sum, deck) => sum + deck.cards.length, 0);
    const mostUsed = savedDecks.reduce((max, deck) =>
        deck.useCount > (max?.useCount || 0) ? deck : max, null as SavedDeck | null
    );

    return { total, totalCards, mostUsed };
} 