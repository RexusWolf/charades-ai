import styles from "./GameHeader.module.css";

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
		<div className={styles.gameHeader}>
			<div className={styles.timer}>
				<span className={styles.timerLabel}>Time:</span>
				<span
					className={`${styles.timerValue} ${timeLeft <= 10 ? styles.urgent : ""}`}
				>
					{formatTime(timeLeft)}
				</span>
			</div>
			<div className={styles.progress}>
				<span className={styles.progressLabel}>Cards Left:</span>
				<span className={styles.progressValue}>
					{cardsLeftToGuess} / {totalCards}
				</span>
			</div>
		</div>
	);
}
