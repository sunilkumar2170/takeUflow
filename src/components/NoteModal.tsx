import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useStore } from '../store/useStore';
import problems from '../data/problems.json';
import { Problem } from '../types';
import { Badge } from './ui/Badge';

interface Props {
  problemId: number | null;
  onClose: () => void;
}

const diffVariant = (d: string): 'easy' | 'medium' | 'hard' => d === 'Easy' ? 'easy' : d === 'Medium' ? 'medium' : 'hard';

export function NoteModal({ problemId, onClose }: Props) {
  const { getProblemState, setNote } = useStore();
  const [text, setText] = useState('');
  const problem = problemId ? (problems as Problem[]).find(p => p.id === problemId) : null;

  useEffect(() => {
    if (problemId) setText(getProblemState(problemId).note || '');
  }, [problemId]);

  const handleSave = () => { if (problemId) { setNote(problemId, text); onClose(); } };

  return (
    <AnimatePresence>
      {problemId && problem && (
        <motion.div
          key="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            key="modal-box"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={e => e.stopPropagation()}
            className="w-full sm:max-w-lg bg-bg-elevated border border-border-default rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-elevated"
          >
            <div className="flex items-start justify-between p-5 pb-3 border-b border-border-subtle">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-base font-bold text-text-primary">Notes</h2>
                  <Badge variant={diffVariant(problem.difficulty)}>{problem.difficulty}</Badge>
                </div>
                <p className="text-sm text-text-muted line-clamp-1">{problem.title}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-bg-hover hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-all flex-shrink-0 ml-3">
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Write your approach, key insights, time/space complexity..."
                rows={7}
                autoFocus
                className="w-full bg-bg-surface border border-border-default rounded-xl p-4 text-sm text-text-primary placeholder:text-text-disabled resize-none outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all leading-relaxed font-mono"
              />
              <div className="flex gap-3 mt-3 justify-end">
                <button onClick={onClose} className="btn-ghost px-4 py-2 text-sm">Cancel</button>
                <button onClick={handleSave} className="btn-primary">Save Note</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
