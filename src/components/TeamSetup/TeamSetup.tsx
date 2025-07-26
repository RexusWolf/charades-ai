import { useState } from "react";
import { SAMPLE_TEAMS } from "../../data/teams";
import type { Team } from "../../Game";
import { useTeamManager } from "../../shared/hooks/useTeamManager";
import styles from "./TeamSetup.module.css";

interface TeamSetupProps {
	onStartGame: (teams: Team[]) => void;
}

export function TeamSetup({ onStartGame }: TeamSetupProps) {
	const {
		teams,
		addTeam,
		removeTeam,
		addPlayer,
		removePlayer,
		balanceTeams,
		totalPlayers,
	} = useTeamManager(SAMPLE_TEAMS);

	const [newTeamName, setNewTeamName] = useState("");
	const [newPlayerName, setNewPlayerName] = useState("");
	const [selectedTeamId, setSelectedTeamId] = useState<string>("");
	const [showAddTeam, setShowAddTeam] = useState(false);
	const [showAddPlayer, setShowAddPlayer] = useState(false);

	const handleAddTeam = () => {
		if (newTeamName.trim()) {
			addTeam(newTeamName.trim());
			setNewTeamName("");
			setShowAddTeam(false);
		}
	};

	const handleAddPlayer = () => {
		if (newPlayerName.trim() && selectedTeamId) {
			addPlayer(selectedTeamId, newPlayerName.trim());
			setNewPlayerName("");
			setShowAddPlayer(false);
		}
	};

	const handleStartGame = () => {
		const teamsWithPlayers = teams.filter((team) => team.players.length > 0);
		if (teamsWithPlayers.length > 0) {
			onStartGame(teamsWithPlayers);
		}
	};

	const teamsWithPlayers = teams.filter((team) => team.players.length > 0);

	return (
		<>
			<h1 className={styles.title}>🎭 Team Setup</h1>
			<p className={styles.instructions}>
				Create teams and add players to get started
			</p>

			{/* Add Team Section */}
			<div className={styles.setupSection}>
				<div className={styles.sectionHeader}>
					<h2>Create Teams</h2>
					<button
						type="button"
						className={styles.addButton}
						onClick={() => setShowAddTeam(!showAddTeam)}
					>
						{showAddTeam ? "Cancel" : "+ Add Team"}
					</button>
				</div>

				{showAddTeam && (
					<div className={styles.addForm}>
						<input
							type="text"
							placeholder="Enter team name..."
							value={newTeamName}
							onChange={(e) => setNewTeamName(e.target.value)}
							className={styles.inputField}
						/>
						<button
							type="button"
							className={styles.saveButton}
							onClick={handleAddTeam}
							disabled={!newTeamName.trim()}
						>
							Add Team
						</button>
					</div>
				)}
			</div>

			{/* Teams Display */}
			<div className={styles.teamsGrid}>
				{teams.map((team) => (
					<div
						key={team.id}
						className={styles.teamCard}
						style={{ borderColor: team.color }}
					>
						<div className={styles.teamHeader}>
							<h3 style={{ color: team.color }}>{team.name}</h3>
							<div className={styles.teamActions}>
								<button
									type="button"
									className={styles.addPlayerBtn}
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
										className={styles.removeTeamBtn}
										onClick={() => removeTeam(team.id)}
									>
										×
									</button>
								)}
							</div>
						</div>

						<div className={styles.teamPlayers}>
							{team.players.length === 0 ? (
								<p className={styles.noPlayers}>No players yet</p>
							) : (
								team.players.map((player) => (
									<div key={player.id} className={styles.playerItem}>
										<span>{player.name}</span>
										<button
											type="button"
											className={styles.removePlayerBtn}
											onClick={() => removePlayer(team.id, player.id)}
										>
											×
										</button>
									</div>
								))
							)}
						</div>

						<div className={styles.teamStatus}>
							{team.players.length} player
							{team.players.length !== 1 ? "s" : ""}
						</div>
					</div>
				))}
			</div>

			{/* Add Player Modal */}
			{showAddPlayer && (
				<div className={styles.modalOverlay}>
					<div className={styles.modal}>
						<h3>
							Add Player to {teams.find((t) => t.id === selectedTeamId)?.name}
						</h3>
						<input
							type="text"
							placeholder="Enter player name..."
							value={newPlayerName}
							onChange={(e) => setNewPlayerName(e.target.value)}
							className={styles.inputField}
						/>
						<div className={styles.modalActions}>
							<button
								type="button"
								className={styles.cancelButton}
								onClick={() => {
									setShowAddPlayer(false);
									setNewPlayerName("");
								}}
							>
								Cancel
							</button>
							<button
								type="button"
								className={styles.saveButton}
								onClick={handleAddPlayer}
								disabled={!newPlayerName.trim()}
							>
								Add Player
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Actions */}
			<div className={styles.setupActions}>
				{teams.length > 1 && totalPlayers > 0 && (
					<button
						type="button"
						className={styles.balanceButton}
						onClick={balanceTeams}
					>
						⚖️ Balance Teams
					</button>
				)}
			</div>

			{/* Summary */}
			<div className={styles.setupSummary}>
				<p>Teams: {teamsWithPlayers.length}</p>
				<p>Total Players: {totalPlayers}</p>
				{teams.length > 0 && (
					<p>Average per team: {(totalPlayers / teams.length).toFixed(1)}</p>
				)}
			</div>

			<button
				type="button"
				className={styles.startButton}
				onClick={handleStartGame}
				disabled={teamsWithPlayers.length === 0}
			>
				Start Game ({totalPlayers} players)
			</button>
		</>
	);
}
