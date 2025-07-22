export interface Card {
    id: number
    word: string
    category: string
}

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

export interface GameRound {
    playerId: string
    teamId: string
    passedCards: Card[]
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