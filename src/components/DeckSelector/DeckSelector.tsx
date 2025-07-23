import { useEffect, useState } from "react";
import { DeckManager } from "../../services/deckManager";
import type { Card } from "../Card/Card";
import styles from "./DeckSelector.module.css";

interface DeckSelectorProps {
	onDeckSelectionChange: (cards: Card[]) => void;
	onClose: () => void;
}

export function DeckSelector({
	onDeckSelectionChange,
	onClose,
}: DeckSelectorProps) {
	const [deckManager] = useState(() => new DeckManager());
	const [state, setState] = useState(deckManager.getState());

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

	const handleSelectSampleOnly = () => {
		deckManager.selectSampleDeckOnly();
		setState(deckManager.getState());
		onDeckSelectionChange(deckManager.getMixedCards());
	};

	const handleRefresh = () => {
		deckManager.refreshAvailableDecks();
		setState(deckManager.getState());
		onDeckSelectionChange(deckManager.getMixedCards());
	};

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
							onClick={handleSelectSampleOnly}
						>
							Sample Only
						</button>
						<button
							type="button"
							className={styles.actionButton}
							onClick={handleRefresh}
						>
							Refresh
						</button>
					</div>

					<div className={styles.deckList}>
						{state.availableDecks.map((deck) => (
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
						))}
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
