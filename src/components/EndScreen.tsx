import { getPlayerById, getTeamById } from "../data/teams";
import type { GameRound, Team } from "../types";

interface EndScreenProps {
	rounds: GameRound[];
	teams: Team[];
	onPlayAgain: () => void;
}

export function EndScreen({ rounds, teams, onPlayAgain }: EndScreenProps) {
	// Calculate team scores
	const teamScores = teams.map((team) => {
		const teamRounds = rounds.filter((round) => round.teamId === team.id);
		const totalCorrect = teamRounds.reduce(
			(sum, round) => sum + round.correctCards.length,
			0,
		);
		const totalPassed = teamRounds.reduce(
			(sum, round) => sum + round.passedCards.length,
			0,
		);

		return {
			team,
			totalCorrect,
			totalPassed,
			totalCards: totalCorrect + totalPassed,
		};
	});

	// Sort teams by score (correct cards)
	const sortedTeams = teamScores.sort(
		(a, b) => b.totalCorrect - a.totalCorrect,
	);

	// Calculate individual player stats
	const playerStats = rounds.map((round) => {
		const player = getPlayerById(round.playerId);
		const team = getTeamById(round.teamId);

		return {
			player,
			team,
			correct: round.correctCards.length,
			passed: round.passedCards.length,
			total: round.correctCards.length + round.passedCards.length,
		};
	});

	const totalCards = rounds.reduce(
		(sum, round) => sum + round.correctCards.length + round.passedCards.length,
		0,
	);

	return (
		<div className="app">
			<div className="container">
				<h1>🎭 Game Over!</h1>

				<div className="results-summary">
					<h2>Team Results</h2>
					<div className="team-results">
						{sortedTeams.map((teamScore, index) => (
							<div key={teamScore.team.id} className="team-result">
								<div
									className="team-header"
									style={{ color: teamScore.team.color }}
								>
									<h3>{teamScore.team.name}</h3>
									{index === 0 && (
										<span className="winner-badge">🏆 Winner!</span>
									)}
								</div>
								<div className="team-stats">
									<div className="stat-item">
										<span className="stat-label">Correct:</span>
										<span className="stat-value correct">
											{teamScore.totalCorrect}
										</span>
									</div>
									<div className="stat-item">
										<span className="stat-label">Passed:</span>
										<span className="stat-value passed">
											{teamScore.totalPassed}
										</span>
									</div>
									<div className="stat-item">
										<span className="stat-label">Total:</span>
										<span className="stat-value">{teamScore.totalCards}</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="player-results">
					<h2>Player Performance</h2>
					<div className="player-list">
						{playerStats.map((stat, index) => (
							<div key={stat.player?.id || index} className="player-result">
								<div className="player-info">
									<span className="player-name">{stat.player?.name}</span>
									<span
										className="team-name"
										style={{ color: stat.team?.color }}
									>
										{stat.team?.name}
									</span>
								</div>
								<div className="player-stats">
									<span className="stat correct">{stat.correct} correct</span>
									<span className="stat passed">{stat.passed} passed</span>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="game-summary">
					<p>Total Cards Played: {totalCards}</p>
					<p>Total Rounds: {rounds.length}</p>
				</div>

				<button type="button" className="start-button" onClick={onPlayAgain}>
					Play Again
				</button>
			</div>
		</div>
	);
}
