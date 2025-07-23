import type { Card, DeckCard } from "../../components/Card/Card";

export class DeckCardMapper {
    toCard({ deckCard, deckId }: { deckCard: DeckCard; deckId: string; }): Card {
        return {
            id: Date.now(),
            word: deckCard,
            deckId: deckId
        }
    }
}