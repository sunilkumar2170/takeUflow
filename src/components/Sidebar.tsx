import { motion } from 'framer-motion';
import { Tab } from '../types';
import { cn } from '../utils/cn';
import { useProgress } from '../hooks/useProgress';
import { useStreak } from '../hooks/useStreak';
import { ProgressBar } from './ui/ProgressBar';

interface Props { active: Tab; onChange: (t: Tab) => void; }

const navItems = [
  { id: 'dashboard' as Tab, label: 'Dashboard', emoji: '⊞' },
  { id: 'problems' as Tab, label: 'Problems', emoji: '◈' },
  { id: 'topics' as Tab, label: 'Topics', emoji: '◉' },
  { id: 'bookmarks' as Tab, label: 'Bookmarks', emoji: '◇' },
  { id: 'profile' as Tab, label: 'Profile', emoji: '◎' },
];

export function Sidebar({ active, onChange }: Props) {
  const progress = useProgress();
  const streak = useStreak();

  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen bg-bg-surface border-r border-border-subtle flex-shrink-0">
      <div className="px-5 py-5 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-black text-sm font-mono">TU</div>
          <span className="font-bold text-text-primary text-base tracking-tight">take<span className="text-brand-400">U</span>flow</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold text-text-disabled uppercase tracking-widest px-3 mb-2">Menu</p>
        {navItems.map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => onChange(item.id)}
              className={cn('relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150',
                isActive ? 'nav-active' : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
              )}>
              {isActive && (
                <motion.div layoutId="sidebar-pill"
                  className="absolute inset-0 rounded-xl bg-brand-500/10 border border-brand-500/20"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 text-base">{item.emoji}</span>
              <span className="relative z-10">{item.label}</span>
              {item.id === 'problems' && (
                <span className="relative z-10 ml-auto font-mono text-[10px] bg-bg-elevated px-1.5 py-0.5 rounded text-text-muted">115</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-border-subtle space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-text-muted">Overall Progress</span>
            <span className="text-xs font-mono text-brand-400">{progress.percent}%</span>
          </div>
          <ProgressBar value={progress.solved} max={progress.total} color="#3b82f6" size="sm" />
          <div className="flex justify-between text-[10px] text-text-disabled font-mono mt-1">
            <span>{progress.solved} solved</span>
            <span>{progress.total} total</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-bg-elevated rounded-xl px-3 py-2.5 border border-border-subtle">
          <span className="text-xl">🔥</span>
          <div>
            <p className="text-xs font-semibold text-text-primary">{streak} day streak</p>
            <p className="text-[10px] text-text-muted">Keep it up!</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
