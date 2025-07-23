import { DEFAULT_DECK } from '../../src/data/deck';
import { GameDeckManager } from '../../src/services/GameDeckManager';

describe('GameDeckManager', () => {
    let gameDeckManager: GameDeckManager;

    beforeEach(() => {
        gameDeckManager = new GameDeckManager();
    });

    test('should initialize with animals deck selected', () => {
        const state = gameDeckManager.getState();
        expect(state.selectedDecks.length).toBe(1);
        expect(state.selectedDecks[0].deckId).toBe('animals');
        expect(state.mixedCards.length).toBe(DEFAULT_DECK.length);
    });

    test('should toggle deck selection', () => {
        const initialState = gameDeckManager.getState();
        const firstDeck = initialState.availableDecks[0];

        // Toggle the first deck (should be animals deck)
        gameDeckManager.toggleDeckSelection(firstDeck.deckId);

        const newState = gameDeckManager.getState();
        // The animals deck should still be selected due to fallback logic
        expect(newState.selectedDecks.length).toBe(1);
        expect(newState.selectedDecks[0].deckId).toBe('animals');
        expect(newState.mixedCards.length).toBe(DEFAULT_DECK.length);
    });

    test('should select all decks', () => {
        gameDeckManager.selectAllDecks();
        const state = gameDeckManager.getState();
        expect(state.selectedDecks.length).toBe(state.availableDecks.length);
        expect(state.mixedCards.length).toBeGreaterThan(0);
    });

    test('should deselect all decks and fallback to animals', () => {
        gameDeckManager.deselectAllDecks();
        const state = gameDeckManager.getState();
        expect(state.selectedDecks.length).toBe(1);
        expect(state.selectedDecks[0].deckId).toBe('animals');
    });

    test('should select default deck only', () => {
        gameDeckManager.selectAllDecks();
        gameDeckManager.selectDefaultDeckOnly();
        const state = gameDeckManager.getState();
        expect(state.selectedDecks.length).toBe(1);
        expect(state.selectedDecks[0].deckId).toBe('animals');
    });

    test('should get mixed cards', () => {
        const cards = gameDeckManager.getMixedCards();
        expect(cards.length).toBe(DEFAULT_DECK.length);
        expect(cards[0]).toHaveProperty('id');
        expect(cards[0]).toHaveProperty('word');
        expect(cards[0]).toHaveProperty('deckId');
    });

    test('should get selected decks count', () => {
        const count = gameDeckManager.getSelectedDecksCount();
        expect(count).toBe(1);
    });

    test('should get total available cards', () => {
        const total = gameDeckManager.getTotalAvailableCards();
        expect(total).toBe(DEFAULT_DECK.length);
    });
}); 