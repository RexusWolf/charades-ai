import { getTeamById } from "../data/teams";
import type { Player } from "../types";

interface PlayerTurnProps {
	currentPlayer: Player;
	roundNumber: number;
	totalRounds: number;
	turnState: "preparing" | "playing";
	onStartTurn: () => void;
}

export function PlayerTurn({
	currentPlayer,
	roundNumber,
	totalRounds,
	turnState,
}: PlayerTurnProps) {
	const currentTeam = getTeamById(currentPlayer.teamId);

	return (
		<div className="player-turn">
			<div className="turn-info">
				<div className="current-player">
					<span className="player-label">Current Player:</span>
					<span className="player-name" style={{ color: currentTeam?.color }}>
						{currentPlayer.name}
					</span>
				</div>
				<div className="current-team">
					<span className="team-label">Team:</span>
					<span className="team-name" style={{ color: currentTeam?.color }}>
						{currentTeam?.name}
					</span>
				</div>
			</div>
			<div className="round-progress">
				<span className="round-label">Round:</span>
				<span className="round-number">
					{roundNumber} / {totalRounds}
				</span>
				{turnState === "preparing" && (
					<span className="turn-status preparing">Preparing...</span>
				)}
				{turnState === "playing" && (
					<span className="turn-status playing">Playing!</span>
				)}
			</div>
		</div>
	);
}
