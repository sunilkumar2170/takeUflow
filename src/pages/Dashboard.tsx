import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '../hooks/useProgress';
import { useStreak } from '../hooks/useStreak';
import { useStore } from '../store/useStore';
import { ProgressRing } from '../components/ui/ProgressRing';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatCardSkeleton } from '../components/ui/Skeleton';
import { topicEmoji } from '../utils/helpers';
import { Tab } from '../types';
import problems from '../data/problems.json';
import { Problem } from '../types';

interface Props { onTabChange: (t: Tab) => void; onTopicSelect: (t: string) => void; }

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function Dashboard({ onTabChange, onTopicSelect }: Props) {
  const progress = useProgress();
  const streak = useStreak();
  const { problemStates } = useStore();

  const lastSolved = (problems as Problem[])
    .filter(p => problemStates[p.id]?.solved && problemStates[p.id]?.solvedAt)
    .sort((a, b) => new Date(problemStates[b.id].solvedAt!).getTime() - new Date(problemStates[a.id].solvedAt!).getTime())
    .slice(0, 1)[0];

  const topTopics = Object.entries(progress.byTopic).sort((a, b) => b[1].total - a[1].total).slice(0, 8);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">

      {lastSolved && (
        <motion.div variants={item}>
          <button onClick={() => onTabChange('problems')}
            className="w-full flex items-center gap-3 bg-brand-500/10 border border-brand-500/20 rounded-xl p-3.5 text-left hover:bg-brand-500/15 transition-colors active:scale-[0.99]">
            <span className="text-xl">▶️</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-brand-400 mb-0.5">Continue where you left off</p>
              <p className="text-sm font-medium text-text-primary truncate">{lastSolved.title}</p>
            </div>
            <span className="text-text-muted text-lg">›</span>
          </button>
        </motion.div>
      )}

      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Solved', value: progress.solved, sub: `of ${progress.total}`, color: '#3b82f6', icon: '✅' },
          { label: 'Streak', value: streak, sub: 'days', color: '#f59e0b', icon: '🔥' },
          { label: 'Easy', value: progress.easy.solved, sub: `of ${progress.easy.total}`, color: '#10b981', icon: '🟢' },
          { label: 'Hard', value: progress.hard.solved, sub: `of ${progress.hard.total}`, color: '#ef4444', icon: '🔴' },
        ].map(card => (
          <div key={card.label} className="card-base p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">{card.label}</span>
              <span className="text-base">{card.icon}</span>
            </div>
            <p className="text-2xl font-black font-mono" style={{ color: card.color }}>{card.value}</p>
            <p className="text-xs text-text-disabled font-mono mt-0.5">{card.sub}</p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={item} className="card-base p-5">
        <div className="flex items-center gap-5">
          <ProgressRing percent={progress.percent} size={88} stroke={7} color="#3b82f6">
            <span className="text-lg font-black font-mono text-text-primary">{progress.percent}%</span>
            <span className="text-[9px] text-text-disabled">done</span>
          </ProgressRing>
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-easy">Easy</span>
                <span className="font-mono text-text-muted">{progress.easy.solved}/{progress.easy.total}</span>
              </div>
              <ProgressBar value={progress.easy.solved} max={progress.easy.total} color="#10b981" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-medium">Medium</span>
                <span className="font-mono text-text-muted">{progress.medium.solved}/{progress.medium.total}</span>
              </div>
              <ProgressBar value={progress.medium.solved} max={progress.medium.total} color="#f59e0b" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-hard">Hard</span>
                <span className="font-mono text-text-muted">{progress.hard.solved}/{progress.hard.total}</span>
              </div>
              <ProgressBar value={progress.hard.solved} max={progress.hard.total} color="#ef4444" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-text-primary">Topics</h2>
          <button onClick={() => onTabChange('topics')} className="text-xs text-brand-400 font-semibold hover:text-brand-300 transition-colors">See all →</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {topTopics.map(([topic, data]) => {
            const pct = Math.round((data.solved / data.total) * 100);
            return (
              <motion.button key={topic} whileTap={{ scale: 0.97 }}
                onClick={() => { onTopicSelect(topic); onTabChange('topics'); }}
                className="card-base p-3.5 text-left hover:border-border-strong hover:bg-bg-hover active:scale-[0.98] transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xl">{topicEmoji[topic] || '📦'}</span>
                  <span className="text-[10px] font-mono font-bold text-text-muted">{pct}%</span>
                </div>
                <p className="text-xs font-semibold text-text-primary leading-tight mb-2">{topic}</p>
                <ProgressBar value={data.solved} max={data.total} color="#3b82f6" />
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
