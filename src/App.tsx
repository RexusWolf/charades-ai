import { useState, useCallback } from "react";
import { EndScreen } from "./components/EndScreen";
import { GameScreen } from "./components/GameScreen";
import { StartScreen } from "./components/StartScreen";
import { SAMPLE_DECK } from "./data/deck";
import type { Card, GameState } from "./types";
import "./App.css";

function App() {
	const [gameState, setGameState] = useState<GameState>("idle");
	const [passedCards, setPassedCards] = useState<Card[]>([]);
	const [correctCards, setCorrectCards] = useState<Card[]>([]);

	const startGame = useCallback(() => {
		setGameState("playing");
		setPassedCards([]);
		setCorrectCards([]);
	}, []);

	const handleGameEnd = useCallback((passed: Card[], correct: Card[]) => {
		setPassedCards(passed);
		setCorrectCards(correct);
		setGameState("finished");
	}, []);

	const handlePlayAgain = useCallback(() => {
		setGameState("idle");
	}, []);

	if (gameState === "idle") {
		return <StartScreen onStartGame={startGame} />;
	}

	if (gameState === "playing") {
		return <GameScreen deck={SAMPLE_DECK} onGameEnd={handleGameEnd} />;
	}

	if (gameState === "finished") {
		return (
			<EndScreen
				passedCards={passedCards}
				correctCards={correctCards}
				onPlayAgain={handlePlayAgain}
			/>
		);
	}

	return null;
}

export default App;
