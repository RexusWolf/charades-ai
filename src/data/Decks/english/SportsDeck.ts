import { Language } from "../../language";
import { Deck } from "../Deck";

export const SPORTS_DECK = new Deck({
    id: "sports",
    name: "⚽ Sports",
    language: Language.english(),
    cards: [
        "Basketball",
        "Soccer",
        "Tennis",
        "Swimming",
        "Baseball",
        "Volleyball",
        "Golf",
        "Skiing",
        "Boxing",
        "Cycling",
        "Running",
        "Diving",
        "Hockey",
        "Rugby",
        "Cricket",
    ]
}); 