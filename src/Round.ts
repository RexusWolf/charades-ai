import type { GameCard } from "./components/Card/GameCard";
import type { Turn } from "./Game";


export class Round {
    private remainingCards: GameCard[];
    private turns: Turn[] = [];
    private roundNumber: number;

    constructor(deck: GameCard[], roundNumber: number) {
        this.remainingCards = [...deck]; // Each round starts with full deck
        this.roundNumber = roundNumber;
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
