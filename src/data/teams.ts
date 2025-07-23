import type { Player, Team } from '../Game'

export const SAMPLE_TEAMS: Team[] = [
    {
        id: 'team-1',
        name: 'Red Team',
        color: '#ff6b6b',
        players: [
            { id: 'player-1', name: 'Francis', teamId: 'team-1' },
            { id: 'player-2', name: 'Deme', teamId: 'team-1' },
            { id: 'player-3', name: 'Isa', teamId: 'team-1' },
        ]
    },
    {
        id: 'team-2',
        name: 'Blue Team',
        color: '#0527e2',
        players: [
            { id: 'player-4', name: 'Tomu', teamId: 'team-2' },
            { id: 'player-5', name: 'Blanca', teamId: 'team-2' },
            { id: 'player-6', name: 'Lydia', teamId: 'team-2' },
        ]
    },
    {
        id: 'team-3',
        name: 'Green Team',
        color: '#51cf66',
        players: [
            { id: 'player-7', name: 'Alfonso', teamId: 'team-3' },
            { id: 'player-8', name: 'Gabi', teamId: 'team-3' },
        ]
    }
]

export function getAllPlayers(): Player[] {
    return SAMPLE_TEAMS.flatMap(team => team.players)
}

export function getTeamById(teamId: string): Team | undefined {
    return SAMPLE_TEAMS.find(team => team.id === teamId)
}

export function getPlayerById(playerId: string): Player | undefined {
    return getAllPlayers().find(player => player.id === playerId)
} 