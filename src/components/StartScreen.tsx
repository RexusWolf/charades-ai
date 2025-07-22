interface StartScreenProps {
	onStartGame: () => void;
}

export function StartScreen({ onStartGame }: StartScreenProps) {
	return (
		<div className="app">
			<div className="container">
				<h1>🎭 Charades</h1>
				<p className="instructions">
					Swipe left to PASS • Swipe right for CORRECT
				</p>
				<button type="button" className="start-button" onClick={onStartGame}>
					Start Round
				</button>
			</div>
		</div>
	);
}
