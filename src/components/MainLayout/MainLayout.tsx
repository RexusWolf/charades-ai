import styles from "./MainLayout.module.css";

interface MainLayoutProps {
	children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	return (
		<div className={styles.app}>
			<div className={styles.container}>{children}</div>
		</div>
	);
};
