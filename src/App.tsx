import { useCallback, useEffect, useState } from "react";
import type { Card } from "./components/Card/Card";
import { CustomDeckCreator } from "./components/CustomDeckCreator/CustomDeckCreator";
import { DeckSelector } from "./components/DeckSelector/DeckSelector";
import { EndScreen } from "./components/EndScreen/EndScreen";
import { GameConfigScreen } from "./components/GameConfig/GameConfig";
import { GameScreen } from "./components/GameScreen/GameScreen";
import { MainLayout } from "./components/MainLayout/MainLayout";
import { SavedDecksManager } from "./components/SavedDecksManager/SavedDecksManager";
import { StartScreen } from "./components/StartScreen/StartScreen";
import { TeamSetup } from "./components/TeamSetup/TeamSetup";
import { DEFAULT_DECK } from "./data/deck";
import { migrateSavedDecks } from "./data/savedDecks";
import type { GameConfig, GameState, Round, Team } from "./Game";
import { Game } from "./Game";

function App() {
	// Run migration on app start
	useEffect(() => {
		migrateSavedDecks();
	}, []);

	const [gameState, setGameState] = useState<GameState>("idle");
	const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
	const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
	const [gameRounds, setGameRounds] = useState<Round[]>([]);
	const [currentDeck, setCurrentDeck] = useState<Card[]>(DEFAULT_DECK);
	const [showDeckCreator, setShowDeckCreator] = useState(false);
	const [showSavedDecks, setShowSavedDecks] = useState(false);
	const [showDeckSelector, setShowDeckSelector] = useState(false);
	const [gameInstance, setGameInstance] = useState<Game | null>(null);

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

	// Create game instance when transitioning to playing state
	useEffect(() => {
		if (gameState === "playing" && gameConfig && selectedTeams.length > 0) {
			// Limit the deck based on config
			const limitedDeck = currentDeck.slice(0, gameConfig.maxCards);
			const game = new Game(gameConfig, selectedTeams, limitedDeck);
			setGameInstance(game);
		}
	}, [gameState, gameConfig, selectedTeams, currentDeck]);

	const handleGameEnd = useCallback((rounds: Round[]) => {
		setGameRounds(rounds);
		setGameState("finished");
	}, []);

	const handlePlayAgain = useCallback(() => {
		setGameState("idle");
		setGameConfig(null);
		setSelectedTeams([]);
		setGameRounds([]);
		setCurrentDeck(DEFAULT_DECK);
		setShowDeckCreator(false);
		setShowSavedDecks(false);
		setShowDeckSelector(false);
		setGameInstance(null);
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

	const handleDeckSelectorClose = useCallback(() => {
		setShowDeckSelector(false);
	}, []);

	const handleDeckSelectionChange = useCallback((cards: Card[]) => {
		setCurrentDeck(cards);
	}, []);

	if (gameState === "idle") {
		return (
			<MainLayout>
				<StartScreen onStartGame={startGame} />
			</MainLayout>
		);
	}

	if (gameState === "config") {
		return (
			<>
				<MainLayout>
					<GameConfigScreen
						onStartGame={handleConfigComplete}
						onCreateCustomDeck={() => setShowDeckCreator(true)}
						onShowSavedDecks={() => setShowSavedDecks(true)}
						onShowDeckSelector={() => setShowDeckSelector(true)}
					/>
				</MainLayout>
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
				{showDeckSelector && (
					<DeckSelector
						onDeckSelectionChange={handleDeckSelectionChange}
						onClose={handleDeckSelectorClose}
					/>
				)}
			</>
		);
	}

	if (gameState === "team-setup") {
		return (
			<MainLayout>
				<TeamSetup onStartGame={handleTeamSetup} />
			</MainLayout>
		);
	}

	if (gameState === "playing" && gameConfig && gameInstance) {
		return (
			<MainLayout>
				<GameScreen
					deck={gameInstance.getDeck()}
					teams={gameInstance.getTeams()}
					config={gameInstance.getConfig()}
					onGameEnd={handleGameEnd}
				/>
			</MainLayout>
		);
	}

	if (gameState === "finished") {
		return (
			<MainLayout>
				<EndScreen
					rounds={gameRounds}
					teams={selectedTeams}
					onPlayAgain={handlePlayAgain}
				/>
			</MainLayout>
		);
	}

	return null;
}

export default App;
