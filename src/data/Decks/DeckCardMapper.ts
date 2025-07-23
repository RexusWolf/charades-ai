import type { DeckCard } from "../../components/Card/DeckCard";
import type { GameCard } from "../../components/Card/GameCard";

export class DeckCardMapper {
    toCard({ deckCard, deckId }: { deckCard: DeckCard; deckId: string; }): GameCard {
        return {
            id: Date.now(),
            word: deckCard,
            deckId: deckId
        }
    }
}