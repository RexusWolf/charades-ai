import { useCallback, useState } from 'react';
import { importDecks } from '../../data/savedDecks';

interface ImportResult {
    success: boolean;
    message: string;
}

export function useImport() {
    const [isImporting, setIsImporting] = useState<boolean>(false);
    const [importMessage, setImportMessage] = useState<string>('');
    const [importSuccess, setImportSuccess] = useState<boolean>(false);

    const handleImport = useCallback((file: File): Promise<ImportResult> => {
        return new Promise((resolve) => {
            setIsImporting(true);
            setImportMessage('');
            setImportSuccess(false);

            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string;
                    const result = importDecks(content);

                    setImportSuccess(result.success);
                    setImportMessage(result.message);
                    setIsImporting(false);

                    resolve({
                        success: result.success,
                        message: result.message
                    });
                } catch (error) {
                    const errorMessage = `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
                    setImportSuccess(false);
                    setImportMessage(errorMessage);
                    setIsImporting(false);

                    resolve({
                        success: false,
                        message: errorMessage
                    });
                }
            };

            reader.onerror = () => {
                const errorMessage = 'Failed to read file';
                setImportSuccess(false);
                setImportMessage(errorMessage);
                setIsImporting(false);

                resolve({
                    success: false,
                    message: errorMessage
                });
            };

            reader.readAsText(file);
        });
    }, []);

    const clearImportMessage = useCallback(() => {
        setImportMessage('');
        setImportSuccess(false);
    }, []);

    const validateFile = useCallback((file: File): { isValid: boolean; error?: string } => {
        if (!file) {
            return { isValid: false, error: 'No file selected' };
        }

        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            return { isValid: false, error: 'File must be a JSON file' };
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            return { isValid: false, error: 'File size must be less than 10MB' };
        }

        return { isValid: true };
    }, []);

    return {
        // State
        isImporting,
        importMessage,
        importSuccess,

        // Actions
        handleImport,
        clearImportMessage,
        validateFile,

        // Computed values
        hasImportMessage: importMessage.length > 0,
    };
} 