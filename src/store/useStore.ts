import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProblemState, UserStats } from "../types";

interface Store {
  problemStates: Record<number, ProblemState>;
  stats: UserStats;
  darkMode: boolean;
  toggleSolved: (id: number) => void;
  toggleBookmark: (id: number) => void;
  setNote: (id: number, note: string) => void;
  toggleDarkMode: () => void;
  checkStreak: () => void;
  getProblemState: (id: number) => ProblemState;
}

const defaultProblemState: ProblemState = {
  solved: false,
  bookmarked: false,
  note: "",
};

const defaultStats: UserStats = {
  streak: 0,
  lastActive: "",
  totalSolved: 0,
  easySolved: 0,
  mediumSolved: 0,
  hardSolved: 0,
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      problemStates: {},
      stats: defaultStats,
      darkMode: true,

      getProblemState: (id: number) => {
        return get().problemStates[id] || { ...defaultProblemState };
      },

      toggleSolved: (id: number) => {
        set((state) => {
          const current = state.problemStates[id] || { ...defaultProblemState };
          const nowSolved = !current.solved;
          const newStates = {
            ...state.problemStates,
            [id]: {
              ...current,
              solved: nowSolved,
              solvedAt: nowSolved ? new Date().toISOString() : undefined,
            },
          };
          const allSolved = Object.values(newStates).filter((p) => p.solved);
          return {
            problemStates: newStates,
            stats: {
              ...state.stats,
              totalSolved: allSolved.length,
            },
          };
        });
        get().checkStreak();
      },

      toggleBookmark: (id: number) => {
        set((state) => {
          const current = state.problemStates[id] || { ...defaultProblemState };
          return {
            problemStates: {
              ...state.problemStates,
              [id]: { ...current, bookmarked: !current.bookmarked },
            },
          };
        });
      },

      setNote: (id: number, note: string) => {
        set((state) => {
          const current = state.problemStates[id] || { ...defaultProblemState };
          return {
            problemStates: {
              ...state.problemStates,
              [id]: { ...current, note },
            },
          };
        });
      },

      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }));
      },

      checkStreak: () => {
        set((state) => {
          const today = new Date().toDateString();
          const last = state.stats.lastActive;
          if (last === today) return state;
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          const newStreak = last === yesterday ? state.stats.streak + 1 : 1;
          return {
            stats: {
              ...state.stats,
              streak: newStreak,
              lastActive: today,
            },
          };
        });
      },
    }),
    {
      name: "takeUflow-storage",
    }
  )
);
