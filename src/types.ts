import type { Card } from "./components/Card/Card"

export interface Player {
    id: string
    name: string
    teamId: string
}

export interface Team {
    id: string
    name: string
    color: string
    players: Player[]
}

export interface Turn {
    playerId: string
    teamId: string
    remainingCards: Card[]
    correctCards: Card[]
    timeLeft: number
}

export interface Round {
    remainingCards: Card[]
    turns: Turn[]
}

export interface GameRound {
    playerId: string
    teamId: string
    remainingCards: Card[]
    correctCards: Card[]
    timeLeft: number
}

export interface GameConfig {
    secondsPerRound: number
    maxCards: number
    enablePreparationPhase: boolean
    preparationTimeLimit: number
    autoStartNextPlayer: boolean
}

export type GameState = 'idle' | 'config' | 'team-setup' | 'playing' | 'finished' 