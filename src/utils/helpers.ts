export const difficultyConfig = {
  Easy: { className: 'diff-easy', color: '#10b981' },
  Medium: { className: 'diff-medium', color: '#f59e0b' },
  Hard: { className: 'diff-hard', color: '#ef4444' },
} as const;

export const topicIcon: Record<string, string> = {
  Arrays: '▦', Stack: '⊟', 'Binary Search': '⊕', 'Linked List': '⊗',
  Trees: '⊜', Graphs: '⊛', 'Dynamic Programming': '◈', Strings: '⊞',
  Backtracking: '↺', Heap: '△', Trie: '⊕', Intervals: '⊡',
  'Two Pointers': '⊶', 'Sliding Window': '⊷', 'Bit Manipulation': '⊸', Math: '∑',
};

export const topicEmoji: Record<string, string> = {
  Arrays: '🧩', Stack: '📚', 'Binary Search': '🔍', 'Linked List': '🔗',
  Trees: '🌲', Graphs: '🕸️', 'Dynamic Programming': '💡', Strings: '🔤',
  Backtracking: '↩️', Heap: '🏔️', Trie: '🌳', Intervals: '📏',
  'Two Pointers': '👆', 'Sliding Window': '🪟', 'Bit Manipulation': '⚙️', Math: '➕',
};
