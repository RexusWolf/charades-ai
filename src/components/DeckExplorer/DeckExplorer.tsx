import { useCallback, useState } from "react";
import type { SwipeEventData } from "react-swipeable";
import type { GameDeckManagerState } from "../../services/GameDeckManager";
import { CardComponent } from "../Card/CardComponent";
import type { GameCard } from "../Card/GameCard";
import { DeckSelector } from "../DeckSelector/DeckSelector";
import styles from "./DeckExplorer.module.css";

interface DeckExplorerProps {
	cards: GameCard[];
	currentDeckState: GameDeckManagerState;
	onDeckStateChange: (newState: GameDeckManagerState) => void;
	onClose: () => void;
}

export function DeckExplorer({
	cards,
	currentDeckState,
	onDeckStateChange,
	onClose,
}: DeckExplorerProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isSwiping, setIsSwiping] = useState(false);
	const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
		null,
	);
	const [showDeckSelector, setShowDeckSelector] = useState(false);

	const currentCard = cards[currentIndex];
	const totalCards = cards.length;

	const handlePrevious = useCallback(() => {
		setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalCards - 1));
	}, [totalCards]);

	const handleNext = useCallback(() => {
		setCurrentIndex((prev) => (prev < totalCards - 1 ? prev + 1 : 0));
	}, [totalCards]);

	const handleSkip = useCallback(() => {
		handleNext();
	}, [handleNext]);

	const handleCorrect = useCallback(() => {
		handleNext();
	}, [handleNext]);

	const handleSwiping = useCallback((eventData: SwipeEventData) => {
		setIsSwiping(true);
		if (eventData.deltaX < -50) {
			setSwipeDirection("left");
		} else if (eventData.deltaX > 50) {
			setSwipeDirection("right");
		} else {
			setSwipeDirection(null);
		}
	}, []);

	const handleSwiped = useCallback(() => {
		setIsSwiping(false);
		setSwipeDirection(null);
	}, []);

	const handleDeckSelectorClose = useCallback(() => {
		setShowDeckSelector(false);
	}, []);

	const handleDeckStateChange = useCallback(
		(newDeckState: GameDeckManagerState) => {
			onDeckStateChange(newDeckState);
			setCurrentIndex(0); // Reset to first card when deck changes
		},
		[onDeckStateChange],
	);

	if (showDeckSelector) {
		return (
			<DeckSelector
				currentDeckState={currentDeckState}
				onDeckStateChange={handleDeckStateChange}
				onClose={handleDeckSelectorClose}
			/>
		);
	}

	if (cards.length === 0) {
		return (
			<div className={styles.overlay}>
				<div className={styles.modal}>
					<div className={styles.header}>
						<h2>🎴 Deck Explorer</h2>
						<button
							type="button"
							className={styles.closeButton}
							onClick={onClose}
						>
							×
						</button>
					</div>
					<div className={styles.content}>
						<div className={styles.emptyState}>
							<p>No cards available to explore.</p>
							<p>Please select some decks first.</p>
							<button
								type="button"
								className={styles.selectDecksButton}
								onClick={() => setShowDeckSelector(true)}
							>
								Select Decks
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.overlay}>
			<div className={styles.modal}>
				<div className={styles.header}>
					<h2>🎴 Deck Explorer</h2>
					<div className={styles.cardCounter}>
						{currentIndex + 1} of {totalCards}
					</div>
					<button
						type="button"
						className={styles.closeButton}
						onClick={onClose}
					>
						×
					</button>
				</div>

				<div className={styles.content}>
					<div className={styles.cardContainer}>
						{currentCard && (
							<CardComponent
								card={currentCard}
								onSkip={handleSkip}
								onCorrect={handleCorrect}
								isSwiping={isSwiping}
								swipeDirection={swipeDirection}
								onSwiping={handleSwiping}
								onSwiped={handleSwiped}
								showActionButtons={false}
							/>
						)}
					</div>

					<div className={styles.navigation}>
						<button
							type="button"
							className={styles.navButton}
							onClick={handlePrevious}
							disabled={totalCards <= 1}
						>
							← Previous
						</button>
						<div className={styles.progressBar}>
							<div
								className={styles.progressFill}
								style={{
									width: `${((currentIndex + 1) / totalCards) * 100}%`,
								}}
							/>
						</div>
						<button
							type="button"
							className={styles.navButton}
							onClick={handleNext}
							disabled={totalCards <= 1}
						>
							Next →
						</button>
					</div>

					<div className={styles.actions}>
						<button
							type="button"
							className={styles.selectDecksButton}
							onClick={() => setShowDeckSelector(true)}
						>
							📚 Change Decks
						</button>
					</div>

					<div className={styles.instructions}>
						<p>💡 Swipe left/right or use buttons to navigate</p>
						<p>🎯 This is just for exploration - no scoring!</p>
					</div>
				</div>
			</div>
		</div>
	);
}
