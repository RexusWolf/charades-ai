import { useCallback, useState } from 'react';
import { exportDecks } from '../../data/savedDecks';

interface ExportResult {
    success: boolean;
    message: string;
    filename?: string;
}

export function useExport() {
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [exportMessage, setExportMessage] = useState<string>('');
    const [exportSuccess, setExportSuccess] = useState<boolean>(false);

    const handleExport = useCallback((): ExportResult => {
        try {
            setIsExporting(true);
            setExportMessage('');
            setExportSuccess(false);

            const exportData = exportDecks();
            const blob = new Blob([exportData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const filename = `charades-decks-${new Date().toISOString().split('T')[0]}.json`;

            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            const result: ExportResult = {
                success: true,
                message: 'Decks exported successfully!',
                filename
            };

            setExportSuccess(true);
            setExportMessage(result.message);
            setIsExporting(false);

            return result;
        } catch (error) {
            const result: ExportResult = {
                success: false,
                message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            };

            setExportSuccess(false);
            setExportMessage(result.message);
            setIsExporting(false);

            return result;
        }
    }, []);

    const clearExportMessage = useCallback(() => {
        setExportMessage('');
        setExportSuccess(false);
    }, []);

    return {
        // State
        isExporting,
        exportMessage,
        exportSuccess,

        // Actions
        handleExport,
        clearExportMessage,

        // Computed values
        hasExportMessage: exportMessage.length > 0,
    };
} 