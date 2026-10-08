export interface Game {
  id: string;
  title: string;
  creator: string;
  creatorId: string;
  description: string;
  longDescription?: string;
  tags: string[];
  bannerUrl: string;
  rating: number; // percentage, e.g., 94
  activePlayers: number;
  totalPlays: number;
  releaseDate: string;
  isCustomAI?: boolean;
  aiPrompt?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  isHtmlGame?: boolean;
  htmlUrl?: string;
  htmlContent?: string;
  physicalHtmlUrl?: string;
  // Game adjustable parameters for Sandbox
  parameters?: {
    speed: number;
    gravity: number;
    colorTheme: {
      background: string;
      primary: string;
      accent: string;
    };
    obstacleFrequency: number;
    maxLives: number;
    shootCapabilities: boolean;
    bossFight?: boolean;
  };
}

export interface Friend {
  id: string;
  username: string;
  avatar: string;
  status: 'Online' | 'Offline' | 'In Game' | 'In Studio';
  currentActivity?: string; // e.g. "Playing Space Odyssey"
  bio: string;
  isDeveloper: boolean;
}

export interface Review {
  id: string;
  username: string;
  avatar: string;
  isPositive: boolean;
  content: string;
  playtimeHours: number;
  date: string;
}

export interface ChatMessage {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  isDeveloper?: boolean;
}

export interface VoiceUser {
  id: string;
  username: string;
  avatar: string;
  isMuted: boolean;
  isSpeaking: boolean;
}

export interface ConsoleLogMsg {
  id: string;
  method: "log" | "error" | "warn" | "info";
  args: string[];
  timestamp: string;
}

export interface QuestState {
  storyText: string;
  choices: string[];
  health: number;
  maxHealth: number;
  mana: number;
  gold: number;
  inventory: string[];
  avatarUrl?: string;
  isGameOver: boolean;
  previousLog: string[];
}
