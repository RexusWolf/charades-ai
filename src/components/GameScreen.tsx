import { useCallback, useEffect, useState } from "react";
import type {
	Card as CardType,
	GameConfig,
	GameRound,
	Player,
	Team,
} from "../types";
import { Card } from "./Card";
import { GameHeader } from "./GameHeader";
import { GameStats } from "./GameStats";
import { NoCards } from "./NoCards";
import { PlayerTurn } from "./PlayerTurn";

interface GameScreenProps {
	deck: CardType[];
	teams: Team[];
	config: GameConfig;
	onGameEnd: (rounds: GameRound[]) => void;
}

type SwipeDirection = "left" | "right" | null;
type TurnState = "preparing" | "playing";

export function GameScreen({
	deck,
	teams,
	config,
	onGameEnd,
}: GameScreenProps) {
	const [timeLeft, setTimeLeft] = useState(config.secondsPerRound);
	const [currentCardIndex, setCurrentCardIndex] = useState(0);
	const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
	const [rounds, setRounds] = useState<GameRound[]>([]);
	const [currentRound, setCurrentRound] = useState<GameRound>({
		playerId: "",
		teamId: "",
		passedCards: [],
		correctCards: [],
		timeLeft: config.secondsPerRound,
	});
	const [isTimerRunning, setIsTimerRunning] = useState(false);
	const [turnState, setTurnState] = useState<TurnState>(
		config.enablePreparationPhase ? "preparing" : "playing",
	);
	const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
	const [isSwiping, setIsSwiping] = useState(false);
	const [gameDeck, setGameDeck] = useState<CardType[]>(deck);

	// Create rotation order: Team 1 Player 1, Team 2 Player 1, Team 3 Player 1, Team 1 Player 2, etc.
	const createRotationOrder = useCallback(() => {
		const rotationOrder: Player[] = [];
		const maxPlayersPerTeam = Math.max(
			...teams.map((team) => team.players.length),
		);

		for (let playerIndex = 0; playerIndex < maxPlayersPerTeam; playerIndex++) {
			for (const team of teams) {
				if (team.players[playerIndex]) {
					rotationOrder.push(team.players[playerIndex]);
				}
			}
		}

		return rotationOrder;
	}, [teams]);

	const rotationOrder = createRotationOrder();
	const currentPlayer = rotationOrder[currentPlayerIndex];
	const currentCard = gameDeck[currentCardIndex];

	// Initialize current round
	useEffect(() => {
		if (currentPlayer) {
			setCurrentRound({
				playerId: currentPlayer.id,
				teamId: currentPlayer.teamId,
				passedCards: [],
				correctCards: [],
				timeLeft: config.secondsPerRound,
			});
			setTimeLeft(config.secondsPerRound);
			setTurnState(config.enablePreparationPhase ? "preparing" : "playing");
			setIsTimerRunning(!config.enablePreparationPhase);
		}
	}, [currentPlayer, config]);

	const handleStartTurn = useCallback(() => {
		setTurnState("playing");
		setIsTimerRunning(true);
	}, []);

	const handleEndTurn = useCallback(() => {
		// Save current round with remaining time
		setRounds((prev) => [...prev, { ...currentRound, timeLeft }]);

		// Move to next player in rotation order
		const nextPlayerIndex = (currentPlayerIndex + 1) % rotationOrder.length;
		setCurrentPlayerIndex(nextPlayerIndex);
		setTimeLeft(config.secondsPerRound);
		setTurnState(config.enablePreparationPhase ? "preparing" : "playing");
		setIsTimerRunning(!config.enablePreparationPhase);
	}, [
		currentRound,
		timeLeft,
		currentPlayerIndex,
		rotationOrder.length,
		config,
	]);

	const handlePass = useCallback(() => {
		if (currentCard && turnState === "playing") {
			setCurrentRound((prev) => ({
				...prev,
				passedCards: [...prev.passedCards, currentCard],
			}));

			// Move the passed card to the bottom of the deck
			setGameDeck((prevDeck) => {
				const newDeck = [...prevDeck];
				// Remove the current card from its position
				newDeck.splice(currentCardIndex, 1);
				// Add it to the bottom of the deck
				newDeck.push(currentCard);
				return newDeck;
			});

			// Don't increment currentCardIndex since the card was moved to the bottom
			setSwipeDirection(null);
			setIsSwiping(false);
		}
	}, [currentCard, turnState, currentCardIndex]);

	const handleCorrect = useCallback(() => {
		if (currentCard && turnState === "playing") {
			setCurrentRound((prev) => ({
				...prev,
				correctCards: [...prev.correctCards, currentCard],
			}));
			setCurrentCardIndex((prev) => prev + 1);
			setSwipeDirection(null);
			setIsSwiping(false);
		}
	}, [currentCard, turnState]);

	const handleSwiping = useCallback(
		(eventData: any) => {
			if (turnState === "playing") {
				setIsSwiping(true);
				if (eventData.deltaX < -50) {
					setSwipeDirection("left");
				} else if (eventData.deltaX > 50) {
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
						setRounds((prev) => [...prev, { ...currentRound, timeLeft: 0 }]);

						// Move to next player in rotation order
						const nextPlayerIndex =
							(currentPlayerIndex + 1) % rotationOrder.length;
						setCurrentPlayerIndex(nextPlayerIndex);
						setTimeLeft(config.secondsPerRound);
						setTurnState(
							config.enablePreparationPhase ? "preparing" : "playing",
						);
						setIsTimerRunning(!config.enablePreparationPhase);

						return config.secondsPerRound;
					}
					return prev - 1;
				});
			}, 1000);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [
		isTimerRunning,
		timeLeft,
		currentPlayerIndex,
		rotationOrder.length,
		currentRound,
		turnState,
		config,
	]);

	// Check if game is finished (all cards completed)
	useEffect(() => {
		if (currentCardIndex >= gameDeck.length) {
			// Save final round
			setRounds((prev) => [...prev, { ...currentRound, timeLeft }]);
			setIsTimerRunning(false);
			onGameEnd(rounds);
		}
	}, [
		currentCardIndex,
		gameDeck.length,
		currentRound,
		timeLeft,
		rounds,
		onGameEnd,
	]);

	// Update current round when card changes
	useEffect(() => {
		setCurrentRound((prev) => ({ ...prev, timeLeft }));
	}, [timeLeft]);

	const totalRounds = Math.ceil(gameDeck.length / rotationOrder.length);

	return (
		<div className="app">
			<GameHeader
				timeLeft={timeLeft}
				currentCardIndex={currentCardIndex}
				totalCards={gameDeck.length}
			/>

			{currentPlayer && (
				<PlayerTurn
					currentPlayer={currentPlayer}
					roundNumber={Math.floor(currentCardIndex / rotationOrder.length) + 1}
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
							onPass={handlePass}
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

			<GameStats
				correctCount={currentRound.correctCards.length}
				passedCount={currentRound.passedCards.length}
			/>
		</div>
	);
}
