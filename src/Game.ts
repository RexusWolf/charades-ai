import type { GameCard } from "./components/Card/GameCard";
import { Round } from "./Round";

// Game-related types
export interface Player {
    id: string
    name: string
    teamId: string
}

export interface Team {
    id: string
    name: string
    color: string
    players: Player[]
}

export interface Turn {
    playerId: string
    teamId: string
    remainingCards: GameCard[]
    correctCards: GameCard[]
    timeLeft: number
}

export interface GameConfig {
    secondsPerRound: number
    maxCards: number
    enablePreparationPhase: boolean
    preparationTimeLimit: number
    autoStartNextPlayer: boolean
    numberOfRounds: number
}

export type GameState = 'idle' | 'config' | 'team-setup' | 'playing' | 'finished'

export class Game {
    private config: GameConfig;
    private teams: Team[];
    private deck: GameCard[];
    private rounds: Round[]; // All rounds instantiated at game start
    private currentRoundIndex: number = 0;
    private currentTurn: Turn | null = null;
    private currentTeamIndex: number = 0;
    private currentPlayerIndex: number = 0;

    constructor(config: GameConfig, teams: Team[], deck: GameCard[]) {
        this.config = config;
        this.teams = teams;
        this.deck = [...deck];
        this.rounds = this.createRounds(); // Initialize all rounds
        this.startFirstRound(); // Start the first round
    }

    private createRounds(): Round[] {
        const rounds: Round[] = [];

        for (let i = 0; i < this.config.numberOfRounds; i++) {
            rounds.push(new Round(this.deck, i + 1));
        }

        return rounds;
    }

    getCurrentPlayer(): Player | null {
        const currentTeam = this.teams[this.currentTeamIndex];
        if (!currentTeam || this.currentPlayerIndex >= currentTeam.players.length) {
            return currentTeam.players[this.currentPlayerIndex % currentTeam.players.length];
        }
        return currentTeam.players[this.currentPlayerIndex];
    }

    getCurrentCard(): GameCard | null {
        if (!this.currentTurn || this.currentTurn.remainingCards.length === 0) {
            return null;
        }
        return this.currentTurn.remainingCards[0];
    }

    getCurrentRound(): Round | null {
        return this.rounds[this.currentRoundIndex] || null;
    }

    getCurrentTurn(): Turn | null {
        return this.currentTurn;
    }

    getRounds(): Round[] {
        return [...this.rounds];
    }

    getConfig(): GameConfig {
        return { ...this.config };
    }

    getTeams(): Team[] {
        return [...this.teams];
    }

    getDeck(): GameCard[] {
        return [...this.deck];
    }

    getCurrentPlayerIndex(): number {
        return this.currentPlayerIndex;
    }

    getTotalCards(): number {
        return this.deck.length;
    }

    getCurrentRoundRemainingCards(): number {
        const currentRound = this.getCurrentRound();
        if (!currentRound) return 0;
        return currentRound.getRemainingCardsCount();
    }

    isGameFinished(): boolean {
        // Game ends when all rounds are finished
        return this.rounds.every(round => round.isFinished());
    }

    startFirstRound(): void {
        // Start the first round (currentRoundIndex is already 0)
        this.startNewTurn();
    }

    startNewRound(): void {
        if (this.currentRoundIndex < this.rounds.length) {
            this.currentRoundIndex++;
            // Don't reset player index - continue with next player in rotation
            this.startNewTurn();
        }
    }

    startNewTurn(): void {
        const currentPlayer = this.getCurrentPlayer();
        const currentRound = this.getCurrentRound();
        if (!currentPlayer || !currentRound) return;

        // Create new turn for current player with remaining cards from round
        this.currentTurn = {
            playerId: currentPlayer.id,
            teamId: currentPlayer.teamId,
            remainingCards: [...currentRound.getRemainingCards()],
            correctCards: [],
            timeLeft: this.config.secondsPerRound,
        };
    }

    markCardCorrect(): void {
        const currentCard = this.getCurrentCard();
        if (!currentCard || !this.currentTurn) return;

        // Move card from turn's remaining to turn's correct
        this.currentTurn.remainingCards.shift();
        this.currentTurn.correctCards.push(currentCard);

        // Also remove from round's remaining cards
        const currentRound = this.getCurrentRound();
        if (currentRound) {
            currentRound.removeCard(currentCard.id);
        }
    }

    skipCard(): void {
        const currentCard = this.getCurrentCard();
        if (!currentCard || !this.currentTurn) return;

        // Remove card from turn's remaining cards (skipped cards are not tracked)
        this.currentTurn.remainingCards.shift();
    }

