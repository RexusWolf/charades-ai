export interface Card {
    id: number
    word: string
    category: string
}

export type GameState = 'idle' | 'playing' | 'finished' 