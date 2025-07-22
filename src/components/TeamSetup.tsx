import { useState } from "react";
import { SAMPLE_TEAMS } from "../data/teams";
import type { Player, Team } from "../types";

interface TeamSetupProps {
	onStartGame: (teams: Team[]) => void;
}

const TEAM_COLORS = [
	"#ff6b6b",
	"#4ecdc4",
	"#51cf66",
	"#ffd93d",
	"#6c5ce7",
	"#fd79a8",
	"#00b894",
	"#fdcb6e",
	"#e17055",
	"#74b9ff",
];

export function TeamSetup({ onStartGame }: TeamSetupProps) {
	const [teams, setTeams] = useState<Team[]>(SAMPLE_TEAMS);
	const [newTeamName, setNewTeamName] = useState("");
	const [newPlayerName, setNewPlayerName] = useState("");
	const [selectedTeamId, setSelectedTeamId] = useState<string>("");
	const [showAddTeam, setShowAddTeam] = useState(false);
	const [showAddPlayer, setShowAddPlayer] = useState(false);

	const addTeam = () => {
		if (newTeamName.trim()) {
			const newTeam: Team = {
				id: `team-${Date.now()}`,
				name: newTeamName.trim(),
				color: TEAM_COLORS[teams.length % TEAM_COLORS.length],
				players: [],
			};
			setTeams([...teams, newTeam]);
			setNewTeamName("");
			setShowAddTeam(false);
		}
	};

	const removeTeam = (teamId: string) => {
		setTeams(teams.filter((team) => team.id !== teamId));
	};

	const addPlayer = () => {
		if (newPlayerName.trim() && selectedTeamId) {
			const newPlayer: Player = {
				id: `player-${Date.now()}`,
				name: newPlayerName.trim(),
				teamId: selectedTeamId,
			};

			setTeams(
				teams.map((team) =>
					team.id === selectedTeamId
						? { ...team, players: [...team.players, newPlayer] }
						: team,
				),
			);
			setNewPlayerName("");
			setShowAddPlayer(false);
		}
	};

	const removePlayer = (teamId: string, playerId: string) => {
		setTeams(
			teams.map((team) =>
				team.id === teamId
					? { ...team, players: team.players.filter((p) => p.id !== playerId) }
					: team,
			),
		);
	};

	const balanceTeams = () => {
		const allPlayers = teams.flatMap((team) => team.players);
		if (allPlayers.length === 0) return;

		// Clear all teams
		const balancedTeams: Team[] = teams.map((team) => ({
			...team,
			players: [],
		}));

		// Distribute players evenly
		allPlayers.forEach((player, index) => {
			const teamIndex = index % balancedTeams.length;
			const updatedPlayer: Player = {
				...player,
				teamId: balancedTeams[teamIndex].id,
			};
			balancedTeams[teamIndex].players.push(updatedPlayer);
		});

		setTeams(balancedTeams);
	};

	const handleStartGame = () => {
		const teamsWithPlayers = teams.filter((team) => team.players.length > 0);
		if (teamsWithPlayers.length > 0) {
			onStartGame(teamsWithPlayers);
		}
	};

	const totalPlayers = teams.reduce(
		(sum, team) => sum + team.players.length,
		0,
	);
	const teamsWithPlayers = teams.filter((team) => team.players.length > 0);

	return (
		<div className="app">
			<div className="container">
				<h1>🎭 Team Setup</h1>
				<p className="instructions">
					Create teams and add players to get started
				</p>

				{/* Add Team Section */}
				<div className="setup-section">
					<div className="section-header">
						<h2>Create Teams</h2>
						<button
							type="button"
							className="add-button"
							onClick={() => setShowAddTeam(!showAddTeam)}
						>
							{showAddTeam ? "Cancel" : "+ Add Team"}
						</button>
					</div>

					{showAddTeam && (
						<div className="add-form">
							<input
								type="text"
								placeholder="Enter team name..."
								value={newTeamName}
								onChange={(e) => setNewTeamName(e.target.value)}
								className="input-field"
							/>
							<button
								type="button"
								className="save-button"
								onClick={addTeam}
								disabled={!newTeamName.trim()}
							>
								Add Team
							</button>
						</div>
					)}
				</div>

				{/* Teams Display */}
				<div className="teams-grid">
					{teams.map((team) => (
						<div
							key={team.id}
							className="team-card"
							style={{ borderColor: team.color }}
						>
							<div className="team-header">
								<h3 style={{ color: team.color }}>{team.name}</h3>
								<div className="team-actions">
									<button
										type="button"
										className="add-player-btn"
										onClick={() => {
											setSelectedTeamId(team.id);
											setShowAddPlayer(true);
										}}
									>
										+ Add Player
									</button>
									{teams.length > 1 && (
										<button
											type="button"
											className="remove-team-btn"
											onClick={() => removeTeam(team.id)}
										>
											×
										</button>
									)}
								</div>
							</div>

							<div className="team-players">
								{team.players.length === 0 ? (
									<p className="no-players">No players yet</p>
								) : (
									team.players.map((player) => (
										<div key={player.id} className="player-item">
											<span>{player.name}</span>
											<button
												type="button"
												className="remove-player-btn"
												onClick={() => removePlayer(team.id, player.id)}
											>
												×
											</button>
										</div>
									))
								)}
							</div>

							<div className="team-status">
								{team.players.length} player
								{team.players.length !== 1 ? "s" : ""}
							</div>
						</div>
					))}
				</div>

				{/* Add Player Modal */}
				{showAddPlayer && (
					<div className="modal-overlay">
						<div className="modal">
							<h3>
								Add Player to {teams.find((t) => t.id === selectedTeamId)?.name}
							</h3>
							<input
								type="text"
								placeholder="Enter player name..."
								value={newPlayerName}
								onChange={(e) => setNewPlayerName(e.target.value)}
								className="input-field"
							/>
							<div className="modal-actions">
								<button
									type="button"
									className="cancel-button"
									onClick={() => {
										setShowAddPlayer(false);
										setNewPlayerName("");
									}}
								>
									Cancel
								</button>
								<button
									type="button"
									className="save-button"
									onClick={addPlayer}
									disabled={!newPlayerName.trim()}
								>
									Add Player
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Actions */}
				<div className="setup-actions">
					{teams.length > 1 && totalPlayers > 0 && (
						<button
							type="button"
							className="balance-button"
							onClick={balanceTeams}
						>
							⚖️ Balance Teams
						</button>
					)}
				</div>

				{/* Summary */}
				<div className="setup-summary">
					<p>Teams: {teamsWithPlayers.length}</p>
					<p>Total Players: {totalPlayers}</p>
					{teams.length > 0 && (
						<p>Average per team: {(totalPlayers / teams.length).toFixed(1)}</p>
					)}
				</div>

				<button
					type="button"
					className="start-button"
					onClick={handleStartGame}
					disabled={teamsWithPlayers.length === 0}
				>
					Start Game ({totalPlayers} players)
				</button>
			</div>
		</div>
	);
}
