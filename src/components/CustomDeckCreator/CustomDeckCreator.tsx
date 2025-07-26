import { useState } from "react";
import { Language } from "../../data/language";
import { saveDeck } from "../../data/savedDecks";
import { generateDeckWithGemini } from "../../services/ai";
import type { DeckCard } from "../Card/DeckCard";
import type { GameCard } from "../Card/GameCard";
import styles from "./CustomDeckCreator.module.css";

interface CustomDeckCreatorProps {
	onDeckCreated: (deck: GameCard[]) => void;
	onCancel: () => void;
}

type CreatorMode = "ai" | "manual";

export function CustomDeckCreator({
	onDeckCreated,
	onCancel,
}: CustomDeckCreatorProps) {
	const [mode, setMode] = useState<CreatorMode>("ai");

	// AI Generation State
	const [topic, setTopic] = useState("");
	const [cardCount, setCardCount] = useState(30);
	const [language, setLanguage] = useState<Language>(Language.universal());
	const [isGenerating, setIsGenerating] = useState(false);
	const [generatedCards, setGeneratedCards] = useState<DeckCard[]>([]);
	const [error, setError] = useState("");
	const [showSaveDialog, setShowSaveDialog] = useState(false);
	const [saveName, setSaveName] = useState("");
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [apiKey, setApiKey] = useState("");
	const [showApiKeyInput, setShowApiKeyInput] = useState(false);

	// Manual Creation State
	const [deckName, setDeckName] = useState("");
	const [manualLanguage, setManualLanguage] = useState<Language>(
		Language.universal(),
	);
	const [wordInput, setWordInput] = useState("");
	const [separator, setSeparator] = useState<"newline" | "comma" | "semicolon">(
		"newline",
	);
	const [manualCards, setManualCards] = useState<DeckCard[]>([]);
	const [manualError, setManualError] = useState("");

	const generateDeck = async () => {
		if (!topic.trim()) {
			setError("Please enter a topic for your deck");
			return;
		}

		setIsGenerating(true);
		setError("");

		try {
			const cards = await generateDeckWithGemini(
				topic,
				apiKey,
				cardCount,
				language,
			);
			setGeneratedCards(cards);
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Failed to generate deck. Please try again.";
			setError(errorMessage);
		} finally {
			setIsGenerating(false);
		}
	};

	const handleUseDeck = () => {
		if (generatedCards.length > 0) {
			onDeckCreated(
				generatedCards.map((card) => ({
					id: Date.now(),
					word: card,
					deckId: `deck-${Date.now()}`,
				})),
			);
		}
	};

	const handleSaveDeck = () => {
		if (generatedCards.length > 0) {
			saveDeck({
				deckCards: generatedCards,
				name: saveName || topic,
				language,
			});
			setShowSaveDialog(false);
			setSaveName("");
			setShowSuccessMessage(true);
			// Hide success message after 3 seconds
			setTimeout(() => setShowSuccessMessage(false), 3000);
		}
	};

	const regenerateDeck = () => {
		setGeneratedCards([]);
		setError("");
	};

	const handleGenerateClick = () => {
		// Check if API key is available
		const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
		if (!envApiKey && !apiKey) {
			setShowApiKeyInput(true);
			return;
		}
		generateDeck();
	};

	const handleApiKeySubmit = () => {
		if (apiKey.trim()) {
			setShowApiKeyInput(false);
			generateDeck();
		}
	};

	// Manual deck creation functions
	const parseWords = () => {
		if (!wordInput.trim()) {
			setManualError("Please enter some words");
			return;
		}

		if (!deckName.trim()) {
			setManualError("Please enter a deck name");
			return;
		}

		let separatorChar = "\n";
		if (separator === "comma") separatorChar = ",";
		else if (separator === "semicolon") separatorChar = ";";

		const words = wordInput
			.split(separatorChar)
			.map((word) => word.trim())
			.filter((word) => word.length > 0);

		if (words.length === 0) {
			setManualError(
				"No valid words found. Please check your input and separator.",
			);
			return;
		}

		setManualCards(words);
		setManualError("");
	};

	const handleUseManualDeck = () => {
		if (manualCards.length > 0) {
			onDeckCreated(
				manualCards.map((card) => ({
					id: Date.now(),
					word: card,
					deckId: `deck-${Date.now()}`,
				})),
			);
		}
	};

	const handleSaveManualDeck = () => {
		if (manualCards.length > 0) {
			saveDeck({
				deckCards: manualCards,
				name: deckName,
				language: manualLanguage,
			});
			setShowSuccessMessage(true);
			// Hide success message after 3 seconds
			setTimeout(() => setShowSuccessMessage(false), 3000);
		}
	};

	const clearManualDeck = () => {
		setManualCards([]);
		setWordInput("");
		setDeckName("");
		setManualError("");
	};

	return (
		<div className={styles.customDeckCreator}>
			<div className={styles.creatorHeader}>
				<h2>🎴 Custom Deck Creator</h2>
				<p className={styles.creatorDescription}>
					Create your own custom deck using AI or by pasting your own words.
				</p>
			</div>

			{/* Mode Selector */}
			<div className={styles.modeSelector}>
				<button
					type="button"
					className={`${styles.modeButton} ${mode === "ai" ? styles.activeMode : ""}`}
					onClick={() => setMode("ai")}
				>
					🤖 AI Generation
				</button>
				<button
					type="button"
					className={`${styles.modeButton} ${mode === "manual" ? styles.activeMode : ""}`}
					onClick={() => setMode("manual")}
				>
					✏️ Manual Creation
				</button>
			</div>

			{/* AI Generation Mode */}
			{mode === "ai" && (
				<>
					<div className={styles.creatorForm}>
						<div className={styles.inputGroup}>
							<label htmlFor="topic">Deck Topic or Prompt:</label>
							<input
								id="topic"
								type="text"
								placeholder="e.g., 'animals', 'Spanish TV series', 'French food', 'German movies'..."
								value={topic}
								onChange={(e) => setTopic(e.target.value)}
								className={styles.topicInput}
								disabled={isGenerating}
							/>
						</div>

						<div className={styles.inputGroup}>
							<label htmlFor="cardCount">Number of Cards:</label>
							<div className={styles.cardCountSelector}>
								<input
									id="cardCount"
									type="range"
									min="10"
									max="200"
									step="5"
									value={cardCount}
									onChange={(e) => setCardCount(parseInt(e.target.value))}
									className={styles.cardCountSlider}
									disabled={isGenerating}
								/>
								<span className={styles.cardCountValue}>{cardCount} cards</span>
							</div>
						</div>

						<div className={styles.inputGroup}>
							<label htmlFor="language">Language:</label>
							<select
								id="language"
								value={language.code}
								onChange={(e) => {
									const selectedLanguage = Language.getAll().find(
										(lang) => lang.code === e.target.value,
									);
									if (selectedLanguage) {
										setLanguage(selectedLanguage);
									}
								}}
								className={styles.languageSelect}
								disabled={isGenerating}
							>
								{Language.getAll().map((lang) => (
									<option key={lang.code} value={lang.code}>
										{lang.display}
									</option>
								))}
							</select>
						</div>

						{error && <div className={styles.errorMessage}>{error}</div>}

						<div className={styles.creatorActions}>
							<button
								type="button"
								className={styles.generateButton}
								onClick={handleGenerateClick}
								disabled={isGenerating || !topic.trim()}
							>
								{isGenerating ? (
									<>
										<span className={styles.loadingSpinner}></span>
										Generating...
									</>
								) : (
									"🚀 Generate Deck"
								)}
							</button>
							<button
								type="button"
								className={styles.cancelButton}
								onClick={onCancel}
								disabled={isGenerating}
							>
								Cancel
							</button>
						</div>
					</div>

					{generatedCards.length > 0 && (
						<div className={styles.generatedDeck}>
							<div className={styles.deckHeader}>
								<h3>Generated Deck ({generatedCards.length} cards)</h3>
								<button
									type="button"
									className={styles.regenerateButton}
									onClick={regenerateDeck}
								>
									🔄 Regenerate
								</button>
							</div>

							<div className={styles.cardsPreview}>
								{generatedCards.map((card) => (
									<div key={card} className={styles.previewCard}>
										<div className={styles.cardWord}>{card}</div>
									</div>
								))}
							</div>

							<div className={styles.deckActions}>
								<button
									type="button"
									className={styles.saveDeckButton}
									onClick={() => setShowSaveDialog(true)}
								>
									💾 Save Deck
								</button>
								<button
									type="button"
									className={styles.useDeckButton}
									onClick={handleUseDeck}
								>
									✅ Use This Deck
								</button>
							</div>
						</div>
					)}

					{isGenerating && (
						<div className={styles.generationStatus}>
							<div className={styles.statusContent}>
								<div className={styles.aiThinking}>
									<div className={styles.aiAvatar}>🤖</div>
									<div className={styles.thinkingText}>
										AI is thinking about your topic: <strong>"{topic}"</strong>
									</div>
								</div>
								<div className={styles.generationTips}>
									<p>💡 Tips for better results:</p>
									<ul>
										<li>Be specific about the category you want</li>
										<li>
											Try different topics like "animals", "movies", "food"
										</li>
										<li>
											Add language for international content: "Spanish TV
											series", "French food", "German movies"
										</li>
										<li>
											You can be creative: "space exploration", "famous
											landmarks"
										</li>
									</ul>
								</div>
							</div>
						</div>
					)}
				</>
			)}

			{/* Manual Creation Mode */}
			{mode === "manual" && (
				<>
					<div className={styles.creatorForm}>
						<div className={styles.inputGroup}>
							<label htmlFor="deckName">Deck Name:</label>
							<input
								id="deckName"
								type="text"
								placeholder="Enter a name for your deck"
								value={deckName}
								onChange={(e) => setDeckName(e.target.value)}
								className={styles.topicInput}
							/>
						</div>

						<div className={styles.inputGroup}>
							<label htmlFor="manualLanguage">Language:</label>
							<select
								id="manualLanguage"
								value={manualLanguage.code}
								onChange={(e) => {
									const selectedLanguage = Language.getAll().find(
										(lang) => lang.code === e.target.value,
									);
									if (selectedLanguage) {
										setManualLanguage(selectedLanguage);
									}
								}}
								className={styles.languageSelect}
							>
								{Language.getAll().map((lang) => (
									<option key={lang.code} value={lang.code}>
										{lang.display}
									</option>
								))}
							</select>
						</div>

						<div className={styles.inputGroup}>
							<label htmlFor="separator">Word Separator:</label>
							<select
								id="separator"
								value={separator}
								onChange={(e) =>
									setSeparator(
										e.target.value as "newline" | "comma" | "semicolon",
									)
								}
								className={styles.languageSelect}
							>
								<option value="newline">Line Break (↵)</option>
								<option value="comma">Comma (,)</option>
								<option value="semicolon">Semicolon (;)</option>
							</select>
						</div>

						<div className={styles.inputGroup}>
							<label htmlFor="wordInput">
								Words (one per line or separated by your chosen separator):
							</label>
							<textarea
								id="wordInput"
								placeholder="Enter your words here...
Example:
dog
cat
bird
or
dog, cat, bird
or
dog; cat; bird"
								value={wordInput}
								onChange={(e) => setWordInput(e.target.value)}
								className={styles.wordInput}
								rows={8}
							/>
						</div>

						{manualError && (
							<div className={styles.errorMessage}>{manualError}</div>
						)}

						<div className={styles.creatorActions}>
							<button
								type="button"
								className={styles.generateButton}
								onClick={parseWords}
								disabled={!wordInput.trim() || !deckName.trim()}
							>
								📝 Create Deck
							</button>
							<button
								type="button"
								className={styles.cancelButton}
								onClick={onCancel}
							>
								Cancel
							</button>
						</div>
					</div>

					{manualCards.length > 0 && (
						<div className={styles.generatedDeck}>
							<div className={styles.deckHeader}>
								<h3>
									Created Deck: {deckName} ({manualCards.length} cards)
								</h3>
								<button
									type="button"
									className={styles.regenerateButton}
									onClick={clearManualDeck}
								>
									🗑️ Clear
								</button>
							</div>

							<div className={styles.cardsPreview}>
								{manualCards.map((card, index) => (
									<div
										key={`manual-card-${index}-${card}`}
										className={styles.previewCard}
									>
										<div className={styles.cardWord}>{card}</div>
									</div>
								))}
							</div>

							<div className={styles.deckActions}>
								<button
									type="button"
									className={styles.saveDeckButton}
									onClick={handleSaveManualDeck}
								>
									💾 Save Deck
								</button>
								<button
									type="button"
									className={styles.useDeckButton}
									onClick={handleUseManualDeck}
								>
									✅ Use This Deck
								</button>
							</div>
						</div>
					)}
				</>
			)}

			{/* API Key Input Dialog */}
			{showApiKeyInput && (
				<div className={styles.apiKeyDialogOverlay}>
					<div className={styles.apiKeyDialog}>
						<div className={styles.apiKeyDialogHeader}>
							<h3>🔑 API Key Required</h3>
							<button
								type="button"
								className={styles.closeDialogBtn}
								onClick={() => setShowApiKeyInput(false)}
							>
								×
							</button>
						</div>
						<div className={styles.apiKeyDialogContent}>
							<p>To generate custom decks, you need a Google Gemini API key.</p>
							<div className={styles.apiKeyInstructions}>
								<p>
									<strong>How to get your API key:</strong>
								</p>
								<ol>
									<li>
										Go to{" "}
										<a
											href="https://makersuite.google.com/app/apikey"
											target="_blank"
											rel="noopener noreferrer"
										>
											Google AI Studio
										</a>
									</li>
									<li>Sign in with your Google account</li>
									<li>Click "Create API Key"</li>
									<li>Copy the generated key</li>
								</ol>
							</div>
							<div className={styles.inputGroup}>
								<label htmlFor="apiKey">API Key:</label>
								<input
									id="apiKey"
									type="password"
									value={apiKey}
									onChange={(e) => setApiKey(e.target.value)}
									placeholder="Enter your Gemini API key"
									className={styles.apiKeyInput}
								/>
							</div>
							<div className={styles.apiKeyDialogActions}>
								<button
									type="button"
									className={styles.cancelApiKeyBtn}
									onClick={() => setShowApiKeyInput(false)}
								>
									Cancel
								</button>
								<button
									type="button"
									className={styles.confirmApiKeyBtn}
									onClick={handleApiKeySubmit}
									disabled={!apiKey.trim()}
								>
									Generate Deck
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Save Dialog */}
			{showSaveDialog && (
				<div className={styles.saveDialogOverlay}>
					<div className={styles.saveDialog}>
						<div className={styles.saveDialogHeader}>
							<h3>💾 Save Deck</h3>
							<button
								type="button"
								className={styles.closeDialogBtn}
								onClick={() => setShowSaveDialog(false)}
							>
								×
							</button>
						</div>
						<div className={styles.saveDialogContent}>
							<p>Give your deck a name:</p>
							<input
								type="text"
								value={saveName}
								onChange={(e) => setSaveName(e.target.value)}
								placeholder={topic}
								className={styles.saveNameInput}
							/>
							<div className={styles.saveDialogActions}>
								<button
									type="button"
									className={styles.cancelSaveBtn}
									onClick={() => setShowSaveDialog(false)}
								>
									Cancel
								</button>
								<button
									type="button"
									className={styles.confirmSaveBtn}
									onClick={handleSaveDeck}
									disabled={!saveName.trim()}
								>
									Save Deck
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Success Message */}
			{showSuccessMessage && (
				<div className={styles.successMessage}>
					<div className={styles.successContent}>
						<div className={styles.successIcon}>✅</div>
						<div className={styles.successText}>
							<h4>Deck Saved Successfully!</h4>
							<p>Your deck "{saveName || topic || deckName}" has been saved.</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
