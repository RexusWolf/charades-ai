import { useState } from "react";
import { saveDeck } from "../data/savedDecks";
import { generateDeckWithGemini } from "../services/ai";
import type { Card } from "../types";

interface CustomDeckCreatorProps {
	onDeckCreated: (deck: Card[]) => void;
	onCancel: () => void;
}

export function CustomDeckCreator({
	onDeckCreated,
	onCancel,
}: CustomDeckCreatorProps) {
	const [topic, setTopic] = useState("");
	const [cardCount, setCardCount] = useState(15);
	const [isGenerating, setIsGenerating] = useState(false);
	const [generatedCards, setGeneratedCards] = useState<Card[]>([]);
	const [error, setError] = useState("");
	const [showSaveDialog, setShowSaveDialog] = useState(false);
	const [saveName, setSaveName] = useState("");
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [apiKey, setApiKey] = useState("");
	const [showApiKeyInput, setShowApiKeyInput] = useState(false);

	const generateDeck = async () => {
		if (!topic.trim()) {
			setError("Please enter a topic for your deck");
			return;
		}

		setIsGenerating(true);
		setError("");

		try {
			const cards = await generateDeckWithGemini(topic, apiKey, cardCount);
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
			onDeckCreated(generatedCards);
		}
	};

	const handleSaveDeck = () => {
		if (generatedCards.length > 0) {
			saveDeck(generatedCards, topic, saveName || topic);
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

	return (
		<div className="custom-deck-creator">
			<div className="creator-header">
				<h2>🤖 AI Deck Creator</h2>
				<p className="creator-description">
					Generate a custom deck instantly using AI! Just describe what you want
					to play with.
				</p>
			</div>

			<div className="creator-form">
				<div className="input-group">
					<label htmlFor="topic">Deck Topic or Prompt:</label>
					<input
						id="topic"
						type="text"
						placeholder="e.g., 'animals', 'Spanish TV series', 'French food', 'German movies'..."
						value={topic}
						onChange={(e) => setTopic(e.target.value)}
						className="topic-input"
						disabled={isGenerating}
					/>
				</div>

				<div className="input-group">
					<label htmlFor="cardCount">Number of Cards:</label>
					<div className="card-count-selector">
						<input
							id="cardCount"
							type="range"
							min="5"
							max="50"
							step="5"
							value={cardCount}
							onChange={(e) => setCardCount(parseInt(e.target.value))}
							className="card-count-slider"
							disabled={isGenerating}
						/>
						<span className="card-count-value">{cardCount} cards</span>
					</div>
				</div>

				{error && <div className="error-message">{error}</div>}

				<div className="creator-actions">
					<button
						type="button"
						className="generate-button"
						onClick={handleGenerateClick}
						disabled={isGenerating || !topic.trim()}
					>
						{isGenerating ? (
							<>
								<span className="loading-spinner"></span>
								Generating...
							</>
						) : (
							"🚀 Generate Deck"
						)}
					</button>
					<button
						type="button"
						className="cancel-button"
						onClick={onCancel}
						disabled={isGenerating}
					>
						Cancel
					</button>
				</div>
			</div>

			{generatedCards.length > 0 && (
				<div className="generated-deck">
					<div className="deck-header">
						<h3>Generated Deck ({generatedCards.length} cards)</h3>
						<button
							type="button"
							className="regenerate-button"
							onClick={regenerateDeck}
						>
							🔄 Regenerate
						</button>
					</div>

					<div className="cards-preview">
						{generatedCards.map((card) => (
							<div key={card.id} className="preview-card">
								<div className="card-category">{card.category}</div>
								<div className="card-word">{card.word}</div>
							</div>
						))}
					</div>

					<div className="deck-actions">
						<button
							type="button"
							className="save-deck-button"
							onClick={() => setShowSaveDialog(true)}
						>
							💾 Save Deck
						</button>
						<button
							type="button"
							className="use-deck-button"
							onClick={handleUseDeck}
						>
							✅ Use This Deck
						</button>
					</div>
				</div>
			)}

			{isGenerating && (
				<div className="generation-status">
					<div className="status-content">
						<div className="ai-thinking">
							<div className="ai-avatar">🤖</div>
							<div className="thinking-text">
								AI is thinking about your topic: <strong>"{topic}"</strong>
							</div>
						</div>
						<div className="generation-tips">
							<p>💡 Tips for better results:</p>
							<ul>
								<li>Be specific about the category you want</li>
								<li>Try different topics like "animals", "movies", "food"</li>
								<li>
									Add language for international content: "Spanish TV series",
									"French food", "German movies"
								</li>
								<li>
									You can be creative: "space exploration", "famous landmarks"
								</li>
							</ul>
						</div>
					</div>
				</div>
			)}

			{/* API Key Input Dialog */}
			{showApiKeyInput && (
				<div className="api-key-dialog-overlay">
					<div className="api-key-dialog">
						<div className="api-key-dialog-header">
							<h3>🔑 API Key Required</h3>
							<button
								type="button"
								className="close-dialog-btn"
								onClick={() => setShowApiKeyInput(false)}
							>
								×
							</button>
						</div>
						<div className="api-key-dialog-content">
							<p>To generate custom decks, you need a Google Gemini API key.</p>
							<div className="api-key-instructions">
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
							<div className="input-group">
								<label htmlFor="apiKey">API Key:</label>
								<input
									id="apiKey"
									type="password"
									value={apiKey}
									onChange={(e) => setApiKey(e.target.value)}
									placeholder="Enter your Gemini API key"
									className="api-key-input"
								/>
							</div>
							<div className="api-key-dialog-actions">
								<button
									type="button"
									className="cancel-api-key-btn"
									onClick={() => setShowApiKeyInput(false)}
								>
									Cancel
								</button>
								<button
									type="button"
									className="confirm-api-key-btn"
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
				<div className="save-dialog-overlay">
					<div className="save-dialog">
						<div className="save-dialog-header">
							<h3>💾 Save Deck</h3>
							<button
								type="button"
								className="close-dialog-btn"
								onClick={() => setShowSaveDialog(false)}
							>
								×
							</button>
						</div>
						<div className="save-dialog-content">
							<p>Give your deck a name:</p>
							<input
								type="text"
								value={saveName}
								onChange={(e) => setSaveName(e.target.value)}
								placeholder={topic}
								className="save-name-input"
							/>
							<div className="save-dialog-actions">
								<button
									type="button"
									className="cancel-save-btn"
									onClick={() => setShowSaveDialog(false)}
								>
									Cancel
								</button>
								<button
									type="button"
									className="confirm-save-btn"
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
				<div className="success-message">
					<div className="success-content">
						<div className="success-icon">✅</div>
						<div className="success-text">
							<h4>Deck Saved Successfully!</h4>
							<p>Your deck "{saveName || topic}" has been saved.</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
