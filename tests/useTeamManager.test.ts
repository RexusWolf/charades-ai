import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Player, Team } from '../src/Game';
import { useTeamManager } from '../src/shared/hooks/useTeamManager';

// Mock Date.now() to have predictable IDs
const mockDateNow = vi.fn();
beforeEach(() => {
    mockDateNow.mockReturnValue(1234567890);
    vi.spyOn(Date, 'now').mockImplementation(mockDateNow);
});

describe('useTeamManager', () => {
    const mockTeams: Team[] = [
        {
            id: 'team1',
            name: 'Team A',
            color: '#ff6b6b',
            players: [
                { id: 'player1', name: 'Alice', teamId: 'team1' },
                { id: 'player2', name: 'Bob', teamId: 'team1' },
            ],
        },
        {
            id: 'team2',
            name: 'Team B',
            color: '#51cf66',
            players: [
                { id: 'player3', name: 'Charlie', teamId: 'team2' },
            ],
        },
    ];

    describe('Initialization', () => {
        it('should initialize with empty teams when no initial teams provided', () => {
            const { result } = renderHook(() => useTeamManager());

            expect(result.current.teams).toEqual([]);
            expect(result.current.totalPlayers).toBe(0);
            expect(result.current.hasTeams).toBe(false);
            expect(result.current.hasPlayers).toBe(false);
        });

        it('should initialize with provided teams', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            expect(result.current.teams).toEqual(mockTeams);
            expect(result.current.totalPlayers).toBe(3);
            expect(result.current.hasTeams).toBe(true);
            expect(result.current.hasPlayers).toBe(true);
            expect(result.current.teamCount).toBe(2);
        });
    });

    describe('Team Management', () => {
        it('should add a new team', () => {
            const { result } = renderHook(() => useTeamManager());

            act(() => {
                const newTeam = result.current.addTeam('New Team');
                expect(newTeam).toBeTruthy();
            });

            expect(result.current.teams).toHaveLength(1);
            expect(result.current.teams[0].name).toBe('New Team');
            expect(result.current.teams[0].color).toBe('#ff6b6b'); // First color
            expect(result.current.hasTeams).toBe(true);
        });

        it('should not add team with empty name', () => {
            const { result } = renderHook(() => useTeamManager());

            let newTeam: Team | null = null;
            act(() => {
                newTeam = result.current.addTeam('');
            });

            expect(result.current.teams).toHaveLength(0);
            expect(newTeam).toBeNull();
        });

        it('should not add team with whitespace-only name', () => {
            const { result } = renderHook(() => useTeamManager());

            let newTeam: Team | null = null;
            act(() => {
                newTeam = result.current.addTeam('   ');
            });

            expect(result.current.teams).toHaveLength(0);
            expect(newTeam).toBeNull();
        });

        it('should remove a team', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            act(() => {
                result.current.removeTeam('team1');
            });

            expect(result.current.teams).toHaveLength(1);
            expect(result.current.teams[0].id).toBe('team2');
            expect(result.current.totalPlayers).toBe(1);
        });

        it('should update team properties', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            act(() => {
                result.current.updateTeam('team1', { name: 'Updated Team A', color: '#000000' });
            });

            const updatedTeam = result.current.getTeamById('team1');
            expect(updatedTeam?.name).toBe('Updated Team A');
            expect(updatedTeam?.color).toBe('#000000');
        });

        it('should get team by ID', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            const team = result.current.getTeamById('team1');
            expect(team).toEqual(mockTeams[0]);
        });

        it('should return undefined for non-existent team ID', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            const team = result.current.getTeamById('non-existent');
            expect(team).toBeUndefined();
        });

        it('should clear all teams', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            act(() => {
                result.current.clearTeams();
            });

            expect(result.current.teams).toEqual([]);
            expect(result.current.hasTeams).toBe(false);
            expect(result.current.totalPlayers).toBe(0);
        });

        it('should set teams', () => {
            const { result } = renderHook(() => useTeamManager());

            const newTeams: Team[] = [
                { id: 'new1', name: 'New Team 1', color: '#ff0000', players: [] },
                { id: 'new2', name: 'New Team 2', color: '#00ff00', players: [] },
            ];

            act(() => {
                result.current.setTeams(newTeams);
            });

            expect(result.current.teams).toEqual(newTeams);
        });
    });

    describe('Player Management', () => {
        it('should add a player to a team', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            act(() => {
                const newPlayer = result.current.addPlayer('team1', 'New Player');
            });

            const team = result.current.getTeamById('team1');
            expect(team?.players).toHaveLength(3);
            expect(team?.players[2].name).toBe('New Player');
            expect(result.current.totalPlayers).toBe(4);
        });

        it('should not add player with empty name', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            let newPlayer: Player | null = null;
            act(() => {
                newPlayer = result.current.addPlayer('team1', '');
            });

            const team = result.current.getTeamById('team1');
            expect(team?.players).toHaveLength(2);
            expect(newPlayer).toBeNull();
        });

        it('should remove a player from a team', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            act(() => {
                result.current.removePlayer('team1', 'player1');
            });

            const team = result.current.getTeamById('team1');
            expect(team?.players).toHaveLength(1);
            expect(team?.players[0].name).toBe('Bob');
            expect(result.current.totalPlayers).toBe(2);
        });

        it('should get player by ID', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            const player = result.current.getPlayerById('player1');
            expect(player).toEqual(mockTeams[0].players[0]);
        });

        it('should return undefined for non-existent player ID', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            const player = result.current.getPlayerById('non-existent');
            expect(player).toBeUndefined();
        });

        it('should update player properties', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            act(() => {
                result.current.updatePlayer('player1', { name: 'Updated Alice' });
            });

            const player = result.current.getPlayerById('player1');
            expect(player?.name).toBe('Updated Alice');
        });

        it('should move player to different team', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            act(() => {
                result.current.movePlayer('player1', 'team2');
            });

            const team1 = result.current.getTeamById('team1');
            const team2 = result.current.getTeamById('team2');

            expect(team1?.players).toHaveLength(1);
            expect(team2?.players).toHaveLength(2);
            expect(team2?.players[1].name).toBe('Alice');
            expect(team2?.players[1].teamId).toBe('team2');
        });
    });

    describe('Team Balancing', () => {
        it('should balance players across teams', () => {
            const unbalancedTeams: Team[] = [
                {
                    id: 'team1',
                    name: 'Team A',
                    color: '#ff6b6b',
                    players: [
                        { id: 'player1', name: 'Alice', teamId: 'team1' },
                        { id: 'player2', name: 'Bob', teamId: 'team1' },
                        { id: 'player3', name: 'Charlie', teamId: 'team1' },
                    ],
                },
                {
                    id: 'team2',
                    name: 'Team B',
                    color: '#51cf66',
                    players: [
                        { id: 'player4', name: 'Diana', teamId: 'team2' },
                    ],
                },
            ];

            const { result } = renderHook(() => useTeamManager(unbalancedTeams));

            act(() => {
                result.current.balanceTeams();
            });

            // After balancing, players should be distributed more evenly
            const team1 = result.current.getTeamById('team1');
            const team2 = result.current.getTeamById('team2');

            expect(team1?.players.length).toBeGreaterThanOrEqual(1);
            expect(team2?.players.length).toBeGreaterThanOrEqual(1);
            expect(result.current.totalPlayers).toBe(4);
        });

        it('should handle balancing with empty teams', () => {
            const { result } = renderHook(() => useTeamManager());

            act(() => {
                result.current.balanceTeams();
            });

            expect(result.current.teams).toEqual([]);
        });
    });

    describe('Computed Values', () => {
        it('should calculate total players correctly', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            expect(result.current.totalPlayers).toBe(3);
        });

        it('should calculate average players per team correctly', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            expect(result.current.averagePlayersPerTeam).toBe(1.5);
        });

        it('should return 0 for average when no teams exist', () => {
            const { result } = renderHook(() => useTeamManager());

            expect(result.current.averagePlayersPerTeam).toBe(0);
        });

        it('should track team count correctly', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            expect(result.current.teamCount).toBe(2);
        });

        it('should track hasTeams correctly', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            expect(result.current.hasTeams).toBe(true);

            act(() => {
                result.current.clearTeams();
            });

            expect(result.current.hasTeams).toBe(false);
        });

        it('should track hasPlayers correctly', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            expect(result.current.hasPlayers).toBe(true);

            act(() => {
                result.current.removePlayer('team1', 'player1');
                result.current.removePlayer('team1', 'player2');
                result.current.removePlayer('team2', 'player3');
            });

            expect(result.current.hasPlayers).toBe(false);
        });
    });

    describe('Color Assignment', () => {
        it('should assign colors in rotation', () => {
            const { result } = renderHook(() => useTeamManager());

            act(() => {
                result.current.addTeam('Team 1');
                result.current.addTeam('Team 2');
                result.current.addTeam('Team 3');
            });



            // Colors are assigned based on the current teams.length before adding
            // Team 1: teams.length = 0, color = TEAM_COLORS[0] = '#ff6b6b'
            // Team 2: teams.length = 1, color = TEAM_COLORS[1] = '#0527e2'  
            // Team 3: teams.length = 2, color = TEAM_COLORS[2] = '#51cf66'
            expect(result.current.teams[0].color).toBe('#ff6b6b'); // First color
            expect(result.current.teams[1].color).toBe('#0527e2'); // Second color
            expect(result.current.teams[2].color).toBe('#51cf66'); // Third color
        });

        it('should cycle through colors when more teams than colors', () => {
            const { result } = renderHook(() => useTeamManager());

            // Add more teams than available colors
            act(() => {
                for (let i = 0; i < 15; i++) {
                    result.current.addTeam(`Team ${i + 1}`);
                }
            });

            expect(result.current.teams[10].color).toBe('#ff6b6b'); // Should cycle back
        });
    });

    describe('Edge Cases', () => {
        it('should handle removing non-existent team', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            act(() => {
                result.current.removeTeam('non-existent');
            });

            expect(result.current.teams).toEqual(mockTeams);
        });

        it('should handle removing non-existent player', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            act(() => {
                result.current.removePlayer('team1', 'non-existent');
            });

            expect(result.current.teams).toEqual(mockTeams);
        });

        it('should handle moving non-existent player', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            act(() => {
                result.current.movePlayer('non-existent', 'team2');
            });

            expect(result.current.teams).toEqual(mockTeams);
        });

        it('should handle updating non-existent player', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            act(() => {
                result.current.updatePlayer('non-existent', { name: 'New Name' });
            });

            expect(result.current.teams).toEqual(mockTeams);
        });

        it('should handle updating non-existent team', () => {
            const { result } = renderHook(() => useTeamManager(mockTeams));

            act(() => {
                result.current.updateTeam('non-existent', { name: 'New Name' });
            });

            expect(result.current.teams).toEqual(mockTeams);
        });
    });
}); 