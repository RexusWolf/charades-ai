import styles from "./GameHeader.module.css";

interface GameHeaderProps {
	timeLeft: number;
	cardsLeftToGuess: number;
	totalCards: number;
	maxTime?: number;
}

export function GameHeader({
	timeLeft,
	cardsLeftToGuess,
	totalCards,
	maxTime = 60,
}: GameHeaderProps) {
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	// Calculate progress percentage for the circle
	const progressPercentage = ((maxTime - timeLeft) / maxTime) * 100;
	const radius = 50;
	const circumference = 2 * Math.PI * radius;
	const strokeDasharray = circumference;
	const strokeDashoffset =
		circumference - (progressPercentage / 100) * circumference;

	return (
		<div className={styles.gameHeader}>
			<div className={styles.timer}>
				<div className={styles.circularTimer}>
					<svg className={styles.timerSvg} width="120" height="120">
						<title>Timer</title>
						<circle
							className={styles.timerBackground}
							cx="60"
							cy="60"
							r={radius}
							strokeWidth="6"
						/>
						<circle
							className={`${styles.timerProgress} ${timeLeft <= 10 ? styles.urgent : ""}`}
							cx="60"
							cy="60"
							r={radius}
							strokeWidth="6"
							strokeDasharray={strokeDasharray}
							strokeDashoffset={strokeDashoffset}
							transform="rotate(-90 60 60)"
						/>
					</svg>
					<div className={styles.timerText}>
						<span className={styles.timerLabel}>Time</span>
						<span
							className={`${styles.timerValue} ${timeLeft <= 10 ? styles.urgent : ""}`}
						>
							{formatTime(timeLeft)}
						</span>
					</div>
				</div>
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
