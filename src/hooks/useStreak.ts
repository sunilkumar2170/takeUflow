import { useEffect } from 'react';
import { useStore } from '../store/useStore';
export const useStreak = () => {
  const { stats, checkStreak } = useStore();
  useEffect(() => { checkStreak(); }, []);
  return stats.streak;
};
