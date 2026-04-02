import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckSolid, BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { useStore } from '../store/useStore';
import { Badge } from './ui/Badge';
import problems from '../data/problems.json';
import { Problem } from '../types';
import { cn } from '../utils/cn';

interface Props { startId: number; onClose: () => void; }

const diffVariant = (d: string): 'easy' | 'medium' | 'hard' => d === 'Easy' ? 'easy' : d === 'Medium' ? 'medium' : 'hard';

export function FocusMode({ startId, onClose }: Props) {
  const all = problems as Problem[];
  const [index, setIndex] = useState(() => Math.max(0, all.findIndex(p => p.id === startId)));
  const [dir, setDir] = useState(1);
  const { getProblemState, toggleSolved, toggleBookmark } = useStore();
  const problem = all[index];
  const state = getProblemState(problem.id);

  const go = (next: number) => { setDir(next > index ? 1 : -1); setIndex(next); };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: '#070b14' }}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
        <button onClick={onClose} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
          <XMarkIcon className="w-4 h-4" /> Exit Focus
        </button>
        <span className="font-mono text-xs text-text-muted">{index + 1} / {all.length}</span>
        <div className="flex gap-2">
          <button onClick={() => go(Math.max(0, index - 1))} disabled={index === 0} className="w-8 h-8 flex items-center justify-center rounded-lg bg-bg-elevated border border-border-default text-text-secondary hover:text-text-primary disabled:opacity-30 transition-all">
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button onClick={() => go(Math.min(all.length - 1, index + 1))} disabled={index === all.length - 1} className="w-8 h-8 flex items-center justify-center rounded-lg bg-bg-elevated border border-border-default text-text-secondary hover:text-text-primary disabled:opacity-30 transition-all">
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={problem.id}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full max-w-xl"
          >
            <div className="bg-bg-elevated border border-border-default rounded-2xl p-8 text-center">
              <div className="mb-4">
                <Badge variant={diffVariant(problem.difficulty)} className="text-sm px-3 py-1">{problem.difficulty}</Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3 leading-tight">{problem.title}</h1>
              <p className="text-text-muted text-sm mb-6">{problem.topic}</p>

              <div className="flex flex-wrap gap-2 justify-center mb-8">
                {problem.companies.map(c => (
                  <span key={c} className="text-xs font-mono bg-bg-surface border border-border-subtle px-2.5 py-1 rounded-lg text-text-muted">{c}</span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={problem.leetcode} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-all active:scale-95">
                  Open LeetCode <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                </a>
                <button onClick={() => toggleSolved(problem.id)}
                  className={cn('flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all active:scale-95',
                    state.solved ? 'bg-easy/10 border-easy/30 text-easy' : 'bg-bg-hover border-border-default text-text-secondary hover:text-text-primary')}>
                  {state.solved ? <><CheckSolid className="w-4 h-4" /> Solved</> : <><CheckCircleIcon className="w-4 h-4" /> Mark Solved</>}
                </button>
                <button onClick={() => toggleBookmark(problem.id)}
                  className={cn('flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border transition-all active:scale-95',
                    state.bookmarked ? 'bg-brand-500/10 border-brand-500/30 text-brand-400' : 'bg-bg-hover border-border-default text-text-secondary hover:text-text-primary')}>
                  {state.bookmarked ? <><BookmarkSolid className="w-4 h-4" /> Saved</> : <><BookmarkIcon className="w-4 h-4" /> Save</>}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-5 py-4 border-t border-border-subtle">
        <div className="w-full bg-bg-hover rounded-full h-1 overflow-hidden">
          <motion.div
            className="h-full bg-brand-500 rounded-full"
            animate={{ width: `${((index + 1) / all.length) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        <p className="text-center text-xs text-text-disabled mt-2 font-mono">{Math.round(((index + 1) / all.length) * 100)}% through</p>
      </div>
    </motion.div>
  );
}
