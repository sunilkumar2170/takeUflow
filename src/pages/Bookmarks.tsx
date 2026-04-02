import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ProblemCard } from '../components/ProblemCard';
import { NoteModal } from '../components/NoteModal';
import { FocusMode } from '../components/FocusMode';
import { EmptyState } from '../components/ui/EmptyState';
import problems from '../data/problems.json';
import { Problem } from '../types';

export default function Bookmarks() {
  const { problemStates } = useStore();
  const [noteId, setNoteId] = useState<number | null>(null);
  const [focusId, setFocusId] = useState<number | null>(null);
  const bookmarked = (problems as Problem[]).filter(p => problemStates[p.id]?.bookmarked);

  if (focusId !== null) return <FocusMode startId={focusId} onClose={() => setFocusId(null)} />;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-text-primary">Bookmarks</h1>
          <p className="text-xs text-text-muted font-mono">{bookmarked.length} saved</p>
        </div>
      </div>

      {bookmarked.length === 0 ? (
        <EmptyState icon="🔖" title="No bookmarks yet" subtitle="Tap the bookmark icon on any problem to save it here" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3">
          {bookmarked.map((p, i) => (
            <ProblemCard key={p.id} problem={p} index={i} view="card" onNote={setNoteId} onFocus={setFocusId} />
          ))}
        </div>
      )}

      <NoteModal problemId={noteId} onClose={() => setNoteId(null)} />
    </>
  );
}
