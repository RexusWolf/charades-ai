import type { DeckCard } from "../../components/Card/Card";
import type { Language } from "../language";

export class Deck {
    id: string;
    name: string;
    language: Language;
    cards: DeckCard[];

    constructor({ id, name, language, cards }: { id: string; name: string; language: Language; cards: DeckCard[]; }) {
        this.id = id;
        this.name = name;
        this.language = language;
        this.cards = cards;
    }
}
