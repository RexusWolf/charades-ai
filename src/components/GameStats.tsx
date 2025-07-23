interface GameStatsProps {
	correctCount: number;
	skippedCount: number;
}

export function GameStats({ correctCount, skippedCount }: GameStatsProps) {
	return (
		<div className="game-stats">
			<div className="stat">
				<span className="stat-label">Correct:</span>
				<span className="stat-value correct">{correctCount}</span>
			</div>
			<div className="stat">
				<span className="stat-label">Skipped:</span>
				<span className="stat-value skipped">{skippedCount}</span>
			</div>
		</div>
	);
}
