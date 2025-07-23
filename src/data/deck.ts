import type { Card } from "../components/Card/Card"
import { Language } from "./language";

// Deck Library - Multiple themed decks
export const DECK_LIBRARY = {
    animals: {
        id: "animals",
        name: "🐾 Animals",
        language: Language.english(),
        cards: [
            { id: 1, word: "Elephant", category: "Animals" },
            { id: 2, word: "Lion", category: "Animals" },
            { id: 3, word: "Giraffe", category: "Animals" },
            { id: 4, word: "Penguin", category: "Animals" },
            { id: 5, word: "Dolphin", category: "Animals" },
            { id: 6, word: "Kangaroo", category: "Animals" },
            { id: 7, word: "Panda", category: "Animals" },
            { id: 8, word: "Tiger", category: "Animals" },
            { id: 9, word: "Monkey", category: "Animals" },
            { id: 10, word: "Zebra", category: "Animals" },
            { id: 11, word: "Crocodile", category: "Animals" },
            { id: 12, word: "Butterfly", category: "Animals" },
            { id: 13, word: "Shark", category: "Animals" },
            { id: 14, word: "Owl", category: "Animals" },
            { id: 15, word: "Snake", category: "Animals" },
        ]
    },
    sports: {
        id: "sports",
        name: "⚽ Sports",
        language: Language.english(),
        cards: [
            { id: 31, word: "Basketball", category: "Sports" },
            { id: 32, word: "Soccer", category: "Sports" },
            { id: 33, word: "Tennis", category: "Sports" },
            { id: 34, word: "Swimming", category: "Sports" },
            { id: 35, word: "Baseball", category: "Sports" },
            { id: 36, word: "Volleyball", category: "Sports" },
            { id: 37, word: "Golf", category: "Sports" },
            { id: 38, word: "Skiing", category: "Sports" },
            { id: 39, word: "Boxing", category: "Sports" },
            { id: 40, word: "Cycling", category: "Sports" },
            { id: 41, word: "Running", category: "Sports" },
            { id: 42, word: "Diving", category: "Sports" },
            { id: 43, word: "Hockey", category: "Sports" },
            { id: 44, word: "Rugby", category: "Sports" },
            { id: 45, word: "Cricket", category: "Sports" },
        ]
    },
};

// Legacy support - keep the original SAMPLE_DECK for backward compatibility
export const SAMPLE_DECK: Card[] = DECK_LIBRARY.animals.cards;

// Helper function to get all available decks
export function getAllDecks() {
    return Object.values(DECK_LIBRARY);
}

// Helper function to get a specific deck by ID
export function getDeckById(deckId: string) {
    return DECK_LIBRARY[deckId as keyof typeof DECK_LIBRARY];
} 