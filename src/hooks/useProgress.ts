import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import problems from '../data/problems.json';
import { Problem } from '../types';

export const useProgress = () => {
  const { problemStates } = useStore();
  return useMemo(() => {
    const all = problems as Problem[];
    const total = all.length;
    const solved = Object.values(problemStates).filter(p => p.solved).length;
    const byTopic: Record<string, { total: number; solved: number }> = {};
    all.forEach(p => {
      if (!byTopic[p.topic]) byTopic[p.topic] = { total: 0, solved: 0 };
      byTopic[p.topic].total++;
      if (problemStates[p.id]?.solved) byTopic[p.topic].solved++;
    });
    const easy = all.filter(p => p.difficulty === 'Easy');
    const medium = all.filter(p => p.difficulty === 'Medium');
    const hard = all.filter(p => p.difficulty === 'Hard');
    return {
      total, solved,
      percent: Math.round((solved / total) * 100),
      byTopic,
      easy: { total: easy.length, solved: easy.filter(p => problemStates[p.id]?.solved).length },
      medium: { total: medium.length, solved: medium.filter(p => problemStates[p.id]?.solved).length },
      hard: { total: hard.length, solved: hard.filter(p => problemStates[p.id]?.solved).length },
    };
  }, [problemStates]);
};
