import { useState, useMemo, useEffect } from 'react';
import problems from '../data/problems.json';
import { Problem, Difficulty } from '../types';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export const useSearch = (externalQuery?: string) => {
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('All');
  const [topic, setTopic] = useState('All');
  const activeQuery = externalQuery !== undefined ? externalQuery : query;
  const debouncedQuery = useDebounce(activeQuery, 200);

  const topics = useMemo(() => {
    const t = Array.from(new Set((problems as Problem[]).map(p => p.topic)));
    return ['All', ...t.sort()];
  }, []);

  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = { All: (problems as Problem[]).length };
    (problems as Problem[]).forEach(p => { counts[p.topic] = (counts[p.topic] || 0) + 1; });
    return counts;
  }, []);

  const difficultyCounts = useMemo(() => {
    const counts: Record<string, number> = { All: 0, Easy: 0, Medium: 0, Hard: 0 };
    (problems as Problem[]).forEach(p => { counts[p.difficulty]++; counts.All++; });
    return counts;
  }, []);

  const filtered = useMemo(() => {
    return (problems as Problem[]).filter(p => {
      const q = debouncedQuery.toLowerCase();
      const matchQuery = !q || p.title.toLowerCase().includes(q) || p.topic.toLowerCase().includes(q) || p.companies.some(c => c.toLowerCase().includes(q));
      const matchDiff = difficulty === 'All' || p.difficulty === difficulty;
      const matchTopic = topic === 'All' || p.topic === topic;
      return matchQuery && matchDiff && matchTopic;
    });
  }, [debouncedQuery, difficulty, topic]);

  const reset = () => { setQuery(''); setDifficulty('All'); setTopic('All'); };
  return { query, setQuery, difficulty, setDifficulty, topic, setTopic, topics, topicCounts, difficultyCounts, filtered, reset };
};
