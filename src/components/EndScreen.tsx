import type { Card } from "../types";

interface EndScreenProps {
	passedCards: Card[];
	correctCards: Card[];
	onPlayAgain: () => void;
}

export function EndScreen({
	passedCards,
	correctCards,
	onPlayAgain,
}: EndScreenProps) {
	return (
		<div className="app">
			<div className="container">
				<h1>🎭 Game Over!</h1>
				<div className="results">
					<div className="result-item">
						<span className="result-label">Correct:</span>
						<span className="result-value correct">{correctCards.length}</span>
					</div>
					<div className="result-item">
						<span className="result-label">Passed:</span>
						<span className="result-value passed">{passedCards.length}</span>
					</div>
					<div className="result-item">
						<span className="result-label">Total:</span>
						<span className="result-value">
							{correctCards.length + passedCards.length}
						</span>
					</div>
				</div>
				<button type="button" className="start-button" onClick={onPlayAgain}>
					Play Again
				</button>
			</div>
		</div>
	);
}
