import styles from "./StartScreen.module.css";

interface StartScreenProps {
	onStartGame: () => void;
}

export function StartScreen({ onStartGame }: StartScreenProps) {
	return (
		<div>
			<h1 className={styles.title}>🎭 Charades</h1>
			<p className={styles.instructions}>
				Swipe left to SKIP • Swipe right for CORRECT
			</p>
			<button
				type="button"
				className={styles.startButton}
				onClick={onStartGame}
			>
				Start Round
			</button>
		</div>
	);
}
