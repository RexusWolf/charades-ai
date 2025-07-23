import { useState } from "react";
import { type SwipeEventData, useSwipeable } from "react-swipeable";
import type { Card as CardType } from "../types";

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
		if (!isSwiping) return "card";
		if (swipeDirection === "left") return "card swiping-left";
		if (swipeDirection === "right") return "card swiping-right";
		return "card";
	};

	return (
		<div className="card-container" {...handlers}>
			<div
				className={getCardClassName()}
				style={{
					transform: `translateX(${swipeX}px) rotate(${swipeX / 15}deg)`,
					transition: isAnimating
						? "transform 0.3s cubic-bezier(.23,1.12,.67,1.01)"
						: "none",
				}}
			>
				<div className="card-category">{card.category}</div>
				<div className="card-word">{card.word}</div>
				<div className="card-instructions">
					<div className="swipe-hint left">← SKIP</div>
					<div className="swipe-hint right">CORRECT →</div>
				</div>
				{isSwiping && (
					<div className={`swipe-overlay ${swipeDirection}`}>
						{swipeDirection === "left" && (
							<span className="swipe-text skip">SKIP</span>
						)}
						{swipeDirection === "right" && (
							<span className="swipe-text correct">CORRECT</span>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
