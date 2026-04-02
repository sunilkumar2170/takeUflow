import { motion } from 'framer-motion';
import { BookmarkIcon, CheckCircleIcon, ArrowTopRightOnSquareIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid, CheckCircleIcon as CheckSolid } from '@heroicons/react/24/solid';
import { Badge } from './ui/Badge';
import { cn } from '../utils/cn';
import { useStore } from '../store/useStore';
import type { Problem } from '../types';

interface Props {
  problem: Problem;
  index?: number;
  view?: 'card' | 'row';
  onNote?: (id: number) => void;
  onFocus?: (id: number) => void;
}

const diffVariant = (d: string): 'easy' | 'medium' | 'hard' => {
  if (d === 'Easy') return 'easy';
  if (d === 'Medium') return 'medium';
  return 'hard';
};

export function ProblemCard({ problem, index = 0, view = 'card', onNote, onFocus }: Props) {
  const { getProblemState, toggleSolved, toggleBookmark } = useStore();
  const state = getProblemState(problem.id);

  if (view === 'row') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.4) }}
        className={cn(
          'grid items-center gap-3 px-4 py-3 border-b border-border-subtle hover:bg-bg-hover transition-colors duration-150 group',
          'grid-cols-[28px_1fr_110px_90px_140px_100px]',
          state.solved && 'opacity-60'
        )}
      >
        <button onClick={() => toggleSolved(problem.id)} className="flex items-center justify-center w-7 h-7">
          {state.solved
            ? <CheckSolid className="w-5 h-5 text-easy" />
            : <CheckCircleIcon className="w-5 h-5 text-text-muted group-hover:text-text-secondary transition-colors" />}
        </button>
        <div>
          <p className={cn('text-sm font-medium truncate', state.solved ? 'text-text-muted line-through' : 'text-text-primary')}>{problem.title}</p>
        </div>
        <p className="text-xs text-text-muted truncate">{problem.topic}</p>
        <Badge variant={diffVariant(problem.difficulty)}>{problem.difficulty}</Badge>
        <div className="flex gap-1 overflow-hidden">
          {problem.companies.slice(0, 2).map(c => (
            <span key={c} className="text-[10px] font-mono bg-bg-elevated border border-border-subtle px-1.5 py-0.5 rounded text-text-muted whitespace-nowrap">{c}</span>
          ))}
        </div>
        <div className="flex gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => toggleBookmark(problem.id)} className="p-1.5 rounded hover:bg-bg-elevated transition-colors">
            {state.bookmarked ? <BookmarkSolid className="w-3.5 h-3.5 text-brand-400" /> : <BookmarkIcon className="w-3.5 h-3.5 text-text-muted" />}
          </button>
          {onNote && (
            <button onClick={() => onNote(problem.id)} className="p-1.5 rounded hover:bg-bg-elevated transition-colors">
              <DocumentTextIcon className={cn('w-3.5 h-3.5', state.note ? 'text-brand-400' : 'text-text-muted')} />
            </button>
          )}
          {onFocus && (
            <button onClick={() => onFocus(problem.id)} className="px-2 py-1 text-[11px] font-semibold rounded bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-colors">Focus</button>
          )}
          <a href={problem.leetcode} target="_blank" rel="noreferrer"
            className="p-1.5 rounded hover:bg-bg-elevated transition-colors">
            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 text-text-muted hover:text-brand-400 transition-colors" />
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.5) }}
      whileTap={{ scale: 0.98 }}
      className={cn('card-base p-4 hover:border-border-strong hover:bg-bg-hover active:scale-[0.99]', state.solved && 'opacity-70')}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <button
              onClick={() => toggleSolved(problem.id)}
              className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full"
            >
              {state.solved
                ? <CheckSolid className="w-5 h-5 text-easy" />
                : <CheckCircleIcon className="w-5 h-5 text-text-muted" />}
            </button>
            <p className={cn('text-sm font-semibold leading-snug', state.solved ? 'text-text-muted line-through' : 'text-text-primary')}>
              {problem.title}
            </p>
          </div>
          <p className="text-xs text-text-muted mt-1 ml-7">{problem.topic}</p>
        </div>
        <Badge variant={diffVariant(problem.difficulty)}>{problem.difficulty}</Badge>
      </div>

      <div className="flex items-center justify-between ml-7">
        <div className="flex gap-1.5 flex-wrap">
          {problem.companies.slice(0, 3).map(c => (
            <span key={c} className="text-[10px] font-mono bg-bg-elevated border border-border-subtle px-1.5 py-0.5 rounded text-text-muted">{c}</span>
          ))}
        </div>
        <div className="flex gap-1 items-center flex-shrink-0">
          <button
            onClick={() => toggleBookmark(problem.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-elevated active:scale-90 transition-all"
          >
            {state.bookmarked ? <BookmarkSolid className="w-4 h-4 text-brand-400" /> : <BookmarkIcon className="w-4 h-4 text-text-muted" />}
          </button>
          {onNote && (
            <button onClick={() => onNote(problem.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-elevated active:scale-90 transition-all">
              <DocumentTextIcon className={cn('w-4 h-4', state.note ? 'text-brand-400' : 'text-text-muted')} />
            </button>
          )}
          <a
            href={problem.leetcode} target="_blank" rel="noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-brand-400 bg-brand-500/10 border border-brand-500/20 hover:bg-brand-500/20 active:scale-95 transition-all"
          >
            Solve <ArrowTopRightOnSquareIcon className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
