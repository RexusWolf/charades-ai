import type { Player, Team } from "../types";

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
	roundNumber,
	totalRounds,
	turnState,
	onStartTurn,
}: PlayerTurnProps) {
	// Get the team for the current player
	const currentTeam = teams?.find((team) => team.id === currentPlayer.teamId);

	return (
		<div className="player-turn">
			<div className="player-info">
				<span className="player-label">Current Player: </span>
				<span className="player-name" style={{ color: currentTeam?.color }}>
					{currentPlayer.name}
				</span>
			</div>
			<div className="team-info">
				<span className="team-label">Team: </span>
				<span className="team-name" style={{ color: currentTeam?.color }}>
					{currentTeam?.name}
				</span>
			</div>
			<div className="round-progress">
				{turnState === "preparing" && (
					<span className="turn-status preparing">Preparing...</span>
				)}
				{turnState === "playing" && (
					<span className="turn-status playing">Playing...</span>
				)}
			</div>
		</div>
	);
}
