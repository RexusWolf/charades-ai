import { ACT_IT_OUT_DECK } from "./Decks/english/ActItOutDeck";
import { ANIMALS_DECK } from "./Decks/english/AnimalsDeck";
import { FAMOUS_TV_SERIES_ENGLISH_DECK } from "./Decks/english/FamousTvSeriesEnglishDeck";
import { SPORTS_DECK } from "./Decks/english/SportsDeck";
import { ACTUALO_DECK } from "./Decks/spanish/ActualoDeck";
import { MARVEL_CHARACTERS_SPANISH_DECK } from "./Decks/spanish/MarvelCharactersSpanishDeck";
import { SERIES_FAMOSAS_SPANISH_DECK } from "./Decks/spanish/SeriesDeTvFamosasDeck";
import { FAMOUS_PEOPLE_DECK } from "./Decks/universal/FamousPeopleDeck";
import { FAMOUS_YOUTUBERS_DECK } from "./Decks/universal/FamousYoutubersDeck";

// Deck Library - Multiple themed decks
export const DECK_LIBRARY = {
    "act-it-out": ACT_IT_OUT_DECK,
    animals: ANIMALS_DECK,
    sports: SPORTS_DECK,
    actualo: ACTUALO_DECK,
    "famous-tv-series-english": FAMOUS_TV_SERIES_ENGLISH_DECK,
    "marvel-characters-spanish": MARVEL_CHARACTERS_SPANISH_DECK,
    "series-famosas-spanish": SERIES_FAMOSAS_SPANISH_DECK,
    "famous-people": FAMOUS_PEOPLE_DECK,
    "famous-youtubers": FAMOUS_YOUTUBERS_DECK,
};

// Helper function to get all available decks
export function getAllDecks() {
    return Object.values(DECK_LIBRARY);
}

// Helper function to get a specific deck by ID
export function getDeckById(deckId: string) {
    return DECK_LIBRARY[deckId as keyof typeof DECK_LIBRARY];
} 