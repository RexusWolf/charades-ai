import type { GameCard } from "./components/Card/GameCard";

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

export interface Round {
    remainingCards: GameCard[]
    turns: Turn[]
}

export interface GameConfig {
    secondsPerRound: number
    maxCards: number
    enablePreparationPhase: boolean
    preparationTimeLimit: number
    autoStartNextPlayer: boolean
}

export type GameState = 'idle' | 'config' | 'team-setup' | 'playing' | 'finished'

/**
 * Game class that manages the complete state of a charades game.
 * 
 * This class encapsulates:
 * - Game configuration (round duration, card limits, etc.)
 * - Teams and players
 * - Deck management
 * - Game state (current player, current card, rounds played)
 * - Statistics and scoring
 * 
 * @example
 * ```typescript
 * // Create a new game
 * const config: GameConfig = {
 *   secondsPerRound: 60,
 *   maxCards: 15,
 *   enablePreparationPhase: true,
 *   preparationTimeLimit: 0,
 *   autoStartNextPlayer: false
 * };
 * 
 * const teams: Team[] = [
 *   {
 *     id: 'team-1',
 *     name: 'Red Team',
 *     color: '#ff6b6b',
 *     players: [
 *       { id: 'player-1', name: 'Alice', teamId: 'team-1' },
 *       { id: 'player-2', name: 'Bob', teamId: 'team-1' }
 *     ]
 *   }
 * ];
 * 
 * const deck: Card[] = [
 *   { id: 1, word: 'Elephant', category: 'Animals' },
 *   { id: 2, word: 'Pizza', category: 'Food' }
 * ];
 * 
 * const game = new Game(config, teams, deck);
 * 
 * // Start the game
 * game.startNewRound();
 * 
 * // Get current player and card
 * const currentPlayer = game.getCurrentPlayer();
 * const currentCard = game.getCurrentCard();
 * 
 * // Mark card as correct or skipped
 * game.markCardCorrect();
 * // or
 * game.skipCard();
 * 
 * // End current player's turn
 * game.endCurrentTurn();
 * 
 * // Get statistics
 * const stats = game.getGameStats();
 * const playerStats = game.getPlayerStats('player-1');
 * const teamStats = game.getTeamStats('team-1');
 * ```
 */
export class Game {
    private config: GameConfig;
    private teams: Team[];
    private deck: GameCard[];
    private rounds: Round[] = [];
    private currentRound: Round | null = null;
    private currentTurn: Turn | null = null;
    private currentPlayerIndex: number = 0;
    private rotationOrder: Player[] = [];

    constructor(config: GameConfig, teams: Team[], deck: GameCard[]) {
        this.config = config;
        this.teams = teams;
        this.deck = [...deck];
        this.createRotationOrder();
    }

    private createRotationOrder(): void {
        this.rotationOrder = [];
        const maxPlayersPerTeam = Math.max(
            ...this.teams.map((team) => team.players.length)
        );

        for (let playerIndex = 0; playerIndex < maxPlayersPerTeam; playerIndex++) {
            for (const team of this.teams) {
                if (team.players[playerIndex]) {
                    this.rotationOrder.push(team.players[playerIndex]);
                }
            }
        }
    }

    getCurrentPlayer(): Player | null {
        return this.rotationOrder[this.currentPlayerIndex] || null;
    }

    getCurrentCard(): GameCard | null {
        if (!this.currentTurn || this.currentTurn.remainingCards.length === 0) {
            return null;
        }
        return this.currentTurn.remainingCards[0];
    }

    getCurrentRound(): Round | null {
        return this.currentRound;
    }

    getCurrentTurn(): Turn | null {
        return this.currentTurn;
    }

