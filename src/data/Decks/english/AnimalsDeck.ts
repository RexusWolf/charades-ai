import type { DeckCard } from "../../../components/Card/Card";
import { Language } from "../../language";

export const ANIMALS_DECK = {
    id: "animals",
    name: "🐾 Animals",
    language: Language.english(),
    cards: [
        { word: "Elephant" },
        { word: "Lion" },
        { word: "Giraffe" },
        { word: "Penguin" },
        { word: "Dolphin" },
        { word: "Kangaroo" },
        { word: "Panda" },
        { word: "Tiger" },
        { word: "Monkey" },
        { word: "Zebra" },
        { word: "Crocodile" },
        { word: "Butterfly" },
        { word: "Shark" },
        { word: "Owl" },
        { word: "Snake" },
    ] as DeckCard[]
}; 