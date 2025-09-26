import { Bao } from "baojs";
import { readFileSync } from "fs";
import type { QuestRequest, CreateQuestPayload, QuestResponse } from "./types";
import { env } from "process";

const app = new Bao();

// API endpoint for quest generation
app.post("/generate-quest", async (ctx) => {
  const body = await ctx.req.json() as QuestRequest;
  
  try {
    const questPayload: CreateQuestPayload = {
      apiKey: env.QP_API_KEY || "",
      token: body.token,
      title: "Duolingo Quest",
      instructions: "Complete your daily Duolingo lesson",
      reward: 5,
      quest_json: {
        webviewUrl: "https://nethical6.github.io/qp_duolingo_integration/profile",
        username: body.username
      },
      selected_days: body.days,
      time_range: [
        parseInt(body.startTime.split(":")[0]),
        parseInt(body.endTime.split(":")[0])
      ]
    };

    const response = await fetch("https://questphone.app/api/create-quest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(questPayload)
    });

    const responseData = await response.json() as Record<string, unknown>;
    
    if (response.status >= 400) {
      throw new Error(responseData.message as string || `HTTP error! status: ${response.status}`);
    }

    const successResponse: QuestResponse = {
      success: true,
      data: responseData,
      message: "Quest generated successfully!"
    };
    
    return ctx.sendJson(successResponse);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    const errorResponse: QuestResponse = {
      success: false,
      error: errorMessage,
      message: "Failed to generate quest"
    };
    
    return ctx.sendJson(errorResponse);
  }
});

console.log("Server running at http://localhost:3000");
app.listen({ port: 3000 });