import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, XMarkIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';
import { useSearch } from '../hooks/useSearch';
import { ProblemCard } from '../components/ProblemCard';
import { FilterChip } from '../components/ui/FilterChip';
import { NoteModal } from '../components/NoteModal';
import { FocusMode } from '../components/FocusMode';
import { EmptyState } from '../components/ui/EmptyState';
import { ProblemCardSkeleton } from '../components/ui/Skeleton';
import { cn } from '../utils/cn';

interface Props { externalQuery?: string; onSearchClear?: () => void; }

const DIFFS = ['All', 'Easy', 'Medium', 'Hard'] as const;
const diffColor = { All: 'default', Easy: 'easy', Medium: 'medium', Hard: 'hard' } as const;

export default function Problems({ externalQuery, onSearchClear }: Props) {
  const { query, setQuery, difficulty, setDifficulty, topic, setTopic, topics, topicCounts, difficultyCounts, filtered, reset } = useSearch(externalQuery);
  const [noteId, setNoteId] = useState<number | null>(null);
  const [focusId, setFocusId] = useState<number | null>(null);
  const [view, setView] = useState<'card' | 'row'>('card');
  const [showFilters, setShowFilters] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 300); return () => clearTimeout(t); }, []);

  const hasFilters = difficulty !== 'All' || topic !== 'All' || !!query;

  if (focusId !== null) return <FocusMode startId={focusId} onClose={() => setFocusId(null)} />;

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2.5 bg-bg-elevated border border-border-default rounded-xl px-3.5 py-2.5 focus-within:border-brand-500/50 focus-within:ring-1 focus-within:ring-brand-500/20 transition-all">
            <MagnifyingGlassIcon className="w-4 h-4 text-text-muted flex-shrink-0" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search problems, topics, companies..."
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-disabled outline-none"
            />
            {query && (
              <button onClick={() => { setQuery(''); onSearchClear?.(); }} className="text-text-muted hover:text-text-primary">
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={cn('w-10 h-10 flex items-center justify-center rounded-xl border transition-all flex-shrink-0',
              showFilters ? 'bg-brand-500/10 border-brand-500/30 text-brand-400' : 'bg-bg-elevated border-border-default text-text-muted hover:text-text-primary')}>
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
          </button>
          <div className="hidden sm:flex gap-1 bg-bg-elevated border border-border-default rounded-xl p-1">
            <button onClick={() => setView('card')} className={cn('w-8 h-8 flex items-center justify-center rounded-lg transition-all', view === 'card' ? 'bg-brand-500/20 text-brand-400' : 'text-text-muted hover:text-text-primary')}>
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button onClick={() => setView('row')} className={cn('w-8 h-8 flex items-center justify-center rounded-lg transition-all', view === 'row' ? 'bg-brand-500/20 text-brand-400' : 'text-text-muted hover:text-text-primary')}>
              <ListBulletIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="card-base p-4 space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-text-disabled uppercase tracking-widest mb-2">Difficulty</p>
                  <div className="flex gap-2 flex-wrap">
                    {DIFFS.map(d => (
                      <FilterChip key={d} label={d} count={difficultyCounts[d]} active={difficulty === d}
                        color={diffColor[d]} onClick={() => setDifficulty(d)} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-disabled uppercase tracking-widest mb-2">Topic</p>
                  <div className="flex gap-2 flex-wrap">
                    {topics.map(t => (
                      <FilterChip key={t} label={t} count={topicCounts[t]} active={topic === t} onClick={() => setTopic(t)} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <p className="text-sm text-text-muted">
            <span className="font-semibold text-text-primary font-mono">{filtered.length}</span> problems
            {hasFilters && <span> · <button onClick={reset} className="text-brand-400 hover:text-brand-300 transition-colors">clear filters</button></span>}
          </p>
        </div>

        {!loaded ? (
          <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <ProblemCardSkeleton key={i} />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="🔍" title="No problems found" subtitle="Try adjusting your search or filters" action={{ label: 'Clear filters', onClick: reset }} />
        ) : view === 'card' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
            {filtered.map((p, i) => (
              <ProblemCard key={p.id} problem={p} index={i} view="card" onNote={setNoteId} onFocus={setFocusId} />
            ))}
          </div>
        ) : (
          <div className="card-base overflow-hidden">
            <div className="hidden sm:grid grid-cols-[28px_1fr_110px_90px_140px_100px] gap-3 px-4 py-2.5 border-b border-border-subtle">
              {['', 'Title', 'Topic', 'Difficulty', 'Companies', 'Actions'].map(h => (
                <span key={h} className="text-[10px] font-bold text-text-disabled uppercase tracking-widest">{h}</span>
              ))}
            </div>
            {filtered.map((p, i) => (
              <ProblemCard key={p.id} problem={p} index={i} view="row" onNote={setNoteId} onFocus={setFocusId} />
            ))}
          </div>
        )}
      </div>

      <NoteModal problemId={noteId} onClose={() => setNoteId(null)} />
    </>
  );
}
