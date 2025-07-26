import { useState } from "react";
import type { Deck } from "../../data/Decks/Deck";
import {
	deleteDeck,
	getDeckCards,
	getDeckStats,
	getSavedDecks,
	renameDeck,
} from "../../data/savedDecks";
import type { GameCard } from "../Card/GameCard";
import { ImportExportDialog } from "../ImportExportDialog/ImportExportDialog";
import styles from "./SavedDecksManager.module.css";

interface SavedDecksManagerProps {
	onDeckSelected: (deck: GameCard[]) => void;
	onClose: () => void;
}

export function SavedDecksManager({
	onDeckSelected,
	onClose,
}: SavedDecksManagerProps) {
	const [savedDecks, setSavedDecks] = useState<Deck[]>(() => getSavedDecks());
	const [editingDeckId, setEditingDeckId] = useState<string | null>(null);
	const [editName, setEditName] = useState("");
	const [stats] = useState(() => getDeckStats());
	const [showImportExport, setShowImportExport] = useState(false);

	const handleUseDeck = (deckId: string) => {
		const cards = getDeckCards(deckId);
		if (cards) {
			onDeckSelected(
				cards.map((card) => ({
					id: Date.now(),
					word: card,
					deckId,
				})),
			);
			onClose();
		}
	};

	const handleDeleteDeck = (deckId: string) => {
		if (deleteDeck(deckId)) {
			setSavedDecks(getSavedDecks());
		}
	};

	const handleStartRename = (deck: Deck) => {
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

	const handleImportSuccess = () => {
		setSavedDecks(getSavedDecks());
	};

	return (
		<div className={styles.modalOverlay}>
			<div className={`${styles.modal} ${styles.savedDecksModal}`}>
				<div className={styles.modalHeader}>
					<h2>💾 Saved Decks</h2>
					<div className={styles.modalHeaderActions}>
						<button
							type="button"
							className={styles.importExportBtn}
							onClick={() => setShowImportExport(true)}
						>
							📥 Import / 📤 Export
						</button>
						<button
							type="button"
							className={styles.closeButton}
							onClick={onClose}
						>
							×
						</button>
					</div>
				</div>

				{savedDecks.length === 0 ? (
					<div className={styles.emptyState}>
						<div className={styles.emptyIcon}>📚</div>
						<h3>No Saved Decks</h3>
						<p>You haven't saved any custom decks yet.</p>
						<p>Generate a deck and save it to see it here!</p>
						<div className={styles.emptyStateActions}>
							<button
								type="button"
								className={styles.importDecksBtn}
								onClick={() => setShowImportExport(true)}
							>
								📥 Import Decks
							</button>
						</div>
					</div>
				) : (
					<>
						<div className={styles.statsSection}>
							<div className={styles.statItem}>
								<span className={styles.statLabel}>Total Decks:</span>
								<span className={styles.statValue}>{stats.total}</span>
							</div>
							<div className={styles.statItem}>
								<span className={styles.statLabel}>Total Cards:</span>
								<span className={styles.statValue}>{stats.totalCards}</span>
							</div>
						</div>

						<div className={styles.decksList}>
							{savedDecks.map((deck) => (
								<div key={deck.id} className={styles.savedDeckItem}>
									<div className={styles.deckInfo}>
										<div className={styles.deckHeader}>
											{editingDeckId === deck.id ? (
												<input
													type="text"
													value={editName}
													onChange={(e) => setEditName(e.target.value)}
													className={styles.renameInput}
												/>
											) : (
												<h3>{deck.name}</h3>
											)}
											<div className={styles.deckActions}>
												{editingDeckId === deck.id ? (
													<>
														<button
															type="button"
															className={styles.saveRenameBtn}
															onClick={() => handleSaveRename(deck.id)}
															disabled={!editName.trim()}
														>
															✓
														</button>
														<button
															type="button"
															className={styles.cancelRenameBtn}
															onClick={handleCancelRename}
														>
															✗
														</button>
													</>
												) : (
													<>
														<button
															type="button"
															className={styles.renameBtn}
															onClick={() => handleStartRename(deck)}
														>
															✏️
														</button>
														<button
															type="button"
															className={styles.deleteBtn}
															onClick={() => handleDeleteDeck(deck.id)}
														>
															🗑️
														</button>
													</>
												)}
											</div>
										</div>
										<div className={styles.deckDetails}>
											<p className={styles.deckTopic}>Topic: {deck.name}</p>
											<p className={styles.deckLanguage}>
												Language: {deck.language.display}
											</p>
											<p className={styles.deckCards}>
												{deck.cards.length} cards
											</p>
										</div>
									</div>
									<div className={styles.deckPreview}>
										<div className={styles.previewCards}>
											{deck.cards.slice(0, 3).map((card) => (
												<div
													key={`${card}-${deck.id}`}
													className={styles.previewCard}
												>
													<div className={styles.cardWord}>{card}</div>
												</div>
											))}
											{deck.cards.length > 3 && (
												<div className={styles.moreCards}>
													+{deck.cards.length - 3} more
												</div>
											)}
										</div>
										<button
											type="button"
											className={styles.useDeckBtn}
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
					<ImportExportDialog
						onClose={() => setShowImportExport(false)}
						onImportSuccess={handleImportSuccess}
					/>
				)}
			</div>
		</div>
	);
}
