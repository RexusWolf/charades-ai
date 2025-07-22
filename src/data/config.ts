import type { GameConfig } from '../types'

export const DEFAULT_CONFIG: GameConfig = {
    secondsPerRound: 60,
    maxCards: 15,
    enablePreparationPhase: true,
    preparationTimeLimit: 0, // 0 means no limit
    autoStartNextPlayer: false
}

export const PRESET_CONFIGS: Record<string, GameConfig> = {
    'quick': {
        secondsPerRound: 30,
        maxCards: 10,
        enablePreparationPhase: false,
        preparationTimeLimit: 0,
        autoStartNextPlayer: true
    },
    'standard': {
        secondsPerRound: 60,
        maxCards: 15,
        enablePreparationPhase: true,
        preparationTimeLimit: 0,
        autoStartNextPlayer: false
    },
    'extended': {
        secondsPerRound: 90,
        maxCards: 20,
        enablePreparationPhase: true,
        preparationTimeLimit: 30,
        autoStartNextPlayer: false
    },
    'marathon': {
        secondsPerRound: 120,
        maxCards: 30,
        enablePreparationPhase: true,
        preparationTimeLimit: 60,
        autoStartNextPlayer: false
    }
}

export function getConfigByName(name: string): GameConfig {
    return PRESET_CONFIGS[name] || DEFAULT_CONFIG
} 