import type { Card } from "../components/Card/Card";
import { DECK_LIBRARY, getAllDecks } from "../data/deck";
import { getSavedDecks, loadDeck } from "../data/savedDecks";

// Deck management types
export interface DeckSelection {
    deckId: string
    name: string
    cardCount: number
    isSelected: boolean
}

export interface DeckManagerState {
    selectedDecks: DeckSelection[]
    availableDecks: DeckSelection[]
    mixedCards: Card[]
    isMixed: boolean
}

// Default deck configuration
const DEFAULT_DECK_ID = "animals";

export class DeckManager {
    private state: DeckManagerState;
    private officialDecks: DeckSelection[] = [];
    private customDecks: DeckSelection[] = [];

    constructor() {
        this.state = {
            selectedDecks: [],
            availableDecks: [],
            mixedCards: [],
            isMixed: false
        };
        this.initializeAvailableDecks();
    }

    private initializeAvailableDecks(): void {
        const savedDecks = getSavedDecks();
        const libraryDecks = getAllDecks();

        // Separate official and custom decks
        this.officialDecks = libraryDecks.map(deck => ({
            deckId: deck.id,
            name: deck.name,
            cardCount: deck.cards.length,
            isSelected: false
        }));

        this.customDecks = savedDecks.map(deck => ({
            deckId: deck.id,
            name: deck.name,
            cardCount: deck.cards.length,
            isSelected: false
        }));

        // Combine all decks for the main state
        this.state.availableDecks = [...this.officialDecks, ...this.customDecks];

        // Start with default deck selected
        const defaultDeck = this.state.availableDecks.find(d => d.deckId === DEFAULT_DECK_ID);
        if (defaultDeck) {
            defaultDeck.isSelected = true;
            this.state.selectedDecks = [defaultDeck];
        }

        this.mixSelectedDecks();
    }

    public getOfficialDecks(): DeckSelection[] {
        return [...this.officialDecks];
    }

    public getCustomDecks(): DeckSelection[] {
        return [...this.customDecks];
    }

    public getState(): DeckManagerState {
        return { ...this.state };
    }

    public toggleDeckSelection(deckId: string): void {
        const deckIndex = this.state.availableDecks.findIndex(d => d.deckId === deckId);
        if (deckIndex === -1) return;

        const deck = this.state.availableDecks[deckIndex];
        deck.isSelected = !deck.isSelected;

        // Update selected decks
        if (deck.isSelected) {
            this.state.selectedDecks.push(deck);
        } else {
            this.state.selectedDecks = this.state.selectedDecks.filter(d => d.deckId !== deckId);
        }

        // Ensure at least one deck is selected
        if (this.state.selectedDecks.length === 0) {
            const defaultDeck = this.state.availableDecks.find(d => d.deckId === DEFAULT_DECK_ID);
            if (defaultDeck) {
                defaultDeck.isSelected = true;
                this.state.selectedDecks = [defaultDeck];
            }
        }

        this.mixSelectedDecks();
    }

    public selectAllDecks(): void {
        this.state.availableDecks.forEach(deck => {
            deck.isSelected = true;
        });
        this.state.selectedDecks = [...this.state.availableDecks];
        this.mixSelectedDecks();
    }

    public deselectAllDecks(): void {
        this.state.availableDecks.forEach(deck => {
            deck.isSelected = false;
        });
        this.state.selectedDecks = [];

        // Ensure at least one deck is selected (fallback to default)
        const defaultDeck = this.state.availableDecks.find(d => d.deckId === DEFAULT_DECK_ID);
        if (defaultDeck) {
            defaultDeck.isSelected = true;
            this.state.selectedDecks = [defaultDeck];
        }

        this.mixSelectedDecks();
    }

    public selectDefaultDeckOnly(): void {
        this.state.availableDecks.forEach(deck => {
            deck.isSelected = deck.deckId === DEFAULT_DECK_ID;
        });
        this.state.selectedDecks = this.state.availableDecks.filter(d => d.deckId === DEFAULT_DECK_ID);
        this.mixSelectedDecks();
    }

    private mixSelectedDecks(): void {
        if (this.state.selectedDecks.length === 0) {
            this.state.mixedCards = [];
            this.state.isMixed = false;
            return;
        }

        const allCards: Card[] = [];

        for (const selectedDeck of this.state.selectedDecks) {
            let deckCards: Card[] = [];

            // Check if it's a library deck
            const libraryDeck = DECK_LIBRARY[selectedDeck.deckId as keyof typeof DECK_LIBRARY];
            if (libraryDeck) {
                deckCards = [...libraryDeck.cards];
            } else {
                // Check if it's a saved deck
                const loadedCards = loadDeck(selectedDeck.deckId);
                if (loadedCards) {
                    deckCards = loadedCards;
                }
            }

            // Add unique cards only (avoid duplicates across decks)
            for (const card of deckCards) {
                if (!allCards.some(existingCard => existingCard.word === card.word)) {
                    allCards.push(card);
                }
            }
        }

        // Shuffle the mixed cards
        this.state.mixedCards = this.shuffleCards(allCards);
        this.state.isMixed = true;
    }

    private shuffleCards(cards: Card[]): Card[] {
        const shuffled = [...cards];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    public getMixedCards(): Card[] {
        return [...this.state.mixedCards];
    }

    public getSelectedDecksCount(): number {
        return this.state.selectedDecks.length;
    }

    public getTotalAvailableCards(): number {
        return this.state.mixedCards.length;
    }

    public refreshAvailableDecks(): void {
        const savedDecks = getSavedDecks();
        const libraryDecks = getAllDecks();

        // Update official decks
        this.officialDecks = libraryDecks.map(deck => ({
            deckId: deck.id,
            name: deck.name,
            cardCount: deck.cards.length,
            isSelected: false
        }));

        // Update custom decks
        this.customDecks = savedDecks.map(deck => ({
            deckId: deck.id,
            name: deck.name,
            cardCount: deck.cards.length,
            isSelected: false
        }));

        // Update the combined available decks
        this.state.availableDecks = [...this.officialDecks, ...this.customDecks];

        // Update selected decks to only include existing ones
        this.state.selectedDecks = this.state.selectedDecks.filter(selectedDeck =>
            this.state.availableDecks.some(availableDeck => availableDeck.deckId === selectedDeck.deckId)
        );

        this.mixSelectedDecks();
    }

    public resetToDefault(): void {
        this.state.selectedDecks = [];
        this.state.mixedCards = [];
        this.state.isMixed = false;
        this.initializeAvailableDecks();
    }
} 