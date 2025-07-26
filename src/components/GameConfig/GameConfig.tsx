import type { GameConfig } from "../../Game";
import { useGameConfig } from "../../shared/hooks/useGameConfig";
import type { GameCard } from "../Card/GameCard";
import styles from "./GameConfig.module.css";

interface GameConfigScreenProps {
	currentDeck: GameCard[];
	onStartGame: (config: GameConfig) => void;
	onCreateCustomDeck?: () => void;
	onShowSavedDecks?: () => void;
	onShowDeckSelector?: () => void;
}

export function GameConfigScreen({
	currentDeck,
	onStartGame,
	onCreateCustomDeck,
	onShowSavedDecks,
	onShowDeckSelector,
}: GameConfigScreenProps) {
	const {
		config,
		selectedPreset,
		selectPreset,
		updateConfig,
		getPresetNames,
		getPresetConfig,
		isValid,
	} = useGameConfig();

	const handlePresetChange = (presetName: string) => {
		selectPreset(presetName as any);
	};

	const handleConfigChange = (
		key: keyof GameConfig,
		value: number | boolean,
	) => {
		updateConfig(key, value);
	};

	const handleStartGame = () => {
		if (isValid) {
			onStartGame(config);
		}
	};

	return (
		<>
			<h1 className={styles.title}>🎭 Game Configuration</h1>
			<p className={styles.instructions}>
				Customize your game settings or choose a preset
			</p>

			<div className={styles.configSection}>
				<h2>Presets</h2>
				<div className={styles.presetGrid}>
					{getPresetNames().map((name) => {
						const presetConfig = getPresetConfig(name);
						return (
							<button
								key={name}
								type="button"
								className={`${styles.presetCard} ${selectedPreset === name ? styles.selected : ""}`}
								onClick={() => handlePresetChange(name)}
							>
								<h3>{name.charAt(0).toUpperCase() + name.slice(1)}</h3>
								<div className={styles.presetDetails}>
									<p>{presetConfig.secondsPerRound}s per round</p>
									<p>{presetConfig.maxCards} cards</p>
									<p>{presetConfig.numberOfRounds} rounds</p>
									<p>
										{presetConfig.enablePreparationPhase
											? "With prep"
											: "No prep"}
									</p>
								</div>
							</button>
						);
					})}
				</div>
			</div>

			<div className={styles.configSection}>
				<h2>Custom Settings</h2>
				<div className={styles.configGrid}>
					<div className={styles.configItem}>
						<label htmlFor="secondsPerRound">Seconds per Round:</label>
						<input
							id="secondsPerRound"
							type="range"
							min="15"
							max="180"
							step="15"
							value={config.secondsPerRound}
							onChange={(e) =>
								handleConfigChange("secondsPerRound", parseInt(e.target.value))
							}
						/>
						<span className={styles.configValue}>
							{config.secondsPerRound}s
						</span>
					</div>

					<div className={styles.configItem}>
						<label htmlFor="maxCards">Number of Cards:</label>
						<input
							id="maxCards"
							type="range"
							min="5"
							max="50"
							step="5"
							value={config.maxCards}
							onChange={(e) =>
								handleConfigChange("maxCards", parseInt(e.target.value))
							}
						/>
						<span className={styles.configValue}>{config.maxCards} cards</span>
					</div>

					<div className={styles.configItem}>
						<label htmlFor="numberOfRounds">Number of Rounds:</label>
						<input
							id="numberOfRounds"
							type="range"
							min="1"
							max="10"
							step="1"
							value={config.numberOfRounds}
							onChange={(e) =>
								handleConfigChange("numberOfRounds", parseInt(e.target.value))
							}
						/>
						<span className={styles.configValue}>
							{config.numberOfRounds} rounds
						</span>
					</div>

					<div className={`${styles.configItem} ${styles.checkbox}`}>
						<label className={styles.checkboxLabel}>
							<input
								type="checkbox"
								checked={config.enablePreparationPhase}
								onChange={(e) =>
									handleConfigChange("enablePreparationPhase", e.target.checked)
								}
							/>
							Enable Preparation Phase
						</label>
					</div>

					{config.enablePreparationPhase && (
						<div className={styles.configItem}>
							<label htmlFor="preparationTimeLimit">
								Preparation Time Limit:
							</label>
							<input
								id="preparationTimeLimit"
								type="range"
								min="0"
								max="60"
								step="5"
								value={config.preparationTimeLimit}
								onChange={(e) =>
									handleConfigChange(
										"preparationTimeLimit",
										parseInt(e.target.value),
									)
								}
							/>
							<span className={styles.configValue}>
								{config.preparationTimeLimit}s
							</span>
						</div>
					)}

					<div className={`${styles.configItem} ${styles.checkbox}`}>
						<label className={styles.checkboxLabel}>
							<input
								type="checkbox"
								checked={config.autoStartNextPlayer}
								onChange={(e) =>
									handleConfigChange("autoStartNextPlayer", e.target.checked)
								}
							/>
							Auto-start Next Player
						</label>
					</div>
				</div>
			</div>

			<div className={styles.configSummary}>
				<h3>Game Summary</h3>
				<div className={styles.summaryGrid}>
					<div className={styles.summaryItem}>
						<span className={styles.summaryLabel}>Round Duration:</span>
						<span className={styles.summaryValue}>
							{config.secondsPerRound} seconds
						</span>
					</div>
					<div className={styles.summaryItem}>
						<span className={styles.summaryLabel}>Total Cards:</span>
						<span className={styles.summaryValue}>{config.maxCards} cards</span>
					</div>
					<div className={styles.summaryItem}>
						<span className={styles.summaryLabel}>Number of Rounds:</span>
						<span className={styles.summaryValue}>
							{config.numberOfRounds} rounds
						</span>
					</div>
					<div className={styles.summaryItem}>
						<span className={styles.summaryLabel}>Selected Cards:</span>
						<span className={styles.summaryValue}>
							{currentDeck.length} cards
						</span>
					</div>
					{currentDeck.length > 0 && (
						<div className={styles.summaryItem}>
							<span className={styles.summaryLabel}>Sample Cards:</span>
							<span className={styles.summaryValue}>
								{currentDeck
									.slice(0, 3)
									.map((card) => card.word)
									.join(", ")}
								{currentDeck.length > 3 && "..."}
							</span>
						</div>
					)}
					<div className={styles.summaryItem}>
						<span className={styles.summaryLabel}>Preparation:</span>
						<span className={styles.summaryValue}>
							{config.enablePreparationPhase ? "Enabled" : "Disabled"}
						</span>
					</div>
					{config.enablePreparationPhase && config.preparationTimeLimit > 0 && (
						<div className={styles.summaryItem}>
							<span className={styles.summaryLabel}>Prep Time Limit:</span>
							<span className={styles.summaryValue}>
								{config.preparationTimeLimit} seconds
							</span>
						</div>
					)}
				</div>
			</div>

			<div className={styles.configActions}>
				{onShowDeckSelector && (
					<button
						type="button"
						className={styles.deckSelectorButton}
						onClick={onShowDeckSelector}
					>
						🎴 Select Decks
					</button>
				)}
				{onCreateCustomDeck && (
					<button
						type="button"
						className={styles.customDeckButton}
						onClick={onCreateCustomDeck}
					>
						🤖 Create Custom Deck
					</button>
				)}
				{onShowSavedDecks && (
					<button
						type="button"
						className={styles.savedDecksButton}
						onClick={onShowSavedDecks}
					>
						💾 Load Saved Deck
					</button>
				)}
				<button
					type="button"
					className={styles.startButton}
					onClick={handleStartGame}
				>
					Continue to Team Setup
				</button>
			</div>
		</>
	);
}