    endCurrentTurn(): void {
        if (!this.currentTurn) return;

        const currentRound = this.getCurrentRound();
        if (!currentRound) return;

        // Save the current turn
        currentRound.addTurn({ ...this.currentTurn });

        // Move to next team
        this.currentTeamIndex = (this.currentTeamIndex + 1) % this.teams.length;

        // If we've cycled through all teams, move to next player
        if (this.currentTeamIndex === 0) {
            this.currentPlayerIndex++;
        }

        // Check if round is finished (no remaining cards)
        if (currentRound.isFinished()) {
            // Round is finished, but don't automatically start next round
            // The RoundComplete view will handle starting the next round
        } else {
            // Start new turn for next player
            this.startNewTurn();
        }
    }

    isRoundFinished(): boolean {
        const currentRound = this.getCurrentRound();
        if (!currentRound) return false;

        return currentRound.isFinished();
    }

    startNextRound(): void {
        if (this.currentRoundIndex < this.rounds.length) {
            this.currentRoundIndex++;
            // Don't reset player index - continue with next player in rotation
            this.startNewTurn();
        }
    }

    updateTimeLeft(timeLeft: number): void {
        if (this.currentTurn) {
            this.currentTurn.timeLeft = timeLeft;
        }
    }

    getTeamForPlayer(playerId: string): Team | null {
        return this.teams.find(team =>
            team.players.some(player => player.id === playerId)
        ) || null;
    }



    getPlayerStats(playerId: string): {
        correctCards: number;
        skippedCards: number;
        totalTurns: number;
    } {
        let correctCards = 0;
        let skippedCards = 0;
        let totalTurns = 0;

        this.rounds.forEach(round => {
            round.getTurns().forEach(turn => {
                if (turn.playerId === playerId) {
                    correctCards += turn.correctCards.length;
                    // Skipped cards = cards that were in turn's remainingCards but not in correctCards
                    skippedCards += (this.deck.length - turn.correctCards.length - turn.remainingCards.length);
                    totalTurns++;
                }
            });
        });

        return {
            correctCards,
            skippedCards,
            totalTurns,
        };
    }

    getTeamStats(teamId: string): {
        correctCards: number;
        skippedCards: number;
        totalTurns: number;
    } {
        let correctCards = 0;
        let skippedCards = 0;
        let totalTurns = 0;

        this.rounds.forEach(round => {
            round.getTurns().forEach(turn => {
                if (turn.teamId === teamId) {
                    correctCards += turn.correctCards.length;
                    skippedCards += (this.deck.length - turn.correctCards.length - turn.remainingCards.length);
                    totalTurns++;
                }
            });
        });

        return {
            correctCards,
            skippedCards,
            totalTurns,
        };
    }

    getGameStats(): {
        totalCorrectCards: number;
        totalSkippedCards: number;
        totalRounds: number;
        totalTurns: number;
        averageCorrectPerTurn: number;
    } {
        let totalCorrectCards = 0;
        let totalSkippedCards = 0;
        let totalTurns = 0;

        this.rounds.forEach(round => {
            round.getTurns().forEach(turn => {
                totalCorrectCards += turn.correctCards.length;
                totalSkippedCards += (this.deck.length - turn.correctCards.length - turn.remainingCards.length);
                totalTurns++;
            });
        });

        return {
            totalCorrectCards,
            totalSkippedCards,
            totalRounds: this.rounds.length,
            totalTurns,
            averageCorrectPerTurn: totalTurns > 0 ? totalCorrectCards / totalTurns : 0,
        };
    }

    getCurrentRoundNumber(): number {
        return this.currentRoundIndex + 1;
    }

    getTotalRounds(): number {
        return this.rounds.length;
    }

    reset(): void {
        this.currentRoundIndex = 0;
        this.currentTurn = null;
        this.currentTeamIndex = 0;
        this.currentPlayerIndex = 0;
        this.rounds = this.createRounds(); // Recreate all rounds
        this.startNewRound();
    }

    clone(): Game {
        const newGame = new Game(this.config, this.teams, this.deck);
        newGame.currentRoundIndex = this.currentRoundIndex;
        newGame.currentTeamIndex = this.currentTeamIndex;
        newGame.currentPlayerIndex = this.currentPlayerIndex;
        if (this.currentTurn) {
            newGame.currentTurn = { ...this.currentTurn };
        }
        return newGame;
    }
} 