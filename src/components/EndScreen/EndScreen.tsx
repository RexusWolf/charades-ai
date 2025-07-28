import { getPlayerById, getTeamById } from "../../data/teams";
import type { Team, Turn } from "../../Game";
import type { Round } from "../../Round";
import styles from "./EndScreen.module.css";

interface EndScreenProps {
	rounds: Round[];
	teams: Team[];
	onPlayAgain: () => void;
}

export function EndScreen({ rounds, teams, onPlayAgain }: EndScreenProps) {
	// Flatten all turns from all rounds
	const allTurns: Turn[] = rounds.flatMap((round) => round.getTurns());
	const initialTurnCards = rounds[0]?.getRemainingCardsCount() ?? 0;

	// Calculate team scores
	const teamScores = teams.map((team) => {
		const teamTurns = allTurns.filter((turn) => turn.teamId === team.id);
		const totalCorrect = teamTurns.reduce(
			(sum, turn) => sum + turn.correctCards.length,
			0,
		);
		const totalSkipped = teamTurns.reduce(
			(sum, turn) =>
				sum +
				(initialTurnCards -
					turn.correctCards.length -
					turn.skippedCards.length),
			0,
		);

		return {
			team,
			totalCorrect,
			totalSkipped,
		};
	});

	// Sort teams by score (correct cards)
	const sortedTeams = teamScores.sort(
		(a, b) => b.totalCorrect - a.totalCorrect,
	);

	// Calculate individual player stats
	const playerStats = allTurns.map((turn) => {
		const player = getPlayerById(turn.playerId);
		const team = getTeamById(turn.teamId);
		const skipped =
			initialTurnCards - turn.correctCards.length - turn.skippedCards.length;

		return {
			player,
			team,
			correct: turn.correctCards.length,
			skipped,
		};
	});

	const totalCards = allTurns.reduce(
		(sum, turn) => sum + turn.correctCards.length,
		0,
	);

	return (
		<>
			<h1 className={styles.title}>🎭 Game Over!</h1>

			<div className={styles.resultsSummary}>
				<h2>Team Results</h2>
				<div className={styles.teamResults}>
					{sortedTeams.map((teamScore, index) => (
						<div key={teamScore.team.id} className={styles.teamResult}>
							<div
								className={styles.teamHeader}
								style={{ color: teamScore.team.color }}
							>
								<h3>{teamScore.team.name}</h3>
								{index === 0 && (
									<span className={styles.winnerBadge}>🏆 Winner!</span>
								)}
							</div>
							<div className={styles.teamStats}>
								<div className={styles.statItem}>
									<span className={styles.statLabel}>Correct:</span>
									<span className={`${styles.statValue} ${styles.correct}`}>
										{teamScore.totalCorrect}
									</span>
								</div>
								<div className={styles.statItem}>
									<span className={styles.statLabel}>Skipped:</span>
									<span className={`${styles.statValue} ${styles.skipped}`}>
										{teamScore.totalSkipped}
									</span>
								</div>
								<div className={styles.statItem}>
									<span className={styles.statLabel}>Total:</span>
									<span className={styles.statValue}>
										{teamScore.totalCorrect}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className={styles.playerResults}>
				<h2>Player Performance</h2>
				<div className={styles.playerList}>
					{playerStats.map((stat, index) => (
						<div key={stat.player?.id || index} className={styles.playerResult}>
							<div className={styles.playerInfo}>
								<span className={styles.playerName}>{stat.player?.name}</span>
								<span
									className={styles.teamName}
									style={{ color: stat.team?.color }}
								>
									{stat.team?.name}
								</span>
							</div>
							<div className={styles.playerStats}>
								<span className={`${styles.stat} ${styles.correct}`}>
									{stat.correct} correct
								</span>
								<span className={`${styles.stat} ${styles.skipped}`}>
									{stat.skipped} skipped
								</span>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className={styles.gameSummary}>
				<p>Total Cards Played: {totalCards}</p>
				<p>Total Rounds: {rounds.length}</p>
			</div>

			<button
				type="button"
				className={styles.startButton}
				onClick={onPlayAgain}
			>
				Play Again
			</button>
		</>
	);
}
