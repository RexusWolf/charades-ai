import type { Card } from "../components/Card/Card";
import { SAMPLE_DECK } from "../data/deck";
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

export class DeckManager {
    private state: DeckManagerState;

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
        const availableDecks: DeckSelection[] = [
            {
                deckId: "sample",
                name: "Sample Deck",
                cardCount: SAMPLE_DECK.length,
                isSelected: true
            },
            ...savedDecks.map(deck => ({
                deckId: deck.id,
                name: deck.name,
                cardCount: deck.cards.length,
                isSelected: false
            }))
        ];

        this.state.availableDecks = availableDecks;
        this.state.selectedDecks = [availableDecks[0]]; // Start with sample deck selected
        this.mixSelectedDecks();
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
            const sampleDeck = this.state.availableDecks.find(d => d.deckId === "sample");
            if (sampleDeck) {
                sampleDeck.isSelected = true;
                this.state.selectedDecks = [sampleDeck];
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

        // Ensure at least one deck is selected (fallback to sample)
        const sampleDeck = this.state.availableDecks.find(d => d.deckId === "sample");
        if (sampleDeck) {
            sampleDeck.isSelected = true;
            this.state.selectedDecks = [sampleDeck];
        }

        this.mixSelectedDecks();
    }

    public selectSampleDeckOnly(): void {
        this.state.availableDecks.forEach(deck => {
            deck.isSelected = deck.deckId === "sample";
        });
        this.state.selectedDecks = this.state.availableDecks.filter(d => d.deckId === "sample");
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

            if (selectedDeck.deckId === "sample") {
                deckCards = [...SAMPLE_DECK];
            } else {
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
        const currentDeckIds = new Set(this.state.availableDecks.map(d => d.deckId));

        // Add new decks
        for (const savedDeck of savedDecks) {
            if (!currentDeckIds.has(savedDeck.id)) {
                this.state.availableDecks.push({
                    deckId: savedDeck.id,
                    name: savedDeck.name,
                    cardCount: savedDeck.cards.length,
                    isSelected: false
                });
            }
        }

        // Remove decks that no longer exist
        const existingDeckIds = new Set(savedDecks.map(d => d.id));
        this.state.availableDecks = this.state.availableDecks.filter(deck =>
            deck.deckId === "sample" || existingDeckIds.has(deck.deckId)
        );

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