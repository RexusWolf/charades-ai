import { useCallback, useEffect, useState } from "react";
import type { SwipeEventData } from "react-swipeable";
import { Game } from "../Game";
import type { Card as CardType, GameConfig, Round, Team } from "../types";
import { Card } from "./Card";
import { GameHeader } from "./GameHeader";
import { NoCards } from "./NoCards";
import { PlayerTurn } from "./PlayerTurn";

interface GameScreenProps {
	deck: CardType[];
	teams: Team[];
	config: GameConfig;
	onGameEnd: (rounds: Round[]) => void;
}

type TurnState = "preparing" | "playing";
type SwipeDirection = "left" | "right" | null;

export function GameScreen({
	deck,
	teams,
	config,
	onGameEnd,
}: GameScreenProps) {
	const [game] = useState(() => new Game(config, teams, deck));
	const [timeLeft, setTimeLeft] = useState(config.secondsPerRound);
	const [isTimerRunning, setIsTimerRunning] = useState(false);
	const [turnState, setTurnState] = useState<TurnState>(
		config.enablePreparationPhase ? "preparing" : "playing",
	);
	const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
	const [isSwiping, setIsSwiping] = useState(false);

	// Initialize the game
	useEffect(() => {
		game.startNewRound();
		setTimeLeft(config.secondsPerRound);
		setTurnState(config.enablePreparationPhase ? "preparing" : "playing");
		setIsTimerRunning(!config.enablePreparationPhase);
	}, [game, config]);

	const currentPlayer = game.getCurrentPlayer();
	const currentCard = game.getCurrentCard();
	const currentRound = game.getCurrentRound();

	const handleStartTurn = useCallback(() => {
		setTurnState("playing");
		setIsTimerRunning(true);
	}, []);

	const handleEndTurn = useCallback(() => {
		// Save current round with remaining time
		if (currentRound) {
			game.updateTimeLeft(timeLeft);
		}

		game.endCurrentTurn();
		setTimeLeft(config.secondsPerRound);
		setTurnState(config.enablePreparationPhase ? "preparing" : "playing");
		setIsTimerRunning(!config.enablePreparationPhase);
	}, [game, currentRound, timeLeft, config]);

	const handleSkip = useCallback(() => {
		if (currentCard && turnState === "playing") {
			game.skipCard();
			setSwipeDirection(null);
			setIsSwiping(false);

			// If no cards left, end turn and game
			if (game.getRemainingCards() === 0) {
				game.endCurrentTurn();
				setIsTimerRunning(false);
				onGameEnd(game.getRounds());
			}
		}
	}, [game, currentCard, turnState, onGameEnd]);

	const handleCorrect = useCallback(() => {
		if (currentCard && turnState === "playing") {
			game.markCardCorrect();
			setSwipeDirection(null);
			setIsSwiping(false);

			// If no cards left, end turn and game
			if (game.getRemainingCards() === 0) {
				game.endCurrentTurn();
				setIsTimerRunning(false);
				onGameEnd(game.getRounds());
			}
		}
	}, [game, currentCard, turnState, onGameEnd]);

	const handleSwiping = useCallback(
		(eventData: SwipeEventData) => {
			if (turnState === "playing") {
				setIsSwiping(true);
				if (eventData.deltaX < -150) {
					setSwipeDirection("left");
				} else if (eventData.deltaX > 150) {
					setSwipeDirection("right");
				} else {
					setSwipeDirection(null);
				}
			}
		},
		[turnState],
	);

	const handleSwiped = useCallback(() => {
		setIsSwiping(false);
		setSwipeDirection(null);
	}, []);

	// Timer logic
	useEffect(() => {
		let interval: number | null = null;

		if (isTimerRunning && timeLeft > 0 && turnState === "playing") {
			interval = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						// End current player's turn
						if (currentRound) {
							game.updateTimeLeft(0);
						}
						game.endCurrentTurn();
						setTimeLeft(config.secondsPerRound);
						setTurnState(
							config.enablePreparationPhase ? "preparing" : "playing",
						);
						setIsTimerRunning(!config.enablePreparationPhase);

						return config.secondsPerRound;
					}
					return prev - 1;
				});
			}, 1000) as unknown as number;
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isTimerRunning, timeLeft, currentRound, game, turnState, config]);

	// Check if game is finished
	useEffect(() => {
		if (game.isGameFinished()) {
			// Save final round if there is one
			if (currentRound) {
				game.updateTimeLeft(timeLeft);
			}
			setIsTimerRunning(false);
			onGameEnd(game.getRounds());
		}
	}, [game, currentRound, timeLeft, onGameEnd]);

	// Update current round when card changes
	useEffect(() => {
		if (currentRound) {
			game.updateTimeLeft(timeLeft);
		}
	}, [timeLeft, game, currentRound]);

	const totalRounds = game.getTotalRounds();

	return (
		<div className="app">
			<GameHeader
				timeLeft={timeLeft}
				cardsLeftToGuess={game.getCurrentTurn()?.remainingCards.length ?? 0}
				totalCards={game.getTotalCards()}
			/>

			{currentPlayer && (
				<PlayerTurn
					currentPlayer={currentPlayer}
					teams={teams}
					roundNumber={game.getCurrentRoundNumber()}
					totalRounds={totalRounds}
					turnState={turnState}
					onStartTurn={handleStartTurn}
				/>
			)}

			{turnState === "preparing" ? (
				<div className="preparation-screen">
					<div className="preparation-card">
						<h2>Get Ready!</h2>
						<p>
							It's your turn, <strong>{currentPlayer?.name}</strong>!
						</p>
						<div className="preparation-instructions">
							<p>• Take a moment to prepare</p>
							<p>• Think about your acting strategy</p>
							<p>• Click "Start Turn" when ready</p>
						</div>
						<button
							type="button"
							className="start-turn-button"
							onClick={handleStartTurn}
						>
							Start Turn
						</button>
					</div>
				</div>
			) : (
				<>
					{currentCard ? (
						<Card
							card={currentCard}
							onSkip={handleSkip}
							onCorrect={handleCorrect}
							isSwiping={isSwiping}
							swipeDirection={swipeDirection}
							onSwiping={handleSwiping}
							onSwiped={handleSwiped}
						/>
					) : (
						<NoCards />
					)}

					{turnState === "playing" && (
						<div className="end-turn-container">
							<button
								type="button"
								className="end-turn-button"
								onClick={handleEndTurn}
							>
								End Turn Early
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
}
