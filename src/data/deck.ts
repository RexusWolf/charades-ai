import { ACT_IT_OUT_DECK } from "./Decks/english/ActItOutDeck";
import { ANIMALS_DECK } from "./Decks/english/AnimalsDeck";
import { SPORTS_DECK } from "./Decks/english/SportsDeck";
import { ACTUALO_DECK } from "./Decks/spanish/ActualoDeck";
import { MARVEL_CHARACTERS_SPANISH_DECK } from "./Decks/spanish/MarvelCharactersSpanishDeck";

// Deck Library - Multiple themed decks
export const DECK_LIBRARY = {
    animals: ANIMALS_DECK,
    sports: SPORTS_DECK,
    "act-it-out": ACT_IT_OUT_DECK,
    actualo: ACTUALO_DECK,
    "marvel-characters-spanish": MARVEL_CHARACTERS_SPANISH_DECK,
};

// Helper function to get all available decks
export function getAllDecks() {
    return Object.values(DECK_LIBRARY);
}

// Helper function to get a specific deck by ID
export function getDeckById(deckId: string) {
    return DECK_LIBRARY[deckId as keyof typeof DECK_LIBRARY];
} 