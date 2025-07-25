import type { GameCard } from "./components/Card/GameCard";
import type { Turn } from "./Game";


export class Round {
    private remainingCards: GameCard[];
    private turns: Turn[] = [];
    private roundNumber: number;

    constructor(deck: GameCard[], roundNumber: number) {
        this.remainingCards = this.shuffleCards([...deck]); // Shuffle cards before each round
        this.roundNumber = roundNumber;
    }

    private shuffleCards(cards: GameCard[]): GameCard[] {
        const shuffled = [...cards];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    getRemainingCards(): GameCard[] {
        return [...this.remainingCards];
    }

    getTurns(): Turn[] {
        return [...this.turns];
    }

    getRoundNumber(): number {
        return this.roundNumber;
    }

    addTurn(turn: Turn): void {
        this.turns.push({ ...turn });
    }

    removeCard(cardId: number): void {
        const cardIndex = this.remainingCards.findIndex(card => card.id === cardId);
        if (cardIndex !== -1) {
            this.remainingCards.splice(cardIndex, 1);
        }
    }

    moveCardToEnd(cardId: number): void {
        const cardIndex = this.remainingCards.findIndex(card => card.id === cardId);
        if (cardIndex !== -1) {
            const card = this.remainingCards.splice(cardIndex, 1)[0];
            this.remainingCards.push(card);
        }
    }

    hasRemainingCards(): boolean {
        return this.remainingCards.length > 0;
    }

    getRemainingCardsCount(): number {
        return this.remainingCards.length;
    }

    isFinished(): boolean {
        return this.remainingCards.length === 0;
    }
}
