import styles from "./NoCards.module.css";

export function NoCards() {
	return (
		<div className={styles.noCards}>
			<h2>No more cards!</h2>
			<p>Great job! You've gone through all the cards.</p>
		</div>
	);
}
