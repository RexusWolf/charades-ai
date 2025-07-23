import { useState } from "react";
import { type SwipeEventData, useSwipeable } from "react-swipeable";
import type { Card as CardType } from "../types";
import styles from "./Card.module.css";

interface CardProps {
	card: CardType;
	onSkip: () => void;
	onCorrect: () => void;
	isSwiping: boolean;
	swipeDirection: "left" | "right" | null;
	onSwiping: (eventData: SwipeEventData) => void;
	onSwiped: () => void;
}

const SWIPE_TRIGGER_THRESHOLD = 150;

export function Card({
	card,
	onSkip,
	onCorrect,
	isSwiping,
	swipeDirection,
	onSwiping,
	onSwiped,
}: CardProps) {
	const [swipeX, setSwipeX] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	const handlers = useSwipeable({
		delta: 0, // start swiping immediately
		onSwiping: (eventData) => {
			setSwipeX(eventData.deltaX);
			onSwiping(eventData);
		},
		onSwiped: (eventData) => {
			setIsAnimating(true);
			if (
				eventData.dir === "Left" &&
				Math.abs(eventData.deltaX) > SWIPE_TRIGGER_THRESHOLD
			) {
				onSkip();
				setSwipeX(-window.innerWidth); // animate out
			} else if (
				eventData.dir === "Right" &&
				Math.abs(eventData.deltaX) > SWIPE_TRIGGER_THRESHOLD
			) {
				onCorrect();
				setSwipeX(window.innerWidth); // animate out
			} else {
				setSwipeX(0); // snap back
				onSwiped();
			}
			setTimeout(() => {
				setSwipeX(0);
				setIsAnimating(false);
			}, 300);
		},
		trackMouse: true,
	});

	const getCardClassName = () => {
		if (!isSwiping) return styles.card;
		if (swipeDirection === "left")
			return `${styles.card} ${styles.cardSwipingLeft}`;
		if (swipeDirection === "right")
			return `${styles.card} ${styles.cardSwipingRight}`;
		return styles.card;
	};

	return (
		<div className={styles.cardContainer} {...handlers}>
			<div
				className={getCardClassName()}
				style={{
					transform: `translateX(${swipeX}px) rotate(${swipeX / 15}deg)`,
					transition: isAnimating
						? "transform 0.3s cubic-bezier(.23,1.12,.67,1.01)"
						: "none",
				}}
			>
				<div className={styles.cardCategory}>{card.category}</div>
				<div className={styles.cardWord}>{card.word}</div>
				<div className={styles.cardInstructions}>
					<div className={`${styles.swipeHint} ${styles.swipeHintLeft}`}>
						← SKIP
					</div>
					<div className={`${styles.swipeHint} ${styles.swipeHintRight}`}>
						CORRECT →
					</div>
				</div>
				{isSwiping && (
					<div className={styles.swipeOverlay}>
						{swipeDirection === "left" && (
							<span className={`${styles.swipeText} ${styles.swipeTextSkip}`}>
								SKIP
							</span>
						)}
						{swipeDirection === "right" && (
							<span
								className={`${styles.swipeText} ${styles.swipeTextCorrect}`}
							>
								CORRECT
							</span>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
