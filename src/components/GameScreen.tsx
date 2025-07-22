import { useState, useEffect, useCallback } from "react";
import type { Card as CardType } from "../types";
import { Card } from "./Card";
import { GameHeader } from "./GameHeader";
import { GameStats } from "./GameStats";
import { NoCards } from "./NoCards";

interface GameScreenProps {
	deck: CardType[];
	onGameEnd: (passedCards: CardType[], correctCards: CardType[]) => void;
}

type SwipeDirection = "left" | "right" | null;

export function GameScreen({ deck, onGameEnd }: GameScreenProps) {
	const [timeLeft, setTimeLeft] = useState(60);
	const [currentCardIndex, setCurrentCardIndex] = useState(0);
	const [passedCards, setPassedCards] = useState<CardType[]>([]);
	const [correctCards, setCorrectCards] = useState<CardType[]>([]);
	const [isTimerRunning, setIsTimerRunning] = useState(true);
	const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
	const [isSwiping, setIsSwiping] = useState(false);

	const currentCard = deck[currentCardIndex];

	const handlePass = useCallback(() => {
		if (currentCard) {
			setPassedCards((prev) => [...prev, currentCard]);
			setCurrentCardIndex((prev) => prev + 1);
			setSwipeDirection(null);
			setIsSwiping(false);
		}
	}, [currentCard]);

	const handleCorrect = useCallback(() => {
		if (currentCard) {
			setCorrectCards((prev) => [...prev, currentCard]);
			setCurrentCardIndex((prev) => prev + 1);
			setSwipeDirection(null);
			setIsSwiping(false);
		}
	}, [currentCard]);

	const handleSwiping = useCallback((eventData: any) => {
		setIsSwiping(true);
		if (eventData.deltaX < -50) {
			setSwipeDirection("left");
		} else if (eventData.deltaX > 50) {
			setSwipeDirection("right");
		} else {
			setSwipeDirection(null);
		}
	}, []);

	const handleSwiped = useCallback(() => {
		setIsSwiping(false);
		setSwipeDirection(null);
	}, []);

	useEffect(() => {
		let interval: number | null = null;

		if (isTimerRunning && timeLeft > 0) {
			interval = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						setIsTimerRunning(false);
						onGameEnd(passedCards, correctCards);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isTimerRunning, timeLeft, passedCards, correctCards, onGameEnd]);

	useEffect(() => {
		if (currentCardIndex >= deck.length) {
			setIsTimerRunning(false);
			onGameEnd(passedCards, correctCards);
		}
	}, [currentCardIndex, deck.length, passedCards, correctCards, onGameEnd]);

	return (
		<div className="app">
			<GameHeader
				timeLeft={timeLeft}
				currentCardIndex={currentCardIndex}
				totalCards={deck.length}
			/>

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

			<GameStats
				correctCount={correctCards.length}
				passedCount={passedCards.length}
			/>
		</div>
	);
}
