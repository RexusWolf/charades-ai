import { useRef, useState } from "react";
import {
	deleteDeck,
	exportDecks,
	getDeckStats,
	getSavedDecks,
	importDecks,
	loadDeck,
	renameDeck,
	type SavedDeck,
} from "../data/savedDecks";
import type { Card } from "../types";

interface SavedDecksManagerProps {
	onDeckSelected: (deck: Card[]) => void;
	onClose: () => void;
}

export function SavedDecksManager({
	onDeckSelected,
	onClose,
}: SavedDecksManagerProps) {
	const [savedDecks, setSavedDecks] = useState<SavedDeck[]>(() =>
		getSavedDecks(),
	);
	const [editingDeckId, setEditingDeckId] = useState<string | null>(null);
	const [editName, setEditName] = useState("");
	const [stats] = useState(() => getDeckStats());
	const [showImportExport, setShowImportExport] = useState(false);
	const [importMessage, setImportMessage] = useState("");
	const [importSuccess, setImportSuccess] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleUseDeck = (deckId: string) => {
		const cards = loadDeck(deckId);
		if (cards) {
			onDeckSelected(cards);
			onClose();
		}
	};

	const handleDeleteDeck = (deckId: string) => {
		if (deleteDeck(deckId)) {
			setSavedDecks(getSavedDecks());
		}
	};

	const handleStartRename = (deck: SavedDeck) => {
		setEditingDeckId(deck.id);
		setEditName(deck.name);
	};

	const handleSaveRename = (deckId: string) => {
		if (renameDeck(deckId, editName.trim())) {
			setSavedDecks(getSavedDecks());
		}
		setEditingDeckId(null);
		setEditName("");
	};

	const handleCancelRename = () => {
		setEditingDeckId(null);
		setEditName("");
	};

	const handleExportDecks = () => {
		const exportData = exportDecks();
		const blob = new Blob([exportData], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `charades-decks-${new Date().toISOString().split("T")[0]}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const handleImportDecks = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			const content = e.target?.result as string;
			const result = importDecks(content);

			setImportSuccess(result.success);
			setImportMessage(result.message);

			if (result.success) {
				setSavedDecks(getSavedDecks());
			}

			// Clear the file input
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		};
		reader.readAsText(file);
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	return (
		<div className="modal-overlay">
			<div className="modal saved-decks-modal">
				<div className="modal-header">
					<h2>💾 Saved Decks</h2>
					<div className="modal-header-actions">
						<button
							type="button"
							className="import-export-btn"
							onClick={() => setShowImportExport(true)}
						>
							📥📤 Import/Export
						</button>
						<button type="button" className="close-button" onClick={onClose}>
							×
						</button>
					</div>
				</div>

				{savedDecks.length === 0 ? (
					<div className="empty-state">
						<div className="empty-icon">📚</div>
						<h3>No Saved Decks</h3>
						<p>You haven't saved any custom decks yet.</p>
						<p>Generate a deck and save it to see it here!</p>
						<div className="empty-state-actions">
							<button
								type="button"
								className="import-decks-btn"
								onClick={() => setShowImportExport(true)}
							>
								📥 Import Decks
							</button>
						</div>
					</div>
				) : (
					<>
						<div className="stats-section">
							<div className="stat-item">
								<span className="stat-label">Total Decks:</span>
								<span className="stat-value">{stats.total}</span>
							</div>
							<div className="stat-item">
								<span className="stat-label">Total Cards:</span>
								<span className="stat-value">{stats.totalCards}</span>
							</div>
							{stats.mostUsed && (
								<div className="stat-item">
									<span className="stat-label">Most Used:</span>
									<span className="stat-value">{stats.mostUsed.name}</span>
								</div>
							)}
						</div>

						<div className="decks-list">
							{savedDecks.map((deck) => (
								<div key={deck.id} className="saved-deck-item">
									<div className="deck-info">
										<div className="deck-header">
											{editingDeckId === deck.id ? (
												<input
													type="text"
													value={editName}
													onChange={(e) => setEditName(e.target.value)}
													className="rename-input"
												/>
											) : (
												<h3>{deck.name}</h3>
											)}
											<div className="deck-actions">
												{editingDeckId === deck.id ? (
													<>
														<button
															type="button"
															className="save-rename-btn"
															onClick={() => handleSaveRename(deck.id)}
															disabled={!editName.trim()}
														>
															✓
														</button>
														<button
															type="button"
															className="cancel-rename-btn"
															onClick={handleCancelRename}
														>
															✗
														</button>
													</>
												) : (
													<>
														<button
															type="button"
															className="rename-btn"
															onClick={() => handleStartRename(deck)}
														>
															✏️
														</button>
														<button
															type="button"
															className="delete-btn"
															onClick={() => handleDeleteDeck(deck.id)}
														>
															🗑️
														</button>
													</>
												)}
											</div>
										</div>
										<div className="deck-details">
											<p className="deck-topic">Topic: {deck.topic}</p>
											<p className="deck-cards">{deck.cards.length} cards</p>
											<p className="deck-created">
												Created: {formatDate(deck.createdAt)}
											</p>
											{deck.lastUsed && (
												<p className="deck-used">
													Last used: {formatDate(deck.lastUsed)}
												</p>
											)}
											<p className="deck-uses">
												Used {deck.useCount} time
												{deck.useCount !== 1 ? "s" : ""}
											</p>
										</div>
									</div>
									<div className="deck-preview">
										<div className="preview-cards">
											{deck.cards.slice(0, 3).map((card) => (
												<div key={card.id} className="preview-card">
													<div className="card-category">{card.category}</div>
													<div className="card-word">{card.word}</div>
												</div>
											))}
											{deck.cards.length > 3 && (
												<div className="more-cards">
													+{deck.cards.length - 3} more
												</div>
											)}
										</div>
										<button
											type="button"
											className="use-deck-btn"
											onClick={() => handleUseDeck(deck.id)}
										>
											Use This Deck
										</button>
									</div>
								</div>
							))}
						</div>
					</>
				)}

				{/* Import/Export Dialog */}
				{showImportExport && (
					<div className="import-export-dialog-overlay">
						<div className="import-export-dialog">
							<div className="import-export-dialog-header">
								<h3>📥📤 Import/Export Decks</h3>
								<button
									type="button"
									className="close-dialog-btn"
									onClick={() => {
										setShowImportExport(false);
										setImportMessage("");
									}}
								>
									×
								</button>
							</div>
							<div className="import-export-dialog-content">
								<div className="export-section">
									<h4>📤 Export Decks</h4>
									<p>Download all your saved decks as a JSON file.</p>
									<button
										type="button"
										className="export-btn"
										onClick={handleExportDecks}
									>
										📥 Export All Decks
									</button>
								</div>

								<div className="import-section">
									<h4>📥 Import Decks</h4>
									<p>Import decks from a previously exported JSON file.</p>
									<input
										ref={fileInputRef}
										type="file"
										accept=".json"
										onChange={handleImportDecks}
										className="file-input"
									/>
									{importMessage && (
										<div
											className={`import-message ${importSuccess ? "success" : "error"}`}
										>
											{importMessage}
										</div>
									)}
								</div>

								<div className="import-export-tips">
									<h4>💡 Tips</h4>
									<ul>
										<li>Exported files contain all your deck data</li>
										<li>
											Import files should be in the same format as exports
										</li>
										<li>Duplicate deck names will be automatically renamed</li>
										<li>You can share exported files with friends</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
