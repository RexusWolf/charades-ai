import { useEffect, useState } from "react";
import { DeckManager } from "../../services/deckManager";
import type { Card } from "../Card/Card";
import styles from "./DeckSelector.module.css";

interface DeckSelectorProps {
	onDeckSelectionChange: (cards: Card[]) => void;
	onClose: () => void;
}

type TabType = "official" | "custom";

export function DeckSelector({
	onDeckSelectionChange,
	onClose,
}: DeckSelectorProps) {
	const [deckManager] = useState(() => new DeckManager());
	const [state, setState] = useState(deckManager.getState());
	const [activeTab, setActiveTab] = useState<TabType>("official");

	useEffect(() => {
		// Notify parent of current mixed cards
		onDeckSelectionChange(deckManager.getMixedCards());
	}, [deckManager, onDeckSelectionChange]);

	const handleToggleDeck = (deckId: string) => {
		deckManager.toggleDeckSelection(deckId);
		setState(deckManager.getState());
		onDeckSelectionChange(deckManager.getMixedCards());
	};

	const handleSelectAll = () => {
		deckManager.selectAllDecks();
		setState(deckManager.getState());
		onDeckSelectionChange(deckManager.getMixedCards());
	};

	const handleDeselectAll = () => {
		deckManager.deselectAllDecks();
		setState(deckManager.getState());
		onDeckSelectionChange(deckManager.getMixedCards());
	};

	const handleSelectDefaultOnly = () => {
		deckManager.selectDefaultDeckOnly();
		setState(deckManager.getState());
		onDeckSelectionChange(deckManager.getMixedCards());
	};

	const handleRefresh = () => {
		deckManager.refreshAvailableDecks();
		setState(deckManager.getState());
		onDeckSelectionChange(deckManager.getMixedCards());
	};

	const officialDecks = deckManager.getOfficialDecks();
	const customDecks = deckManager.getCustomDecks();

	return (
		<div className={styles.overlay}>
			<div className={styles.modal}>
				<div className={styles.header}>
					<h2>🎴 Select Decks</h2>
					<button
						type="button"
						className={styles.closeButton}
						onClick={onClose}
					>
						×
					</button>
				</div>

				<div className={styles.content}>
					<div className={styles.summary}>
						<p>
							<strong>{state.selectedDecks.length}</strong> deck(s) selected
						</p>
						<p>
							<strong>{state.mixedCards.length}</strong> total cards available
						</p>
					</div>

					<div className={styles.actions}>
						<button
							type="button"
							className={styles.actionButton}
							onClick={handleSelectAll}
						>
							Select All
						</button>
						<button
							type="button"
							className={styles.actionButton}
							onClick={handleDeselectAll}
						>
							Deselect All
						</button>
						<button
							type="button"
							className={styles.actionButton}
							onClick={handleSelectDefaultOnly}
						>
							Default Only
						</button>
						<button
							type="button"
							className={styles.actionButton}
							onClick={handleRefresh}
						>
							Refresh
						</button>
					</div>

					<div className={styles.tabs}>
						<button
							type="button"
							className={`${styles.tab} ${
								activeTab === "official" ? styles.activeTab : ""
							}`}
							onClick={() => setActiveTab("official")}
						>
							📚 Official Decks ({officialDecks.length})
						</button>
						<button
							type="button"
							className={`${styles.tab} ${
								activeTab === "custom" ? styles.activeTab : ""
							}`}
							onClick={() => setActiveTab("custom")}
						>
							💾 Custom Decks ({customDecks.length})
						</button>
					</div>

					<div className={styles.deckList}>
						{activeTab === "official" ? (
							officialDecks.length > 0 ? (
								officialDecks.map((deck) => (
									<button
										key={deck.deckId}
										type="button"
										className={`${styles.deckItem} ${
											deck.isSelected ? styles.selected : ""
										}`}
										onClick={() => handleToggleDeck(deck.deckId)}
									>
										<div className={styles.deckInfo}>
											<h3>{deck.name}</h3>
											<p>{deck.cardCount} cards</p>
										</div>
										<div className={styles.checkbox}>
											{deck.isSelected && <span>✓</span>}
										</div>
									</button>
								))
							) : (
								<div className={styles.emptyState}>
									<p>No official decks available</p>
								</div>
							)
						) : customDecks.length > 0 ? (
							customDecks.map((deck) => (
								<button
									key={deck.deckId}
									type="button"
									className={`${styles.deckItem} ${
										deck.isSelected ? styles.selected : ""
									}`}
									onClick={() => handleToggleDeck(deck.deckId)}
								>
									<div className={styles.deckInfo}>
										<h3>{deck.name}</h3>
										<p>{deck.cardCount} cards</p>
									</div>
									<div className={styles.checkbox}>
										{deck.isSelected && <span>✓</span>}
									</div>
								</button>
							))
						) : (
							<div className={styles.emptyState}>
								<p>No custom decks available</p>
								<p className={styles.emptyStateHint}>
									Create custom decks in the Custom Deck Creator
								</p>
							</div>
						)}
					</div>

					{state.selectedDecks.length > 0 && (
						<div className={styles.selectedSummary}>
							<h3>Selected Decks:</h3>
							<ul>
								{state.selectedDecks.map((deck) => (
									<li key={deck.deckId}>
										{deck.name} ({deck.cardCount} cards)
									</li>
								))}
							</ul>
						</div>
					)}
				</div>

				<div className={styles.footer}>
					<button type="button" className={styles.doneButton} onClick={onClose}>
						Done
					</button>
				</div>
			</div>
		</div>
	);
}
