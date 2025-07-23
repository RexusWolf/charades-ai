import type { Player, Team } from "../../Game";
import styles from "./PlayerTurn.module.css";

interface PlayerTurnProps {
	currentPlayer: Player;
	teams: Team[];
	roundNumber: number;
	totalRounds: number;
	turnState: "preparing" | "playing";
	onStartTurn: () => void;
}

export function PlayerTurn({
	currentPlayer,
	teams,
	turnState,
}: PlayerTurnProps) {
	// Get the team for the current player
	const currentTeam = teams?.find((team) => team.id === currentPlayer.teamId);

	return (
		<div className={styles.playerTurn}>
			<div className={styles.playerInfo}>
				<span className={styles.playerLabel}>Current Player: </span>
				<span
					className={styles.playerName}
					style={{ color: currentTeam?.color }}
				>
					{currentPlayer.name}
				</span>
				<span className={styles.teamLabel}>Team: </span>
				<span className={styles.teamName} style={{ color: currentTeam?.color }}>
					{currentTeam?.name}
				</span>
			</div>
			<div className={styles.roundProgress}>
				{turnState === "preparing" && (
					<span className={`${styles.turnStatus} ${styles.preparing}`}>
						Preparing...
					</span>
				)}
				{turnState === "playing" && (
					<span className={`${styles.turnStatus} ${styles.playing}`}>
						Playing...
					</span>
				)}
			</div>
		</div>
	);
}
