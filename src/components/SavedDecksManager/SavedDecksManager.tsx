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
} from "../../data/savedDecks";
import type { Card } from "../Card/Card";
import styles from "./SavedDecksManager.module.css";

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
							{stats.mostUsed && (
								<div className={styles.statItem}>
									<span className={styles.statLabel}>Most Used:</span>
									<span className={styles.statValue}>
										{stats.mostUsed.name}
									</span>
								</div>
							)}
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
											<p className={styles.deckTopic}>Topic: {deck.topic}</p>
											<p className={styles.deckLanguage}>
												Language: {deck.language.display}
											</p>
											<p className={styles.deckCards}>
												{deck.cards.length} cards
											</p>
											<p className={styles.deckCreated}>
												Created: {formatDate(deck.createdAt)}
											</p>
											{deck.lastUsed && (
												<p className={styles.deckUsed}>
													Last used: {formatDate(deck.lastUsed)}
												</p>
											)}
											<p className={styles.deckUses}>
												Used {deck.useCount} time
												{deck.useCount !== 1 ? "s" : ""}
											</p>
										</div>
									</div>
									<div className={styles.deckPreview}>
										<div className={styles.previewCards}>
											{deck.cards.slice(0, 3).map((card) => (
												<div key={card.id} className={styles.previewCard}>
													<div className={styles.cardCategory}>
														{card.category}
													</div>
													<div className={styles.cardWord}>{card.word}</div>
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
					<div className={styles.importExportDialogOverlay}>
						<div className={styles.importExportDialog}>
							<div className={styles.importExportDialogHeader}>
								<h3>📥📤 Import/Export Decks</h3>
								<button
									type="button"
									className={styles.closeButton}
									onClick={() => {
										setShowImportExport(false);
										setImportMessage("");
									}}
								>
									×
								</button>
							</div>
							<div className={styles.importExportDialogContent}>
								<div className={styles.exportSection}>
									<h4>📤 Export Decks</h4>
									<p>Download all your saved decks as a JSON file.</p>
									<button
										type="button"
										className={styles.exportBtn}
										onClick={handleExportDecks}
									>
										📥 Export All Decks
									</button>
								</div>

								<div className={styles.importSection}>
									<h4>📥 Import Decks</h4>
									<p>Import decks from a previously exported JSON file.</p>
									<input
										ref={fileInputRef}
										type="file"
										accept=".json"
										onChange={handleImportDecks}
										className={styles.fileInput}
									/>
									{importMessage && (
										<div
											className={`${styles.importMessage} ${importSuccess ? styles.success : styles.error}`}
										>
											{importMessage}
										</div>
									)}
								</div>

								<div className={styles.importExportTips}>
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
