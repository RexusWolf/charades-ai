import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useImport } from '../src/shared/hooks/useImport';

// Mock the importDecks function
vi.mock('../src/data/savedDecks', () => ({
    importDecks: vi.fn(() => ({ success: true, message: 'Import successful' }))
}));

describe('useImport - Simple Tests', () => {
    describe('Initialization', () => {
        it('should initialize with default state', () => {
            const { result } = renderHook(() => useImport());

            expect(result.current.isImporting).toBe(false);
            expect(result.current.importMessage).toBe('');
            expect(result.current.importSuccess).toBe(false);
            expect(result.current.hasImportMessage).toBe(false);
        });
    });

    describe('File Validation', () => {
        it('should validate JSON files correctly', () => {
            const { result } = renderHook(() => useImport());

            const validFile = new File(['{"decks": []}'], 'test.json', { type: 'application/json' });
            const validation = result.current.validateFile(validFile);

            expect(validation.isValid).toBe(true);
            expect(validation.error).toBeUndefined();
        });

        it('should reject non-JSON files', () => {
            const { result } = renderHook(() => useImport());

            const invalidFile = new File(['not json'], 'test.txt', { type: 'text/plain' });
            const validation = result.current.validateFile(invalidFile);

            expect(validation.isValid).toBe(false);
            expect(validation.error).toBe('File must be a JSON file');
        });

        it('should reject files larger than 10MB', () => {
            const { result } = renderHook(() => useImport());

            const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.json', { type: 'application/json' });
            const validation = result.current.validateFile(largeFile);

            expect(validation.isValid).toBe(false);
            expect(validation.error).toBe('File size must be less than 10MB');
        });
    });

    describe('Message Management', () => {
        it('should clear import message', () => {
            const { result } = renderHook(() => useImport());

            act(() => {
                result.current.clearImportMessage();
            });

            expect(result.current.importMessage).toBe('');
            expect(result.current.importSuccess).toBe(false);
            expect(result.current.hasImportMessage).toBe(false);
        });
    });
}); 