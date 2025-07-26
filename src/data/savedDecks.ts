import type { DeckCard } from "../components/Card/DeckCard";
import type { Deck } from "./Decks/Deck";
import { Language } from "./language";

const SAVED_DECKS_STORAGE_KEY = 'charades-saved-decks';

interface LocalStorageDeck {
    id: string;
    name: string;
    language: { code: string; display: string };
    cards: string[];
}

export function saveDeck({ deckCards, name, language = Language.universal() }: { deckCards: DeckCard[]; name: string; language?: Language; }): Deck {
    const savedDecks = getSavedDecks();

    const deckId = `deck-${Date.now()}`;
    const newDeck: Deck = {
        id: deckId,
        name: name,
        language,
        cards: deckCards,
    };

    savedDecks.push(newDeck);
    localStorage.setItem(SAVED_DECKS_STORAGE_KEY, JSON.stringify(savedDecks));

    return newDeck;
}

export function getSavedDecks(): Deck[] {
    try {
        const stored = localStorage.getItem(SAVED_DECKS_STORAGE_KEY);
        if (!stored) return [];

        const decks = JSON.parse(stored);
        return decks.map((deck: LocalStorageDeck) => ({
            ...deck,
            language: deck.language ? Language.fromCode(deck.language.code) || Language.universal() : Language.universal(),
            // Ensure cards are strings
            cards: Array.isArray(deck.cards) ? deck.cards.map((card: any) =>
                typeof card === 'object' && card.word ? card.word : card
            ) : []
        }));
    } catch (error) {
        console.error('Error loading saved decks:', error);
        return [];
    }
}

export function getDeckCards(deckId: string): DeckCard[] | null {
    const savedDecks = getSavedDecks();
    const deck = savedDecks.find(d => d.id === deckId);

    if (!deck) return null;

    return deck.cards;
}

export function deleteDeck(deckId: string): boolean {
    const savedDecks = getSavedDecks();
    const filteredDecks = savedDecks.filter(d => d.id !== deckId);

    if (filteredDecks.length === savedDecks.length) {
        return false; // Deck not found
    }

    localStorage.setItem(SAVED_DECKS_STORAGE_KEY, JSON.stringify(filteredDecks));
    return true;
}

export function renameDeck(deckId: string, newName: string): boolean {
    const savedDecks = getSavedDecks();
    const deck = savedDecks.find(d => d.id === deckId);

    if (!deck) return false;

    deck.name = newName;
    localStorage.setItem(SAVED_DECKS_STORAGE_KEY, JSON.stringify(savedDecks));
    return true;
}

export function getDeckStats(): { total: number; totalCards: number } {
    const savedDecks = getSavedDecks();
    const total = savedDecks.length;
    const totalCards = savedDecks.reduce((sum, deck) => sum + deck.cards.length, 0);

    return { total, totalCards };
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
        const importedDecks: Deck[] = [];
        let skippedCount = 0;

        for (const importedDeck of data.decks) {
            // Validate deck structure
            if (!importedDeck.name || !importedDeck.cards || !Array.isArray(importedDeck.cards)) {
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
            const newDeck: Deck = {
                id: `deck-${Date.now()}`,
                name: importedDeck.name,
                language: importedDeck.language || Language.universal(), // Ensure language is set
                cards: importedDeck.cards,
            };

            importedDecks.push(newDeck);
        }

        if (importedDecks.length === 0) {
            return { success: false, message: 'No valid decks found in the import file.', importedCount: 0 };
        }

        // Save all decks
        const allDecks = [...existingDecks, ...importedDecks];
        localStorage.setItem(SAVED_DECKS_STORAGE_KEY, JSON.stringify(allDecks));

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
    localStorage.removeItem(SAVED_DECKS_STORAGE_KEY);
}

// Migration function to ensure all saved decks have a language property and correct card format
export function migrateSavedDecks(): void {
    try {
        console.log("Migrating saved decks");
        const stored = localStorage.getItem(SAVED_DECKS_STORAGE_KEY);
        if (!stored) return;

        const decks = JSON.parse(stored);
        let hasChanges = false;

        const migratedDecks = decks.map((deck: any) => {
            let deckChanges = false;
            let migratedDeck = { ...deck };

            // Migrate language property
            if (!deck.language) {
                deckChanges = true;
                migratedDeck.language = Language.universal();
            } else if (deck.language && typeof deck.language === 'object' && deck.language.code) {
                // Ensure existing language objects are properly reconstructed
                const language = Language.fromCode(deck.language.code);
                if (language) {
                    deckChanges = true;
                    migratedDeck.language = language;
                }
            }

            // Migrate cards from object format to string format
            if (deck.cards && Array.isArray(deck.cards)) {
                const migratedCards = deck.cards.map((card: any) => {
                    if (typeof card === 'object' && card.word) {
                        deckChanges = true;
                        return card.word;
                    }
                    return card;
                });
                migratedDeck.cards = migratedCards;
            }

            if (deckChanges) {
                hasChanges = true;
            }
            return migratedDeck;
        });

        console.log("Migrated decks:", migratedDecks);

        if (hasChanges) {
            localStorage.setItem(SAVED_DECKS_STORAGE_KEY, JSON.stringify(migratedDecks));
            console.log('Migrated saved decks to include language property and correct card format');
        }
    } catch (error) {
        console.error('Error migrating saved decks:', error);
    }
} 