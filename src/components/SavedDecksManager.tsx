import { useState } from "react";
import {
	deleteDeck,
	getDeckStats,
	getSavedDecks,
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

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	if (savedDecks.length === 0) {
		return (
			<div className="modal-overlay">
				<div className="modal saved-decks-modal">
					<div className="modal-header">
						<h2>💾 Saved Decks</h2>
						<button type="button" className="close-button" onClick={onClose}>
							×
						</button>
					</div>
					<div className="empty-state">
						<div className="empty-icon">📚</div>
						<h3>No Saved Decks</h3>
						<p>You haven't saved any custom decks yet.</p>
						<p>Generate a deck and save it to see it here!</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="modal-overlay">
			<div className="modal saved-decks-modal">
				<div className="modal-header">
					<h2>💾 Saved Decks</h2>
					<button type="button" className="close-button" onClick={onClose}>
						×
					</button>
				</div>

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
										Used {deck.useCount} time{deck.useCount !== 1 ? "s" : ""}
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
			</div>
		</div>
	);
}
