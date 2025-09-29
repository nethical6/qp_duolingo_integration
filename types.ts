/// <reference lib="dom" />

export interface QuestRequest {
  username: string;
  token: string;
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
  quest_json: string;
  selected_days: string;
  time_range: string;
}

export interface QuestResponse {
  success: boolean;
  data?: Record<string, unknown>;
  message: string;
}
