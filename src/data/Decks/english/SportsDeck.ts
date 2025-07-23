import type { DeckCard } from "../../../components/Card/Card";
import { Language } from "../../language";

export const SPORTS_DECK = {
    id: "sports",
    name: "⚽ Sports",
    language: Language.english(),
    cards: [
        { word: "Basketball" },
        { word: "Soccer" },
        { word: "Tennis" },
        { word: "Swimming" },
        { word: "Baseball" },
        { word: "Volleyball" },
        { word: "Golf" },
        { word: "Skiing" },
        { word: "Boxing" },
        { word: "Cycling" },
        { word: "Running" },
        { word: "Diving" },
        { word: "Hockey" },
        { word: "Rugby" },
        { word: "Cricket" },
    ] as DeckCard[]
}; 