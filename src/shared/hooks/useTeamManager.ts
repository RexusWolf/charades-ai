import { useCallback, useState } from 'react';
import type { Player, Team } from '../../Game';

const TEAM_COLORS = [
    '#ff6b6b', '#0527e2', '#51cf66', '#ffd93d', '#6c5ce7',
    '#fd79a8', '#00b894', '#fdcb6e', '#e17055', '#74b9ff',
];

interface UseTeamManagerProps {
    initialTeams?: Team[];
}

export function useTeamManager(initialTeams: Team[] = []) {
    const [teams, setTeams] = useState<Team[]>(initialTeams);

    const addTeam = useCallback((name: string) => {
        if (name.trim()) {
            let newTeam: Team | null = null;
            setTeams(prev => {
                newTeam = {
                    id: `team-${Date.now()}`,
                    name: name.trim(),
                    color: TEAM_COLORS[prev.length % TEAM_COLORS.length],
                    players: [],
                };
                return [...prev, newTeam];
            });
            return newTeam;
        }
        return null;
    }, []);

    const removeTeam = useCallback((teamId: string) => {
        setTeams(prev => prev.filter(team => team.id !== teamId));
    }, []);

    const addPlayer = useCallback((teamId: string, name: string) => {
        if (name.trim()) {
            const newPlayer: Player = {
                id: `player-${Date.now()}`,
                name: name.trim(),
                teamId,
            };

            setTeams(prev => prev.map(team =>
                team.id === teamId
                    ? { ...team, players: [...team.players, newPlayer] }
                    : team
            ));
            return newPlayer;
        }
        return null;
    }, []);

    const removePlayer = useCallback((teamId: string, playerId: string) => {
        setTeams(prev => prev.map(team =>
            team.id === teamId
                ? { ...team, players: team.players.filter(p => p.id !== playerId) }
                : team
        ));
    }, []);

    const balanceTeams = useCallback(() => {
        const allPlayers = teams.flatMap(team => team.players);
        const shuffledPlayers = [...allPlayers].sort(() => Math.random() - 0.5);

        const balancedTeams = teams.map((team, index) => ({
            ...team,
            players: shuffledPlayers.filter((_, playerIndex) =>
                playerIndex % teams.length === index
            ),
        }));

        setTeams(balancedTeams);
    }, [teams]);

    const updateTeam = useCallback((teamId: string, updates: Partial<Team>) => {
        setTeams(prev => prev.map(team =>
            team.id === teamId ? { ...team, ...updates } : team
        ));
    }, []);

    const getTeamById = useCallback((teamId: string) => {
        return teams.find(team => team.id === teamId);
    }, [teams]);

    const getPlayerById = useCallback((playerId: string) => {
        return teams.flatMap(team => team.players).find(player => player.id === playerId);
    }, [teams]);

    const updatePlayer = useCallback((playerId: string, updates: Partial<Player>) => {
        setTeams(prev => prev.map(team => ({
            ...team,
            players: team.players.map(player =>
                player.id === playerId ? { ...player, ...updates } : player
            ),
        })));
    }, []);

    const movePlayer = useCallback((playerId: string, newTeamId: string) => {
        setTeams(prev => {
            const player = prev.flatMap(team => team.players).find(p => p.id === playerId);
            if (!player) return prev;

            return prev.map(team => ({
                ...team,
                players: team.id === newTeamId
                    ? [...team.players, { ...player, teamId: newTeamId }]
                    : team.players.filter(p => p.id !== playerId)
            }));
        });
    }, []);

    const clearTeams = useCallback(() => {
        setTeams([]);
    }, []);

    const setTeamsDirectly = useCallback((newTeams: Team[]) => {
        setTeams(newTeams);
    }, []);

    return {
        // State
        teams,

        // Actions
        addTeam,
        removeTeam,
        addPlayer,
        removePlayer,
        balanceTeams,
        updateTeam,
        updatePlayer,
        movePlayer,
        clearTeams,
        setTeams: setTeamsDirectly,

        // Getters
        getTeamById,
        getPlayerById,

        // Computed values
        totalPlayers: teams.reduce((sum, team) => sum + team.players.length, 0),
        hasTeams: teams.length > 0,
        hasPlayers: teams.some(team => team.players.length > 0),
        teamCount: teams.length,
        averagePlayersPerTeam: teams.length > 0
            ? teams.reduce((sum, team) => sum + team.players.length, 0) / teams.length
            : 0,
    };
} 