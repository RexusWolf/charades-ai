interface GameStatsProps {
	correctCount: number;
	passedCount: number;
}

export function GameStats({ correctCount, passedCount }: GameStatsProps) {
	return (
		<div className="game-stats">
			<div className="stat">
				<span className="stat-label">Correct:</span>
				<span className="stat-value correct">{correctCount}</span>
			</div>
			<div className="stat">
				<span className="stat-label">Passed:</span>
				<span className="stat-value passed">{passedCount}</span>
			</div>
		</div>
	);
}
