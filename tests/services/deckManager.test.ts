import { SAMPLE_DECK } from '../../src/data/deck';
import { DeckManager } from '../../src/services/deckManager';

describe('DeckManager', () => {
    let deckManager: DeckManager;

    beforeEach(() => {
        deckManager = new DeckManager();
    });

    test('should initialize with sample deck selected', () => {
        const state = deckManager.getState();
        expect(state.selectedDecks.length).toBe(1);
        expect(state.selectedDecks[0].deckId).toBe('sample');
        expect(state.mixedCards.length).toBe(SAMPLE_DECK.length);
    });

    test('should toggle deck selection', () => {
        const initialState = deckManager.getState();
        const firstDeck = initialState.availableDecks[0];

        // Toggle the first deck (should be sample deck)
        deckManager.toggleDeckSelection(firstDeck.deckId);

        const newState = deckManager.getState();
        // The sample deck should still be selected due to fallback logic
        expect(newState.selectedDecks.length).toBe(1);
        expect(newState.selectedDecks[0].deckId).toBe('sample');
        expect(newState.mixedCards.length).toBe(SAMPLE_DECK.length);
    });

    test('should select all decks', () => {
        deckManager.selectAllDecks();
        const state = deckManager.getState();
        expect(state.selectedDecks.length).toBe(state.availableDecks.length);
        expect(state.mixedCards.length).toBeGreaterThan(0);
    });

    test('should deselect all decks and fallback to sample', () => {
        deckManager.deselectAllDecks();
        const state = deckManager.getState();
        expect(state.selectedDecks.length).toBe(1);
        expect(state.selectedDecks[0].deckId).toBe('sample');
    });

    test('should select sample deck only', () => {
        deckManager.selectAllDecks();
        deckManager.selectSampleDeckOnly();
        const state = deckManager.getState();
        expect(state.selectedDecks.length).toBe(1);
        expect(state.selectedDecks[0].deckId).toBe('sample');
    });

    test('should get mixed cards', () => {
        const cards = deckManager.getMixedCards();
        expect(cards.length).toBe(SAMPLE_DECK.length);
        expect(cards[0]).toHaveProperty('id');
        expect(cards[0]).toHaveProperty('word');
        expect(cards[0]).toHaveProperty('category');
    });

    test('should get selected decks count', () => {
        const count = deckManager.getSelectedDecksCount();
        expect(count).toBe(1);
    });

    test('should get total available cards', () => {
        const total = deckManager.getTotalAvailableCards();
        expect(total).toBe(SAMPLE_DECK.length);
    });
}); 