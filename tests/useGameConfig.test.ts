import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PRESET_CONFIGS } from '../src/data/config';
import type { GameConfig } from '../src/Game';
import { useGameConfig } from '../src/shared/hooks/useGameConfig';

describe('useGameConfig', () => {
    const mockConfig: GameConfig = {
        secondsPerRound: 45,
        maxCards: 10,
        enablePreparationPhase: true,
        preparationTimeLimit: 15,
        autoStartNextPlayer: false,
        numberOfRounds: 3,
    };

    describe('Initialization', () => {
        it('should initialize with default preset when no initial config provided', () => {
            const { result } = renderHook(() => useGameConfig());

            expect(result.current.config).toEqual(PRESET_CONFIGS.standard);
            expect(result.current.selectedPreset).toBe('standard');
            expect(result.current.isValid).toBe(true);
        });

        it('should initialize with custom config when provided', () => {
            const { result } = renderHook(() => useGameConfig(mockConfig));

            expect(result.current.config).toEqual(mockConfig);
            expect(result.current.selectedPreset).toBe('custom');
            expect(result.current.isValid).toBe(true);
        });

        it('should initialize with specified preset', () => {
            const { result } = renderHook(() => useGameConfig(undefined, 'quick'));

            expect(result.current.config).toEqual(PRESET_CONFIGS.quick);
            expect(result.current.selectedPreset).toBe('quick');
        });
    });

    describe('Preset Management', () => {
        it('should select a preset and update config', () => {
            const { result } = renderHook(() => useGameConfig());

            act(() => {
                result.current.selectPreset('extended');
            });

            expect(result.current.config).toEqual(PRESET_CONFIGS.extended);
            expect(result.current.selectedPreset).toBe('extended');
        });

        it('should get all preset names', () => {
            const { result } = renderHook(() => useGameConfig());

            const presetNames = result.current.getPresetNames();
            expect(presetNames).toEqual(['quick', 'standard', 'extended', 'marathon']);
        });

        it('should get preset config by name', () => {
            const { result } = renderHook(() => useGameConfig());

            const quickConfig = result.current.getPresetConfig('quick');
            expect(quickConfig).toEqual(PRESET_CONFIGS.quick);
        });

        it('should reset to default preset', () => {
            const { result } = renderHook(() => useGameConfig(mockConfig));

            act(() => {
                result.current.resetToDefault();
            });

            expect(result.current.config).toEqual(PRESET_CONFIGS.standard);
            expect(result.current.selectedPreset).toBe('standard');
        });

        it('should reset to specific preset', () => {
            const { result } = renderHook(() => useGameConfig());

            act(() => {
                result.current.resetToPreset('marathon');
            });

            expect(result.current.config).toEqual(PRESET_CONFIGS.marathon);
            expect(result.current.selectedPreset).toBe('marathon');
        });
    });

    describe('Config Updates', () => {
        it('should update single config value', () => {
            const { result } = renderHook(() => useGameConfig());

            act(() => {
                result.current.updateConfig('secondsPerRound', 90);
            });

            expect(result.current.config.secondsPerRound).toBe(90);
            expect(result.current.selectedPreset).toBe('custom');
        });

        it('should update multiple config values', () => {
            const { result } = renderHook(() => useGameConfig());

            act(() => {
                result.current.updateConfigBatch({
                    secondsPerRound: 75,
                    maxCards: 25,
                    numberOfRounds: 4,
                });
            });

            expect(result.current.config.secondsPerRound).toBe(75);
            expect(result.current.config.maxCards).toBe(25);
            expect(result.current.config.numberOfRounds).toBe(4);
            expect(result.current.selectedPreset).toBe('custom');
        });

        it('should update boolean config values', () => {
            const { result } = renderHook(() => useGameConfig());

            act(() => {
                result.current.updateConfig('autoStartNextPlayer', true);
            });

            expect(result.current.config.autoStartNextPlayer).toBe(true);
            expect(result.current.selectedPreset).toBe('custom');
        });
    });

    describe('Validation', () => {
        it('should validate correct config', () => {
            const { result } = renderHook(() => useGameConfig());

            const validation = result.current.validateConfig();
            expect(validation.isValid).toBe(true);
            expect(validation.errors).toEqual([]);
        });

        it('should detect invalid seconds per round', () => {
            const invalidConfig: GameConfig = {
                ...mockConfig,
                secondsPerRound: 10, // Too low
            };
            const { result } = renderHook(() => useGameConfig(invalidConfig));

            const validation = result.current.validateConfig();
            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain('Seconds per round must be between 15 and 180');
        });

        it('should detect invalid max cards', () => {
            const invalidConfig: GameConfig = {
                ...mockConfig,
                maxCards: 0, // Too low
            };
            const { result } = renderHook(() => useGameConfig(invalidConfig));

            const validation = result.current.validateConfig();
            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain('Number of cards must be between 1 and 100');
        });

        it('should detect invalid number of rounds', () => {
            const invalidConfig: GameConfig = {
                ...mockConfig,
                numberOfRounds: 15, // Too high
            };
            const { result } = renderHook(() => useGameConfig(invalidConfig));

            const validation = result.current.validateConfig();
            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain('Number of rounds must be between 1 and 10');
        });

        it('should detect invalid preparation time limit', () => {
            const invalidConfig: GameConfig = {
                ...mockConfig,
                enablePreparationPhase: true,
                preparationTimeLimit: -5, // Negative
            };
            const { result } = renderHook(() => useGameConfig(invalidConfig));

            const validation = result.current.validateConfig();
            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain('Preparation time limit must be non-negative');
        });

        it('should handle multiple validation errors', () => {
            const invalidConfig: GameConfig = {
                ...mockConfig,
                secondsPerRound: 5, // Too low
                maxCards: 0, // Too low
                numberOfRounds: 15, // Too high
            };
            const { result } = renderHook(() => useGameConfig(invalidConfig));

            const validation = result.current.validateConfig();
            expect(validation.isValid).toBe(false);
            expect(validation.errors).toHaveLength(3);
            expect(validation.errors).toContain('Seconds per round must be between 15 and 180');
            expect(validation.errors).toContain('Number of cards must be between 1 and 100');
            expect(validation.errors).toContain('Number of rounds must be between 1 and 10');
        });
    });

    describe('Config Summary', () => {
        it('should generate correct summary for standard config', () => {
            const { result } = renderHook(() => useGameConfig());

            const summary = result.current.getConfigSummary();
            expect(summary.duration).toBe('60s per round');
            expect(summary.cards).toBe('15 cards');
            expect(summary.rounds).toBe('3 rounds');
            expect(summary.preparation).toBe('With 0s prep');
            expect(summary.autoStart).toBe('Manual start');
        });

        it('should generate correct summary for config without preparation', () => {
            const configWithoutPrep: GameConfig = {
                ...mockConfig,
                enablePreparationPhase: false,
            };
            const { result } = renderHook(() => useGameConfig(configWithoutPrep));

            const summary = result.current.getConfigSummary();
            expect(summary.preparation).toBe('No preparation phase');
        });

        it('should generate correct summary for auto-start config', () => {
            const autoStartConfig: GameConfig = {
                ...mockConfig,
                autoStartNextPlayer: true,
            };
            const { result } = renderHook(() => useGameConfig(autoStartConfig));

            const summary = result.current.getConfigSummary();
            expect(summary.autoStart).toBe('Auto-start');
        });
    });

    describe('Utility Functions', () => {
        it('should check if config is custom', () => {
            const { result } = renderHook(() => useGameConfig());

            expect(result.current.isCustomConfig()).toBe(false);

            act(() => {
                result.current.updateConfig('secondsPerRound', 90);
            });

            expect(result.current.isCustomConfig()).toBe(true);
        });

        it('should get current preset', () => {
            const { result } = renderHook(() => useGameConfig());

            expect(result.current.getCurrentPreset()).toBe('standard');

            act(() => {
                result.current.selectPreset('quick');
            });

            expect(result.current.getCurrentPreset()).toBe('quick');
        });

        it('should clone config', () => {
            const { result } = renderHook(() => useGameConfig(mockConfig));

            const clonedConfig = result.current.cloneConfig();
            expect(clonedConfig).toEqual(mockConfig);
            expect(clonedConfig).not.toBe(mockConfig); // Should be a new object
        });
    });

    describe('Computed Values', () => {
        it('should provide computed validation state', () => {
            const { result } = renderHook(() => useGameConfig());

            expect(result.current.isValid).toBe(true);
            expect(result.current.validationErrors).toEqual([]);

            act(() => {
                result.current.updateConfig('secondsPerRound', 5);
            });

            expect(result.current.isValid).toBe(false);
            expect(result.current.validationErrors).toContain('Seconds per round must be between 15 and 180');
        });

        it('should provide computed summary', () => {
            const { result } = renderHook(() => useGameConfig());

            const summary = result.current.summary;
            expect(summary.duration).toBe('60s per round');
            expect(summary.cards).toBe('15 cards');
            expect(summary.rounds).toBe('3 rounds');
        });
    });

    describe('Edge Cases', () => {
        it('should handle boundary values correctly', () => {
            const boundaryConfig: GameConfig = {
                secondsPerRound: 15, // Minimum valid value
                maxCards: 1, // Minimum valid value
                enablePreparationPhase: true,
                preparationTimeLimit: 0, // Minimum valid value
                autoStartNextPlayer: false,
                numberOfRounds: 1, // Minimum valid value
            };
            const { result } = renderHook(() => useGameConfig(boundaryConfig));

            expect(result.current.isValid).toBe(true);
        });

        it('should handle maximum boundary values correctly', () => {
            const maxBoundaryConfig: GameConfig = {
                secondsPerRound: 180, // Maximum valid value
                maxCards: 100, // Maximum valid value
                enablePreparationPhase: true,
                preparationTimeLimit: 60,
                autoStartNextPlayer: true,
                numberOfRounds: 10, // Maximum valid value
            };
            const { result } = renderHook(() => useGameConfig(maxBoundaryConfig));

            expect(result.current.isValid).toBe(true);
        });

        it('should handle empty config updates', () => {
            const { result } = renderHook(() => useGameConfig());

            const originalConfig = result.current.config;

            act(() => {
                result.current.updateConfigBatch({});
            });

            expect(result.current.config).toEqual(originalConfig);
            expect(result.current.selectedPreset).toBe('custom');
        });
    });
}); 