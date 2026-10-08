import { Game, Friend, Review, ChatMessage } from "./types";

export const INITIAL_GAMES: Game[] = [];

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: "friend-dev-support",
    username: "Nexus_Support",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=support",
    status: "Online",
    currentActivity: "System Administration",
    bio: "Nexus Platform Technical Support & Cloud Sandbox Moderator.",
    isDeveloper: true
  }
];

export const GAME_REVIEWS: Record<string, Review[]> = {};

export const CHANNELS_FOR_GAMES: Record<string, string[]> = {
  "default": ["general-board", "developer-feedback", "system-logs"]
};

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  "general-board": [
    {
      id: "init-msg",
      username: "SystemOperator",
      avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=sysop",
      text: "Welcome to the Nexus Platform. Upload your business logic or custom HTML5 applications in the Game Studio to begin compiling live environments.",
      timestamp: "Today",
      isDeveloper: true
    }
  ],
  "developer-feedback": [],
  "system-logs": []
};
