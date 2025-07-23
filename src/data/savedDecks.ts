import type { Card } from "../components/Card/Card";

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

// Export functionality
export function exportDecks(): string {
    const savedDecks = getSavedDecks();
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        decks: savedDecks
    };
    return JSON.stringify(exportData, null, 2);
}

// Import functionality
export function importDecks(importData: string): { success: boolean; message: string; importedCount: number } {
    try {
        const data = JSON.parse(importData);

        // Validate the import data structure
        if (!data.decks || !Array.isArray(data.decks)) {
            return { success: false, message: 'Invalid file format. Expected a JSON file with a "decks" array.', importedCount: 0 };
        }

        const existingDecks = getSavedDecks();
        const importedDecks: SavedDeck[] = [];
        let skippedCount = 0;

        for (const importedDeck of data.decks) {
            // Validate deck structure
            if (!importedDeck.name || !importedDeck.topic || !importedDeck.cards || !Array.isArray(importedDeck.cards)) {
                skippedCount++;
                continue;
            }

            // Check for duplicate names
            const isDuplicate = existingDecks.some(existing => existing.name === importedDeck.name);

            if (isDuplicate) {
                // Add suffix to duplicate names
                let newName = importedDeck.name;
                let counter = 1;
                while (existingDecks.some(existing => existing.name === newName) ||
                    importedDecks.some(imported => imported.name === newName)) {
                    newName = `${importedDeck.name} (${counter})`;
                    counter++;
                }
                importedDeck.name = newName;
            }

            // Create new deck with fresh ID and timestamps
            const newDeck: SavedDeck = {
                id: `deck-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: importedDeck.name,
                topic: importedDeck.topic,
                cards: importedDeck.cards.map((card: any, index: number) => ({
                    id: Date.now() + index + Math.random(),
                    word: card.word,
                    category: card.category
                })),
                createdAt: new Date(),
                useCount: 0
            };

            importedDecks.push(newDeck);
        }

        if (importedDecks.length === 0) {
            return { success: false, message: 'No valid decks found in the import file.', importedCount: 0 };
        }

        // Save all decks
        const allDecks = [...existingDecks, ...importedDecks];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allDecks));

        const message = skippedCount > 0
            ? `Imported ${importedDecks.length} decks. ${skippedCount} invalid decks were skipped.`
            : `Successfully imported ${importedDecks.length} decks.`;

        return { success: true, message, importedCount: importedDecks.length };

    } catch (error) {
        console.error('Error importing decks:', error);
        return { success: false, message: 'Failed to parse the import file. Please check the file format.', importedCount: 0 };
    }
}

// Clear all decks (for testing/reset purposes)
export function clearAllDecks(): void {
    localStorage.removeItem(STORAGE_KEY);
} 