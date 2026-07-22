import { Truck } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { SettingsDialog } from '../components/ui/SettingsDialog';

const LoadBoard = lazy(() => import('../components/load-board/LoadBoard').then((module) => ({ default: module.LoadBoard })));

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="brand" href="/" aria-label="Freightflow home">
          <span className="brand__mark" aria-hidden="true"><Truck size={21} /></span>
          <span className="brand__label">Freightflow</span>
        </a>
        <div id="load-board-toolbar" className="app-header__workspace" />
        <SettingsDialog />
      </header>
      <main id="main-content">
        <Suspense fallback={<div className="app-loading" role="status">Loading dispatch workspace…</div>}>
          <LoadBoard />
        </Suspense>
      </main>
    </div>
  );
}
