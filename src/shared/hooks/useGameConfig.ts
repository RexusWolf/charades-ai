import { useCallback, useState } from 'react';
import { PRESET_CONFIGS } from '../../data/config';
import type { GameConfig } from '../../Game';

export type PresetName = keyof typeof PRESET_CONFIGS;

export function useGameConfig(initialConfig?: GameConfig, initialPreset: PresetName = 'standard') {
    const [config, setConfig] = useState<GameConfig>(initialConfig || PRESET_CONFIGS[initialPreset]);
    const [selectedPreset, setSelectedPreset] = useState<PresetName | 'custom'>(
        initialConfig ? 'custom' : initialPreset
    );

    const selectPreset = useCallback((presetName: PresetName) => {
        setSelectedPreset(presetName);
        setConfig(PRESET_CONFIGS[presetName]);
    }, []);

    const updateConfig = useCallback((key: keyof GameConfig, value: number | boolean) => {
        setConfig(prev => ({ ...prev, [key]: value }));
        setSelectedPreset('custom');
    }, []);

    const updateConfigBatch = useCallback((updates: Partial<GameConfig>) => {
        setConfig(prev => ({ ...prev, ...updates }));
        setSelectedPreset('custom');
    }, []);

    const resetToPreset = useCallback((presetName: PresetName) => {
        selectPreset(presetName);
    }, [selectPreset]);

    const resetToDefault = useCallback(() => {
        selectPreset('standard');
    }, [selectPreset]);

    const getPresetNames = useCallback(() => {
        return Object.keys(PRESET_CONFIGS) as PresetName[];
    }, []);

    const getPresetConfig = useCallback((presetName: PresetName) => {
        return PRESET_CONFIGS[presetName];
    }, []);

    const isCustomConfig = useCallback(() => {
        return selectedPreset === 'custom';
    }, [selectedPreset]);

    const getCurrentPreset = useCallback(() => {
        return selectedPreset;
    }, [selectedPreset]);

    const validateConfig = useCallback(() => {
        const errors: string[] = [];

        if (config.secondsPerRound < 15 || config.secondsPerRound > 180) {
            errors.push('Seconds per round must be between 15 and 180');
        }

        if (config.maxCards < 1 || config.maxCards > 100) {
            errors.push('Number of cards must be between 1 and 100');
        }

        if (config.numberOfRounds < 1 || config.numberOfRounds > 10) {
            errors.push('Number of rounds must be between 1 and 10');
        }

        if (config.enablePreparationPhase && config.preparationTimeLimit < 0) {
            errors.push('Preparation time limit must be non-negative');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }, [config]);

    const getConfigSummary = useCallback(() => {
        return {
            duration: `${config.secondsPerRound}s per round`,
            cards: `${config.maxCards} cards`,
            rounds: `${config.numberOfRounds} rounds`,
            preparation: config.enablePreparationPhase
                ? `With ${config.preparationTimeLimit}s prep`
                : 'No preparation phase',
            autoStart: config.autoStartNextPlayer ? 'Auto-start' : 'Manual start'
        };
    }, [config]);

    const cloneConfig = useCallback(() => {
        return { ...config };
    }, [config]);

    return {
        // State
        config,
        selectedPreset,

        // Actions
        selectPreset,
        updateConfig,
        updateConfigBatch,
        resetToPreset,
        resetToDefault,

        // Getters
        getPresetNames,
        getPresetConfig,
        getCurrentPreset,
        isCustomConfig,
        validateConfig,
        getConfigSummary,
        cloneConfig,

        // Computed values
        isValid: validateConfig().isValid,
        validationErrors: validateConfig().errors,
        summary: getConfigSummary(),
    };
} 