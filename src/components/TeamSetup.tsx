import { useState } from "react";
import { SAMPLE_TEAMS } from "../data/teams";
import type { Player, Team } from "../types";

interface TeamSetupProps {
	onStartGame: (teams: Team[]) => void;
}

export function TeamSetup({ onStartGame }: TeamSetupProps) {
	const [selectedTeams, setSelectedTeams] = useState<Team[]>(SAMPLE_TEAMS);

	const toggleTeam = (teamId: string) => {
		setSelectedTeams((prev) => {
			const isSelected = prev.some((team) => team.id === teamId);
			if (isSelected) {
				return prev.filter((team) => team.id !== teamId);
			} else {
				const team = SAMPLE_TEAMS.find((t) => t.id === teamId);
				return team ? [...prev, team] : prev;
			}
		});
	};

	const handleStartGame = () => {
		if (selectedTeams.length > 0) {
			onStartGame(selectedTeams);
		}
	};

	const totalPlayers = selectedTeams.reduce(
		(sum, team) => sum + team.players.length,
		0,
	);

	return (
		<div className="app">
			<div className="container">
				<h1>🎭 Team Setup</h1>
				<p className="instructions">Select teams to participate in the game</p>

				<div className="teams-grid">
					{SAMPLE_TEAMS.map((team) => {
						const isSelected = selectedTeams.some((t) => t.id === team.id);
						return (
							<button
								key={team.id}
								type="button"
								className={`team-card ${isSelected ? "selected" : ""}`}
								onClick={() => toggleTeam(team.id)}
								style={{ borderColor: team.color }}
							>
								<div className="team-header">
									<h3 style={{ color: team.color }}>{team.name}</h3>
									<div
										className="team-color"
										style={{ backgroundColor: team.color }}
									></div>
								</div>
								<div className="team-players">
									{team.players.map((player) => (
										<div key={player.id} className="player-item">
											{player.name}
										</div>
									))}
								</div>
								<div className="team-status">
									{isSelected ? "✓ Selected" : "Click to select"}
								</div>
							</button>
						);
					})}
				</div>

				<div className="setup-summary">
					<p>Selected Teams: {selectedTeams.length}</p>
					<p>Total Players: {totalPlayers}</p>
				</div>

				<button
					type="button"
					className="start-button"
					onClick={handleStartGame}
					disabled={selectedTeams.length === 0}
				>
					Start Game ({totalPlayers} players)
				</button>
			</div>
		</div>
	);
}
