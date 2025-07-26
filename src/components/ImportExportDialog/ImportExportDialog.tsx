import { useRef } from "react";
import { useExport } from "../../shared/hooks/useExport";
import { useImport } from "../../shared/hooks/useImport";
import styles from "./ImportExportDialog.module.css";

interface ImportExportDialogProps {
	onClose: () => void;
	onImportSuccess?: () => void;
}

export function ImportExportDialog({
	onClose,
	onImportSuccess,
}: ImportExportDialogProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const {
		isExporting,
		exportMessage,
		exportSuccess,
		handleExport,
		clearExportMessage,
		hasExportMessage,
	} = useExport();

	const {
		isImporting,
		importMessage,
		importSuccess,
		handleImport,
		clearImportMessage,
		validateFile,
		hasImportMessage,
	} = useImport();

	const handleExportClick = () => {
		const result = handleExport();
		if (result.success) {
			// Export was successful
			console.log("Export successful:", result.filename);
		}
	};

	const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const validation = validateFile(file);
		if (!validation.isValid) {
			console.error("File validation failed:", validation.error);
			return;
		}

		handleImport(file).then((result) => {
			if (result.success && onImportSuccess) {
				onImportSuccess();
			}
		});

		// Clear the file input
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleClose = () => {
		clearExportMessage();
		clearImportMessage();
		onClose();
	};

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modal}>
				<div className={styles.modalHeader}>
					<h3>📥📤 Import/Export Decks</h3>
					<button
						type="button"
						className={styles.closeButton}
						onClick={handleClose}
					>
						×
					</button>
				</div>

				<div className={styles.modalContent}>
					{/* Export Section */}
					<div className={styles.exportSection}>
						<h4>📤 Export Decks</h4>
						<p>Download all your saved decks as a JSON file.</p>
						<button
							type="button"
							className={styles.exportBtn}
							onClick={handleExportClick}
							disabled={isExporting}
						>
							{isExporting ? "Exporting..." : "📥 Export All Decks"}
						</button>
						{hasExportMessage && (
							<div
								className={`${styles.message} ${exportSuccess ? styles.success : styles.error}`}
							>
								{exportMessage}
							</div>
						)}
					</div>

					{/* Import Section */}
					<div className={styles.importSection}>
						<h4>📥 Import Decks</h4>
						<p>Import decks from a previously exported JSON file.</p>
						<input
							ref={fileInputRef}
							type="file"
							accept=".json"
							onChange={handleImportFile}
							className={styles.fileInput}
							disabled={isImporting}
						/>
						{hasImportMessage && (
							<div
								className={`${styles.message} ${importSuccess ? styles.success : styles.error}`}
							>
								{importMessage}
							</div>
						)}
					</div>

					{/* Tips Section */}
					<div className={styles.tipsSection}>
						<h4>💡 Tips</h4>
						<ul>
							<li>Exported files contain all your deck data</li>
							<li>Import files should be in the same format as exports</li>
							<li>Duplicate deck names will be automatically renamed</li>
							<li>You can share exported files with friends</li>
							<li>File size must be less than 10MB</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
