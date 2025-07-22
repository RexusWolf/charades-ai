import { useState } from "react";
import { DEFAULT_CONFIG, PRESET_CONFIGS } from "../data/config";
import type { GameConfig } from "../types";

interface GameConfigScreenProps {
	onStartGame: (config: GameConfig) => void;
}

export function GameConfigScreen({ onStartGame }: GameConfigScreenProps) {
	const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);
	const [selectedPreset, setSelectedPreset] = useState<string>("standard");

	const handlePresetChange = (presetName: string) => {
		setSelectedPreset(presetName);
		setConfig(PRESET_CONFIGS[presetName]);
	};

	const handleConfigChange = (
		key: keyof GameConfig,
		value: number | boolean,
	) => {
		setConfig((prev) => ({ ...prev, [key]: value }));
		setSelectedPreset("custom");
	};

	const handleStartGame = () => {
		onStartGame(config);
	};

	return (
		<div className="app">
			<div className="container">
				<h1>🎭 Game Configuration</h1>
				<p className="instructions">
					Customize your game settings or choose a preset
				</p>

				<div className="config-section">
					<h2>Presets</h2>
					<div className="preset-grid">
						{Object.entries(PRESET_CONFIGS).map(([name, presetConfig]) => (
							<button
								key={name}
								type="button"
								className={`preset-card ${selectedPreset === name ? "selected" : ""}`}
								onClick={() => handlePresetChange(name)}
							>
								<h3>{name.charAt(0).toUpperCase() + name.slice(1)}</h3>
								<div className="preset-details">
									<p>{presetConfig.secondsPerRound}s per round</p>
									<p>{presetConfig.maxCards} cards</p>
									<p>
										{presetConfig.enablePreparationPhase
											? "With prep"
											: "No prep"}
									</p>
								</div>
							</button>
						))}
					</div>
				</div>

				<div className="config-section">
					<h2>Custom Settings</h2>
					<div className="config-grid">
						<div className="config-item">
							<label htmlFor="secondsPerRound">Seconds per Round:</label>
							<input
								id="secondsPerRound"
								type="range"
								min="15"
								max="180"
								step="15"
								value={config.secondsPerRound}
								onChange={(e) =>
									handleConfigChange(
										"secondsPerRound",
										parseInt(e.target.value),
									)
								}
							/>
							<span className="config-value">{config.secondsPerRound}s</span>
						</div>

						<div className="config-item">
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
							<span className="config-value">{config.maxCards} cards</span>
						</div>

						<div className="config-item checkbox">
							<label>
								<input
									type="checkbox"
									checked={config.enablePreparationPhase}
									onChange={(e) =>
										handleConfigChange(
											"enablePreparationPhase",
											e.target.checked,
										)
									}
								/>
								Enable Preparation Phase
							</label>
						</div>

						{config.enablePreparationPhase && (
							<div className="config-item">
								<label htmlFor="preparationTimeLimit">
									Preparation Time Limit (0 = no limit):
								</label>
								<input
									id="preparationTimeLimit"
									type="range"
									min="0"
									max="120"
									step="15"
									value={config.preparationTimeLimit}
									onChange={(e) =>
										handleConfigChange(
											"preparationTimeLimit",
											parseInt(e.target.value),
										)
									}
								/>
								<span className="config-value">
									{config.preparationTimeLimit === 0
										? "No limit"
										: `${config.preparationTimeLimit}s`}
								</span>
							</div>
						)}

						<div className="config-item checkbox">
							<label>
								<input
									type="checkbox"
									checked={config.autoStartNextPlayer}
									onChange={(e) =>
										handleConfigChange("autoStartNextPlayer", e.target.checked)
									}
								/>
								Auto-start next player (skip preparation)
							</label>
						</div>
					</div>
				</div>

				<div className="config-summary">
					<h3>Game Summary</h3>
					<div className="summary-grid">
						<div className="summary-item">
							<span className="summary-label">Round Duration:</span>
							<span className="summary-value">
								{config.secondsPerRound} seconds
							</span>
						</div>
						<div className="summary-item">
							<span className="summary-label">Total Cards:</span>
							<span className="summary-value">{config.maxCards} cards</span>
						</div>
						<div className="summary-item">
							<span className="summary-label">Preparation:</span>
							<span className="summary-value">
								{config.enablePreparationPhase ? "Enabled" : "Disabled"}
							</span>
						</div>
						{config.enablePreparationPhase &&
							config.preparationTimeLimit > 0 && (
								<div className="summary-item">
									<span className="summary-label">Prep Time Limit:</span>
									<span className="summary-value">
										{config.preparationTimeLimit} seconds
									</span>
								</div>
							)}
					</div>
				</div>

				<button
					type="button"
					className="start-button"
					onClick={handleStartGame}
				>
					Continue to Team Setup
				</button>
			</div>
		</div>
	);
}
