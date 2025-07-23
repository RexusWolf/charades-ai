import type { GameConfig } from '../Game'

export const DEFAULT_CONFIG: GameConfig = {
    secondsPerRound: 60,
    maxCards: 15,
    enablePreparationPhase: true,
    preparationTimeLimit: 0, // 0 means no limit
    autoStartNextPlayer: false,
    numberOfRounds: 1
}

export const PRESET_CONFIGS: Record<string, GameConfig> = {
    'quick': {
        secondsPerRound: 30,
        maxCards: 5,
        enablePreparationPhase: false,
        preparationTimeLimit: 0,
        autoStartNextPlayer: true,
        numberOfRounds: 2
    },
    'standard': {
        secondsPerRound: 60,
        maxCards: 15,
        enablePreparationPhase: true,
        preparationTimeLimit: 0,
        autoStartNextPlayer: false,
        numberOfRounds: 3
    },
    'extended': {
        secondsPerRound: 90,
        maxCards: 20,
        enablePreparationPhase: true,
        preparationTimeLimit: 30,
        autoStartNextPlayer: false,
        numberOfRounds: 4
    },
    'marathon': {
        secondsPerRound: 120,
        maxCards: 30,
        enablePreparationPhase: true,
        preparationTimeLimit: 60,
        autoStartNextPlayer: false,
        numberOfRounds: 5
    }
}

export function getConfigByName(name: string): GameConfig {
    return PRESET_CONFIGS[name] || DEFAULT_CONFIG
} 