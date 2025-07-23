import type { DeckCard } from "../../../components/Card/Card";
import { Language } from "../../language";
import { Deck } from "../Deck";

export const ACT_IT_OUT_DECK = new Deck({
    id: "act-it-out",
    name: "🎭 Act It Out",
    language: Language.english(),
    cards: [
        "Dancing",
        "Singing",
        "Cooking",
        "Swimming",
        "Running",
        "Jumping",
        "Sleeping",
        "Eating",
        "Drinking",
        "Reading",
        "Writing",
        "Painting",
        "Photography",
        "Gardening",
        "Fishing",
        "Hiking",
        "Cycling",
        "Skiing",
        "Surfing",
        "Rock Climbing",
        "Yoga",
        "Meditation",
        "Shopping",
        "Cleaning",
        "Laughing",
        "Crying",
        "Sneezing",
        "Waving",
        "Clapping",
        "High Five",
    ] as DeckCard[]
});
