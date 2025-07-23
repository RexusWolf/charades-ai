import type { Card } from "../src/components/Card/Card";
import type { GameConfig, Team } from '../src/Game';
import { Game } from '../src/Game';

describe('Game', () => {
    let config: GameConfig;
    let teams: Team[];
    let deck: Card[];

    beforeEach(() => {
        config = {
            secondsPerRound: 60,
            maxCards: 5,
            enablePreparationPhase: false,
            preparationTimeLimit: 0,
            autoStartNextPlayer: false,
        };

        teams = [
            {
                id: 'team-1',
                name: 'Red Team',
                color: '#ff6b6b',
                players: [
                    { id: 'player-1', name: 'Alice', teamId: 'team-1' },
                    { id: 'player-2', name: 'Bob', teamId: 'team-1' },
                ],
            },
            {
                id: 'team-2',
                name: 'Blue Team',
                color: '#0527e2',
                players: [
                    { id: 'player-3', name: 'Charlie', teamId: 'team-2' },
                ],
            },
        ];

        deck = [
            { id: 1, word: 'Elephant', category: 'Animals' },
            { id: 2, word: 'Pizza', category: 'Food' },
            { id: 3, word: 'Basketball', category: 'Sports' },
            { id: 4, word: 'Computer', category: 'Technology' },
            { id: 5, word: 'Beach', category: 'Places' },
        ];
    });

    describe('Initialization', () => {
        it('should create a game with correct initial state', () => {
            const game = new Game(config, teams, deck);

            expect(game.getConfig()).toEqual(config);
            expect(game.getTeams()).toEqual(teams);
            expect(game.getDeck()).toEqual(deck);
            expect(game.getTotalCards()).toBe(5);
            expect(game.getRemainingCards()).toBe(5);
            expect(game.isGameFinished()).toBe(false);
        });

        it('should create rotation order correctly', () => {
            const game = new Game(config, teams, deck);
            const rotationOrder = game.getRotationOrder();

            expect(rotationOrder).toHaveLength(3);
            expect(rotationOrder[0].name).toBe('Alice');
            expect(rotationOrder[1].name).toBe('Charlie');
            expect(rotationOrder[2].name).toBe('Bob');
        });
    });

    describe('Round and Turn Management', () => {
        it('should start a new round correctly', () => {
            const game = new Game(config, teams, deck);
            game.startNewRound();

            const currentRound = game.getCurrentRound();
            const currentTurn = game.getCurrentTurn();
            const currentPlayer = game.getCurrentPlayer();

            expect(currentRound).toBeTruthy();
            expect(currentRound?.remainingCards).toHaveLength(5);
            expect(currentTurn).toBeTruthy();
            expect(currentTurn?.playerId).toBe(currentPlayer?.id);
            expect(currentTurn?.remainingCards).toHaveLength(5);
            expect(currentTurn?.correctCards).toHaveLength(0);
        });

        it('should mark cards as correct correctly', () => {
            const game = new Game(config, teams, deck);
            game.startNewRound();

            const currentCard = game.getCurrentCard();
            expect(currentCard?.word).toBe('Elephant');

            game.markCardCorrect();

            const currentTurn = game.getCurrentTurn();
            const currentRound = game.getCurrentRound();

            expect(currentTurn?.correctCards).toHaveLength(1);
            expect(currentTurn?.correctCards[0].word).toBe('Elephant');
            expect(currentTurn?.remainingCards).toHaveLength(4);
            expect(currentRound?.remainingCards).toHaveLength(4);
        });

        it('should mark cards as skipped correctly', () => {
            const game = new Game(config, teams, deck);
            game.startNewRound();

            const currentCard = game.getCurrentCard();
            expect(currentCard?.word).toBe('Elephant');

            game.skipCard();

            const currentTurn = game.getCurrentTurn();
            const currentRound = game.getCurrentRound();

            expect(currentTurn?.correctCards).toHaveLength(0);
            expect(currentTurn?.remainingCards).toHaveLength(4);
            expect(currentRound?.remainingCards).toHaveLength(5); // Round still has all cards
        });

        it('should end turn and move to next player', () => {
            const game = new Game(config, teams, deck);
            game.startNewRound();

            const firstPlayer = game.getCurrentPlayer();
            expect(firstPlayer?.name).toBe('Alice');

            game.markCardCorrect();
            game.endCurrentTurn();

            const secondPlayer = game.getCurrentPlayer();
            expect(secondPlayer?.name).toBe('Charlie');

            const currentRound = game.getCurrentRound();
            expect(currentRound?.turns).toHaveLength(1);
            expect(currentRound?.turns[0].playerId).toBe('player-1');
        });

        it('should end round when no remaining cards', () => {
            const game = new Game(config, teams, deck);
            game.startNewRound();

            // Mark all cards as correct
            for (let i = 0; i < 5; i++) {
                game.markCardCorrect();
            }

            game.endCurrentTurn();

            expect(game.getCurrentRound()).toBeNull();
            expect(game.getRounds()).toHaveLength(1);
            expect(game.isGameFinished()).toBe(true);
        });
    });

    describe('Statistics', () => {
        it('should calculate player statistics correctly', () => {
            const game = new Game(config, teams, deck);
            game.startNewRound();

            // Alice gets 2 correct, 1 skipped
            game.markCardCorrect(); // Elephant
            game.markCardCorrect(); // Pizza
            game.skipCard(); // Basketball
            game.endCurrentTurn();

            // Charlie gets 1 correct
            game.markCardCorrect(); // Computer
            game.endCurrentTurn();

            const aliceStats = game.getPlayerStats('player-1');
            expect(aliceStats.correctCards).toBe(2);
            expect(aliceStats.totalTurns).toBe(1);

            const charlieStats = game.getPlayerStats('player-3');
            expect(charlieStats.correctCards).toBe(1);
            expect(charlieStats.totalTurns).toBe(1);
        });

        it('should calculate team statistics correctly', () => {
            const game = new Game(config, teams, deck);
            game.startNewRound();

            // Red team (Alice) gets 2 correct
            game.markCardCorrect();
            game.markCardCorrect();
            game.endCurrentTurn();

            // Blue team (Charlie) gets 1 correct
            game.markCardCorrect();
            game.endCurrentTurn();

            const redTeamStats = game.getTeamStats('team-1');
            expect(redTeamStats.correctCards).toBe(2);
            expect(redTeamStats.totalTurns).toBe(1);

            const blueTeamStats = game.getTeamStats('team-2');
            expect(blueTeamStats.correctCards).toBe(1);
            expect(blueTeamStats.totalTurns).toBe(1);
        });

        it('should calculate game statistics correctly', () => {
            const game = new Game(config, teams, deck);
            game.startNewRound();

            // First turn: 2 correct, 1 skipped
            game.markCardCorrect();
            game.markCardCorrect();
            game.skipCard();
            game.endCurrentTurn();

            // Second turn: 1 correct
            game.markCardCorrect();
            game.endCurrentTurn();

            const stats = game.getGameStats();
            expect(stats.totalCorrectCards).toBe(3);
            expect(stats.totalRounds).toBe(1);
            expect(stats.totalTurns).toBe(2);
            expect(stats.averageCorrectPerTurn).toBe(1.5);
        });
    });

    describe('Game Flow', () => {
        it('should handle multiple rounds correctly', () => {
            const game = new Game(config, teams, deck);

            // First round
            game.startNewRound();
            game.markCardCorrect(); // Alice gets Elephant
            game.endCurrentTurn();

            game.markCardCorrect(); // Charlie gets Pizza
            game.endCurrentTurn();

            game.markCardCorrect(); // Bob gets Basketball
            game.endCurrentTurn();

            game.markCardCorrect(); // Alice gets Computer
            game.endCurrentTurn();

            game.markCardCorrect(); // Charlie gets Beach
            game.endCurrentTurn();

            expect(game.isGameFinished()).toBe(true);
            expect(game.getRounds()).toHaveLength(1);
            expect(game.getRounds()[0].turns).toHaveLength(5);
        });

        it('should reset game correctly', () => {
            const game = new Game(config, teams, deck);
            game.startNewRound();
            game.markCardCorrect();
            game.endCurrentTurn();

            game.reset();

            expect(game.getRounds()).toHaveLength(0);
            expect(game.getCurrentRound()).toBeTruthy();
            expect(game.getCurrentTurn()).toBeTruthy();
            expect(game.getCurrentPlayerIndex()).toBe(0);
            expect(game.getRemainingCards()).toBe(5);
        });

        it('should clone game correctly', () => {
            const game = new Game(config, teams, deck);
            game.startNewRound();
            game.markCardCorrect();

            const clonedGame = game.clone();

            expect(clonedGame.getConfig()).toEqual(game.getConfig());
            expect(clonedGame.getTeams()).toEqual(game.getTeams());
            expect(clonedGame.getDeck()).toEqual(game.getDeck());
            expect(clonedGame.getRounds()).toHaveLength(0); // Fresh state
            expect(clonedGame.getCurrentRound()).toBeTruthy();
        });
    });
}); 