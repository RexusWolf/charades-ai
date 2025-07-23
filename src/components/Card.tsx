import { useSwipeable } from "react-swipeable";
import type { Card as CardType } from "../types";

interface CardProps {
	card: CardType;
	onSkip: () => void;
	onCorrect: () => void;
	isSwiping: boolean;
	swipeDirection: "left" | "right" | null;
	onSwiping: (eventData: any) => void;
	onSwiped: () => void;
}

export function Card({
	card,
	onSkip,
	onCorrect,
	isSwiping,
	swipeDirection,
	onSwiping,
	onSwiped,
}: CardProps) {
	const handlers = useSwipeable({
		onSwipedLeft: onSkip,
		onSwipedRight: onCorrect,
		onSwiping,
		onSwiped,
		trackMouse: true,
		delta: 50,
	});

	const getCardClassName = () => {
		if (!isSwiping) return "card";
		if (swipeDirection === "left") return "card swiping-left";
		if (swipeDirection === "right") return "card swiping-right";
		return "card";
	};

	return (
		<div className="card-container" {...handlers}>
			<div className={getCardClassName()}>
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
