import { ACT_IT_OUT_DECK } from "./Decks/english/ActItOutDeck";
import { ANIMALS_DECK } from "./Decks/english/AnimalsDeck";
import { BLOCKBUSTER_MOVIES_ENGLISH } from "./Decks/english/BlockbusterMoviesEnglishDeck";
import { FAMOUS_TV_SERIES_ENGLISH_DECK } from "./Decks/english/FamousTvSeriesEnglishDeck";
import { SPORTS_DECK } from "./Decks/english/SportsDeck";
import { ACTUALO_DECK } from "./Decks/spanish/ActualoDeck";
import { BLOCKBUSTER_MOVIES_SPANISH } from "./Decks/spanish/BlockbusterMoviesSpanishDeck";
import { MARVEL_CHARACTERS_SPANISH_DECK } from "./Decks/spanish/MarvelCharactersSpanishDeck";
import { SERIES_FAMOSAS_SPANISH_DECK } from "./Decks/spanish/SeriesDeTvFamosasDeck";
import { ACCENTS_IMPRESSIONS_DECK } from "./Decks/universal/AccentsImpressionsDeck";
import { FAMOUS_LOGOS_BRANDS_DECK } from "./Decks/universal/FamousLogosDeck";
import { FAMOUS_PEOPLE_DECK } from "./Decks/universal/FamousPeopleDeck";
import { FAMOUS_VIDEOGAME_CHARACTERS_DECK } from "./Decks/universal/FamousVideogameCharactersDeck";
import { FAMOUS_VIDEOGAMES_DECK } from "./Decks/universal/FamousVideogamesDeck";
import { FAMOUS_YOUTUBERS_DECK } from "./Decks/universal/FamousYoutubersDeck";
import { POPULAR_SONGS_DECK } from "./Decks/universal/PopularSongsDeck";

// Deck Library - Multiple themed decks
export const DECK_LIBRARY = {
    // Universal
    "famous-people": FAMOUS_PEOPLE_DECK,
    "famous-videogames": FAMOUS_VIDEOGAMES_DECK,
    "famous-youtubers": FAMOUS_YOUTUBERS_DECK,
    "famous-videogame-characters": FAMOUS_VIDEOGAME_CHARACTERS_DECK,
    "popular-songs": POPULAR_SONGS_DECK,
    "famous-logos-brands": FAMOUS_LOGOS_BRANDS_DECK,
    "accents-impressions": ACCENTS_IMPRESSIONS_DECK,

    // English
    "act-it-out": ACT_IT_OUT_DECK,
    animals: ANIMALS_DECK,
    sports: SPORTS_DECK,
    "blockbuster-movies-english": BLOCKBUSTER_MOVIES_ENGLISH,
    "famous-tv-series-english": FAMOUS_TV_SERIES_ENGLISH_DECK,

    // Spanish
    "actualo": ACTUALO_DECK,
    "series-famosas-spanish": SERIES_FAMOSAS_SPANISH_DECK,
    "marvel-characters-spanish": MARVEL_CHARACTERS_SPANISH_DECK,
    "blockbuster-movies-spanish": BLOCKBUSTER_MOVIES_SPANISH,
};

// Helper function to get all available decks
export function getAllDecks() {
    return Object.values(DECK_LIBRARY);
}

// Helper function to get a specific deck by ID
export function getDeckById(deckId: string) {
    return DECK_LIBRARY[deckId as keyof typeof DECK_LIBRARY];
} 