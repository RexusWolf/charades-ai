import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useExport } from '../src/shared/hooks/useExport';

// Mock the exportDecks function
vi.mock('../src/data/savedDecks', () => ({
    exportDecks: vi.fn(() => '{"decks": []}')
}));

describe('useExport - Simple Tests', () => {
    describe('Initialization', () => {
        it('should initialize with default state', () => {
            const { result } = renderHook(() => useExport());

            expect(result.current.isExporting).toBe(false);
            expect(result.current.exportMessage).toBe('');
            expect(result.current.exportSuccess).toBe(false);
            expect(result.current.hasExportMessage).toBe(false);
        });
    });

    describe('Message Management', () => {
        it('should clear export message', () => {
            const { result } = renderHook(() => useExport());

            // Set a message first
            act(() => {
                result.current.handleExport();
            });

            expect(result.current.hasExportMessage).toBe(true);

            act(() => {
                result.current.clearExportMessage();
            });

            expect(result.current.exportMessage).toBe('');
            expect(result.current.exportSuccess).toBe(false);
            expect(result.current.hasExportMessage).toBe(false);
        });
    });
}); 