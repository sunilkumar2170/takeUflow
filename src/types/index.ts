export interface Problem {
  id: number;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  companies: string[];
  leetcode: string;
}

export interface ProblemState {
  solved: boolean;
  bookmarked: boolean;
  note: string;
  solvedAt?: string;
}

export interface UserStats {
  streak: number;
  lastActive: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

export type Difficulty = "All" | "Easy" | "Medium" | "Hard";
export type Tab = "dashboard" | "problems" | "topics" | "bookmarks" | "profile";
