import { useCallback, useState } from "react";
import { CustomDeckCreator } from "./components/CustomDeckCreator";
import { EndScreen } from "./components/EndScreen";
import { GameConfigScreen } from "./components/GameConfig";
import { GameScreen } from "./components/GameScreen";
import { SavedDecksManager } from "./components/SavedDecksManager";
import { StartScreen } from "./components/StartScreen";
import { TeamSetup } from "./components/TeamSetup";
import { SAMPLE_DECK } from "./data/deck";
import type { Card, GameConfig, GameRound, GameState, Team } from "./types";
import "./App.css";

function App() {
	const [gameState, setGameState] = useState<GameState>("idle");
	const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
	const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
	const [gameRounds, setGameRounds] = useState<GameRound[]>([]);
	const [currentDeck, setCurrentDeck] = useState<Card[]>(SAMPLE_DECK);
	const [showDeckCreator, setShowDeckCreator] = useState(false);
	const [showSavedDecks, setShowSavedDecks] = useState(false);

	const startGame = useCallback(() => {
		setGameState("config");
	}, []);

	const handleConfigComplete = useCallback((config: GameConfig) => {
		setGameConfig(config);
		setGameState("team-setup");
	}, []);

	const handleTeamSetup = useCallback((teams: Team[]) => {
		setSelectedTeams(teams);
		setGameState("playing");
	}, []);

	const handleGameEnd = useCallback((rounds: GameRound[]) => {
		setGameRounds(rounds);
		setGameState("finished");
	}, []);

	const handlePlayAgain = useCallback(() => {
		setGameState("idle");
		setGameConfig(null);
		setSelectedTeams([]);
		setGameRounds([]);
		setCurrentDeck(SAMPLE_DECK);
		setShowDeckCreator(false);
		setShowSavedDecks(false);
	}, []);

	const handleDeckCreated = useCallback((deck: Card[]) => {
		setCurrentDeck(deck);
		setShowDeckCreator(false);
	}, []);

	const handleDeckCreatorCancel = useCallback(() => {
		setShowDeckCreator(false);
	}, []);

	const handleSavedDeckSelected = useCallback((deck: Card[]) => {
		setCurrentDeck(deck);
		setShowSavedDecks(false);
	}, []);

	const handleSavedDecksClose = useCallback(() => {
		setShowSavedDecks(false);
	}, []);

	if (gameState === "idle") {
		return <StartScreen onStartGame={startGame} />;
	}

	if (gameState === "config") {
		return (
			<>
				<GameConfigScreen
					onStartGame={handleConfigComplete}
					onCreateCustomDeck={() => setShowDeckCreator(true)}
					onShowSavedDecks={() => setShowSavedDecks(true)}
				/>
				{showDeckCreator && (
					<CustomDeckCreator
						onDeckCreated={handleDeckCreated}
						onCancel={handleDeckCreatorCancel}
					/>
				)}
				{showSavedDecks && (
					<SavedDecksManager
						onDeckSelected={handleSavedDeckSelected}
						onClose={handleSavedDecksClose}
					/>
				)}
			</>
		);
	}

	if (gameState === "team-setup") {
		return <TeamSetup onStartGame={handleTeamSetup} />;
	}

	if (gameState === "playing" && gameConfig) {
		// Limit the deck based on config
		const limitedDeck = currentDeck.slice(0, gameConfig.maxCards);

		return (
			<GameScreen
				deck={limitedDeck}
				teams={selectedTeams}
				config={gameConfig}
				onGameEnd={handleGameEnd}
			/>
		);
	}

	if (gameState === "finished") {
		return (
			<EndScreen
				rounds={gameRounds}
				teams={selectedTeams}
				onPlayAgain={handlePlayAgain}
			/>
		);
	}

	return null;
}

export default App;
