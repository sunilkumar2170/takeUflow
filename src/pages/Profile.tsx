import { motion } from 'framer-motion';
import { useProgress } from '../hooks/useProgress';
import { useStore } from '../store/useStore';
import { useStreak } from '../hooks/useStreak';
import { ProgressRing } from '../components/ui/ProgressRing';
import { ProgressBar } from '../components/ui/ProgressBar';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function Profile() {
  const progress = useProgress();
  const { problemStates } = useStore();
  const streak = useStreak();
  const noteCount = Object.values(problemStates).filter(p => p.note?.length > 0).length;
  const bookmarkCount = Object.values(problemStates).filter(p => p.bookmarked).length;

  const reset = () => {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      localStorage.removeItem('takeUflow-storage');
      window.location.reload();
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4 pb-6">
      <motion.div variants={item} className="card-base p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-black text-lg flex-shrink-0">TU</div>
        <div>
          <h1 className="font-bold text-text-primary text-base">takeUflow</h1>
          <p className="text-xs text-text-muted">DSA Practice Tracker</p>
        </div>
        <div className="ml-auto">
          <ProgressRing percent={progress.percent} size={56} stroke={5} color="#3b82f6">
            <span className="text-[11px] font-black font-mono text-text-primary">{progress.percent}%</span>
          </ProgressRing>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Streak', value: streak, suffix: '🔥', color: '#f59e0b' },
          { label: 'Solved', value: progress.solved, suffix: '', color: '#3b82f6' },
          { label: 'Notes', value: noteCount, suffix: '📝', color: '#8b5cf6' },
          { label: 'Saved', value: bookmarkCount, suffix: '🔖', color: '#10b981' },
        ].map(s => (
          <div key={s.label} className="card-base p-4 text-center">
            <p className="text-2xl font-black font-mono" style={{ color: s.color }}>{s.value}{s.suffix}</p>
            <p className="text-xs text-text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={item} className="card-base p-5 space-y-4">
        <h2 className="text-xs font-bold text-text-disabled uppercase tracking-widest">Difficulty Progress</h2>
        {[
          { label: 'Easy', solved: progress.easy.solved, total: progress.easy.total, color: '#10b981' },
          { label: 'Medium', solved: progress.medium.solved, total: progress.medium.total, color: '#f59e0b' },
          { label: 'Hard', solved: progress.hard.solved, total: progress.hard.total, color: '#ef4444' },
        ].map(d => (
          <div key={d.label}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold" style={{ color: d.color }}>{d.label}</span>
              <span className="font-mono text-text-muted">{d.solved}/{d.total}</span>
            </div>
            <ProgressBar value={d.solved} max={d.total} color={d.color} size="md" />
          </div>
        ))}
      </motion.div>

      <motion.div variants={item} className="card-base p-5 space-y-0">
        <h2 className="text-xs font-bold text-text-disabled uppercase tracking-widest mb-3">Stats</h2>
        {[
          { label: 'Total Problems', value: progress.total },
          { label: 'Overall Progress', value: `${progress.percent}%` },
          { label: 'Current Streak', value: `${streak} days` },
          { label: 'Notes Written', value: noteCount },
          { label: 'Bookmarked', value: bookmarkCount },
        ].map((s, i, arr) => (
          <div key={s.label} className={`flex justify-between items-center py-3 ${i < arr.length - 1 ? 'border-b border-border-subtle' : ''}`}>
            <span className="text-sm text-text-secondary">{s.label}</span>
            <span className="text-sm font-bold font-mono text-text-primary">{s.value}</span>
          </div>
        ))}
      </motion.div>

      <motion.div variants={item} className="card-base p-5">
        <h2 className="text-xs font-bold text-text-disabled uppercase tracking-widest mb-3">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text-primary">Reset all progress</p>
            <p className="text-xs text-text-muted">This action cannot be undone</p>
          </div>
          <button onClick={reset} className="px-4 py-2 rounded-xl bg-hard/10 border border-hard/25 text-hard text-sm font-semibold hover:bg-hard/20 transition-colors active:scale-95">
            Reset
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
