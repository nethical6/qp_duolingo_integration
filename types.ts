/// <reference lib="dom" />

export interface QuestRequest {
  token: string;
  username: string;
  days: string[];
  startTime: string;
  endTime: string;
}

export interface CreateQuestPayload {
  apiKey: string;
  token: string;
  title: string;
  instructions: string;
  reward: number;
  quest_json: {
    webviewUrl: string;
    username: string;
  };
  selected_days: string[];
  time_range: number[];
}

export interface QuestResponse {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  message: string;
}
