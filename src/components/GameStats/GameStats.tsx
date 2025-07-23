import styles from "./GameStats.module.css";

interface GameStatsProps {
	correctCount: number;
	skippedCount: number;
}

export function GameStats({ correctCount, skippedCount }: GameStatsProps) {
	return (
		<div className={styles.gameStats}>
			<div className={styles.stat}>
				<span className={styles.statLabel}>Correct:</span>
				<span className={`${styles.statValue} ${styles.correct}`}>
					{correctCount}
				</span>
			</div>
			<div className={styles.stat}>
				<span className={styles.statLabel}>Skipped:</span>
				<span className={`${styles.statValue} ${styles.skipped}`}>
					{skippedCount}
				</span>
			</div>
		</div>
	);
}
