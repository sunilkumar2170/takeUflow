import { lazy, Suspense, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { Tab } from './types';
import { cn } from './utils/cn';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Problems = lazy(() => import('./pages/Problems'));
const Topics = lazy(() => import('./pages/Topics'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));
const Profile = lazy(() => import('./pages/Profile'));

const pageTitles: Record<Tab, string> = {
  dashboard: 'Dashboard',
  problems: 'Problems',
  topics: 'Topics',
  bookmarks: 'Bookmarks',
  profile: 'Profile',
};

function PageLoader() {
  return (
    <div className="space-y-3 p-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-20 skeleton rounded-xl" style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  const handleTabChange = (t: Tab) => {
    setTab(t);
    if (t !== 'problems') setSearchQuery('');
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (tab !== 'problems') setTab('problems');
  };

  const renderPage = () => {
    switch (tab) {
      case 'dashboard': return <Dashboard onTabChange={handleTabChange} onTopicSelect={t => { setSelectedTopic(t); handleTabChange('topics'); }} />;
      case 'problems': return <Problems externalQuery={searchQuery} onSearchClear={() => setSearchQuery('')} />;
      case 'topics': return <Topics initialTopic={selectedTopic} onClearTopic={() => setSelectedTopic('')} />;
      case 'bookmarks': return <Bookmarks />;
      case 'profile': return <Profile />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-base text-text-primary">
      <Sidebar active={tab} onChange={handleTabChange} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center gap-3 px-4 sm:px-6 py-3.5 border-b border-border-subtle bg-bg-surface/80 flex-shrink-0" style={{ backdropFilter: 'blur(12px)' }}>
          <h1 className="font-bold text-text-primary text-base lg:hidden">{pageTitles[tab]}</h1>
          <h1 className="hidden lg:block font-bold text-text-primary text-base">{pageTitles[tab]}</h1>

          <div className="flex-1 max-w-md ml-auto lg:ml-0">
            <div className="flex items-center gap-2 bg-bg-elevated border border-border-default rounded-xl px-3 py-2 focus-within:border-brand-500/50 transition-all">
              <MagnifyingGlassIcon className="w-4 h-4 text-text-muted flex-shrink-0" />
              <input
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Quick search..."
                className="bg-transparent text-sm text-text-primary placeholder:text-text-disabled outline-none w-full min-w-0"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 pb-24 lg:pb-6">
            <Suspense fallback={<PageLoader />}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  {renderPage()}
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <BottomNav active={tab} onChange={handleTabChange} />
      </div>
    </div>
  );
}
