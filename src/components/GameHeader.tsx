interface GameHeaderProps {
	timeLeft: number;
	cardsLeftToGuess: number;
	totalCards: number;
}

export function GameHeader({
	timeLeft,
	cardsLeftToGuess,
	totalCards,
}: GameHeaderProps) {
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<div className="game-header">
			<div className="timer">
				<span className="timer-label">Time:</span>
				<span className={`timer-value ${timeLeft <= 10 ? "urgent" : ""}`}>
					{formatTime(timeLeft)}
				</span>
			</div>
			<div className="progress">
				<span className="progress-label">Cards Left:</span>
				<span className="progress-value">
					{cardsLeftToGuess} / {totalCards}
				</span>
			</div>
		</div>
	);
}
