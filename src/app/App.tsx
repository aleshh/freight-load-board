import { Truck } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { SettingsDialog } from '../components/ui/SettingsDialog/SettingsDialog';
import styles from './App.module.css';

const LoadBoard = lazy(() => import('../components/load-board/LoadBoard/LoadBoard').then((module) => ({ default: module.LoadBoard })));

export default function App() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <a className={styles.brand} href={import.meta.env.BASE_URL} aria-label="Freightboard home">
          <span className={styles.brandMark} aria-hidden="true"><Truck size={21} /></span>
          <span className={styles.brandLabel}>Freightboard</span>
        </a>
        <div id="load-board-toolbar" className={styles.workspace} />
        <SettingsDialog />
      </header>
      <main id="main-content" className={styles.main}>
        <Suspense fallback={<div className={styles.loading} role="status">Loading dispatch workspace…</div>}>
          <LoadBoard />
        </Suspense>
      </main>
    </div>
  );
}
