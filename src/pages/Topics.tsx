import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useProgress } from '../hooks/useProgress';
import { useStore } from '../store/useStore';
import { ProblemCard } from '../components/ProblemCard';
import { NoteModal } from '../components/NoteModal';
import { FocusMode } from '../components/FocusMode';
import { ProgressBar } from '../components/ui/ProgressBar';
import { topicEmoji } from '../utils/helpers';
import problems from '../data/problems.json';
import { Problem } from '../types';

interface Props { initialTopic?: string; onClearTopic?: () => void; }

export default function Topics({ initialTopic, onClearTopic }: Props) {
  const progress = useProgress();
  const { getProblemState } = useStore();
  const [selected, setSelected] = useState<string | null>(initialTopic || null);
  const [noteId, setNoteId] = useState<number | null>(null);
  const [focusId, setFocusId] = useState<number | null>(null);

  const topicProblems = selected ? (problems as Problem[]).filter(p => p.topic === selected) : [];
  const data = selected ? progress.byTopic[selected] : null;
  const pct = data ? Math.round((data.solved / data.total) * 100) : 0;

  if (focusId !== null) return <FocusMode startId={focusId} onClose={() => setFocusId(null)} />;

  return (
    <>
      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div key="topic-detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => { setSelected(null); onClearTopic?.(); }}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-bg-elevated border border-border-default text-text-secondary hover:text-text-primary transition-all active:scale-95">
                <ArrowLeftIcon className="w-4 h-4" />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{topicEmoji[selected] || '📦'}</span>
                  <h1 className="font-bold text-text-primary text-lg truncate">{selected}</h1>
                </div>
                <p className="text-xs text-text-muted font-mono">{data?.solved}/{data?.total} solved · {pct}%</p>
              </div>
            </div>
            <ProgressBar value={data?.solved || 0} max={data?.total || 1} color="#3b82f6" size="md" className="mb-5" />
            <div className="space-y-3">
              {topicProblems.map((p, i) => (
                <ProblemCard key={p.id} problem={p} index={i} view="card" onNote={setNoteId} onFocus={setFocusId} />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="topic-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {Object.entries(progress.byTopic).sort((a, b) => b[1].total - a[1].total).map(([topic, data], i) => {
                const pct = Math.round((data.solved / data.total) * 100);
                const badgeColor = pct >= 80 ? 'text-easy' : pct >= 40 ? 'text-brand-400' : 'text-text-muted';
                return (
                  <motion.button key={topic}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.5) }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelected(topic)}
                    className="card-base p-4 text-left hover:border-border-strong hover:bg-bg-hover transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{topicEmoji[topic] || '📦'}</span>
                      <span className={`text-xs font-bold font-mono ${badgeColor}`}>{pct}%</span>
                    </div>
                    <p className="text-sm font-bold text-text-primary leading-snug mb-1">{topic}</p>
                    <p className="text-xs text-text-disabled font-mono mb-3">{data.solved} / {data.total}</p>
                    <ProgressBar value={data.solved} max={data.total} color="#3b82f6" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <NoteModal problemId={noteId} onClose={() => setNoteId(null)} />
    </>
  );
}
