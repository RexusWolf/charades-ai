import { useCallback, useEffect, useState } from "react";
import type { SwipeEventData } from "react-swipeable";
import type { GameConfig, Team } from "../../Game";
import { Game } from "../../Game";
import type { Round } from "../../Round";
import { CardComponent } from "../Card/CardComponent";
import type { GameCard } from "../Card/GameCard";
import { GameHeader } from "../GameHeader/GameHeader";
import { NoCards } from "../NoCards/NoCards";
import { PlayerTurn } from "../PlayerTurn/PlayerTurn";
import { RoundComplete } from "../RoundComplete/RoundComplete";
import styles from "./GameScreen.module.css";

interface GameScreenProps {
	deck: GameCard[];
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
	const [turnState, setTurnState] = useState<TurnState>("preparing");
	const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
	const [isSwiping, setIsSwiping] = useState(false);
	const [showRoundComplete, setShowRoundComplete] = useState(false);

	// Initialize the game
	useEffect(() => {
		setTimeLeft(config.secondsPerRound);
		setTurnState("preparing");
		setIsTimerRunning(false);
	}, [config]);

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
		setTurnState("preparing");
		setIsTimerRunning(false);

		// Check if game is finished after ending turn
		if (game.isGameFinished()) {
			onGameEnd(game.getRounds());
		}
	}, [game, currentRound, timeLeft, config, onGameEnd]);

	const handleSkip = useCallback(() => {
		if (currentCard && turnState === "playing") {
			game.skipCard();
			setSwipeDirection(null);
			setIsSwiping(false);

			// If no cards left in current turn, end turn
			const currentTurn = game.getCurrentTurn();
			if (currentTurn && currentTurn.remainingCards.length === 0) {
				game.endCurrentTurn();
				setIsTimerRunning(false);

				// Check if game is finished after ending turn
				if (game.isGameFinished()) {
					onGameEnd(game.getRounds());
				}
				// Note: Round completion will be detected by the useEffect that watches game.isRoundFinished()
			}
		}
	}, [game, currentCard, turnState, onGameEnd]);

	const handleCorrect = useCallback(() => {
		if (currentCard && turnState === "playing") {
			game.markCardCorrect();
			setSwipeDirection(null);
			setIsSwiping(false);

			// If no cards left in the round, end turn and check if round/game is finished
			if (game.getCurrentRoundRemainingCards() === 0) {
				game.endCurrentTurn();
				setIsTimerRunning(false);

				// Check if game is finished after ending turn
				if (game.isGameFinished()) {
					onGameEnd(game.getRounds());
				}

				if (game.isRoundFinished()) {
					setShowRoundComplete(true);
				}
			}
		}
	}, [game, currentCard, turnState, onGameEnd]);

	const handleNextRound = useCallback(() => {
		game.startNextRound();
		setShowRoundComplete(false);
		setTimeLeft(config.secondsPerRound);
		setTurnState("preparing");
		setIsTimerRunning(false);
	}, [game, config]);

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
						setTurnState("preparing");
						setIsTimerRunning(false);

						// Check if game is finished after ending turn
						if (game.isGameFinished()) {
							onGameEnd(game.getRounds());
						}
						// Note: Round completion will be detected by the useEffect that watches game.isRoundFinished()

						return config.secondsPerRound;
					}
					return prev - 1;
				});
			}, 1000) as unknown as number;
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [
		isTimerRunning,
		timeLeft,
		currentRound,
		game,
		turnState,
		config,
		onGameEnd,
	]);

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

	// Show round complete screen if round is finished
	if (showRoundComplete) {
		return (
			<RoundComplete
				rounds={game.getRounds()}
				teams={teams}
				currentRoundNumber={game.getCurrentRoundNumber()}
				totalRounds={totalRounds}
				onNextRound={handleNextRound}
			/>
		);
	}

	return (
		<>
			<GameHeader
				timeLeft={timeLeft}
				cardsLeftToGuess={game.getCurrentTurn()?.remainingCards.length ?? 0}
				totalCards={game.getTotalCards()}
				maxTime={config.secondsPerRound}
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
				<div className={styles.preparationScreen}>
					<div className={styles.preparationCard}>
						<h2>Get Ready!</h2>
						<p>
							It's your turn, <strong>{currentPlayer?.name}</strong>!
						</p>
						<div className={styles.preparationInstructions}>
							<p>• Take a moment to prepare</p>
							<p>• Think about your acting strategy</p>
							<p>• Click "Start Turn" when ready</p>
						</div>
						<button
							type="button"
							className={styles.startTurnButton}
							onClick={handleStartTurn}
						>
							Start Turn
						</button>
					</div>
				</div>
			) : (
				<>
					{currentCard ? (
						<CardComponent
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
						<div className={styles.endTurnContainer}>
							<button
								type="button"
								className={styles.endTurnButton}
								onClick={handleEndTurn}
							>
								End Turn Early
							</button>
						</div>
					)}
				</>
			)}
		</>
	);
}