    getRounds(): Round[] {
        const rounds = [...this.rounds];
        // Include current round if it exists and has turns
        if (this.currentRound && this.currentRound.turns.length > 0) {
            rounds.push({ ...this.currentRound });
        }
        return rounds;
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

    getRotationOrder(): Player[] {
        return [...this.rotationOrder];
    }

    getCurrentPlayerIndex(): number {
        return this.currentPlayerIndex;
    }

    getTotalCards(): number {
        return this.deck.length;
    }

    getRemainingCards(): number {
        if (!this.currentRound) return this.deck.length;
        return this.currentRound.remainingCards.length;
    }

    isGameFinished(): boolean {
        return this.rounds.length > 0 && this.currentRound === null;
    }

    startNewRound(): void {
        const currentPlayer = this.getCurrentPlayer();
        if (!currentPlayer) return;

        // If we have a current round, save it
        if (this.currentRound) {
            this.rounds.push({ ...this.currentRound });
        }

        // Create new round with remaining cards from deck
        this.currentRound = {
            remainingCards: [...this.deck],
            turns: [],
        };

        this.startNewTurn();
    }

    startNewTurn(): void {
        const currentPlayer = this.getCurrentPlayer();
        if (!currentPlayer || !this.currentRound) return;

        // Create new turn for current player with remaining cards from round
        this.currentTurn = {
            playerId: currentPlayer.id,
            teamId: currentPlayer.teamId,
            remainingCards: [...this.currentRound.remainingCards],
            correctCards: [],
            timeLeft: this.config.secondsPerRound,
        };
    }

    markCardCorrect(): void {
        const currentCard = this.getCurrentCard();
        if (!currentCard || !this.currentTurn || !this.currentRound) return;

        // Move card from turn's remaining to turn's correct
        this.currentTurn.remainingCards.shift();
        this.currentTurn.correctCards.push(currentCard);

        // Also remove from round's remaining cards
        const roundCardIndex = this.currentRound.remainingCards.findIndex(card => card.id === currentCard.id);
        if (roundCardIndex !== -1) {
            this.currentRound.remainingCards.splice(roundCardIndex, 1);
        }
    }

    skipCard(): void {
        const currentCard = this.getCurrentCard();
        if (!currentCard || !this.currentTurn) return;

        // Remove card from turn's remaining cards (skipped cards are not tracked)
        this.currentTurn.remainingCards.shift();
    }

    endCurrentTurn(): void {
        if (!this.currentTurn || !this.currentRound) return;

        // Save the current turn
        this.currentRound.turns.push({ ...this.currentTurn });

        // Move to next player
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.rotationOrder.length;

        // Check if round is finished (no remaining cards)
        if (this.currentRound.remainingCards.length === 0) {
            // Round is finished, save it
            this.rounds.push({ ...this.currentRound });
            this.currentRound = null;
            this.currentTurn = null;
        } else {
            // Start new turn for next player
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

        this.getRounds().forEach(round => {
            round.turns.forEach(turn => {
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

        this.getRounds().forEach(round => {
            round.turns.forEach(turn => {
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

        this.getRounds().forEach(round => {
            round.turns.forEach(turn => {
                totalCorrectCards += turn.correctCards.length;
                totalSkippedCards += (this.deck.length - turn.correctCards.length - turn.remainingCards.length);
                totalTurns++;
            });
        });

        return {
            totalCorrectCards,
            totalSkippedCards,
            totalRounds: this.getRounds().length,
            totalTurns,
            averageCorrectPerTurn: totalTurns > 0 ? totalCorrectCards / totalTurns : 0,
        };
    }

    getCurrentRoundNumber(): number {
        return this.getRounds().length + 1;
    }

    getTotalRounds(): number {
        return Math.ceil(this.deck.length / this.rotationOrder.length);
    }

    reset(): void {
        this.rounds = [];
        this.currentRound = null;
        this.currentTurn = null;
        this.currentPlayerIndex = 0;
        this.createRotationOrder();
        this.startNewRound();
    }

    clone(): Game {
        const newGame = new Game(this.config, this.teams, this.deck);
        newGame.rounds = [...this.rounds];
        newGame.currentPlayerIndex = this.currentPlayerIndex;
        if (this.currentRound) {
            newGame.currentRound = { ...this.currentRound };
        }
        if (this.currentTurn) {
            newGame.currentTurn = { ...this.currentTurn };
        }
        return newGame;
    }
} 