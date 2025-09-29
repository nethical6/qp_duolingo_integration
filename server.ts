import { Bao, Context } from "baojs";
import { readFileSync } from "fs";
import type { QuestRequest, CreateQuestPayload, QuestResponse } from "./types";
import { env } from "process";

const app = new Bao();
app.get("/", (ctx: Context) => {
  const html = readFileSync("index.html", "utf-8");
  ctx.res?.headers.set("Content-Type", "text/html");
  ctx.sendRaw(new Response(html, { headers: { "Content-Type": "text/html" } }));
  return ctx;
});

app.post("/generate-quest", async (ctx) => {
  const body = await ctx.req.json() as QuestRequest;

  console.log("Received request to /generate-quest"  + JSON.stringify(body));
  try {
    const questPayload: CreateQuestPayload = {
      apiKey: env.QP_API_KEY || "",
      token: body.token,
      title: "Duolingo Quest",
      instructions: "Complete your daily Duolingo lesson",
      reward: 5,
      quest_json: JSON.stringify({  // ← Stringify this!
        webviewUrl: "https://nethical6.github.io/qp_duolingo_integration/profile",
        username: body.username
      }),
      selected_days: JSON.stringify(body.days),  // ← Stringify this!
      time_range: JSON.stringify([  // ← Stringify this!
        parseInt(body.startTime.split(":")[0]),
        parseInt(body.endTime.split(":")[0])
      ])
    };

    console.log("Sending request to questphone API with payload: " + JSON.stringify(questPayload));
    const response = await fetch("http://localhost:8000/api/create-quest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(questPayload)
    });
    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Unexpected response content-type: ${contentType}`);
    }

    const responseRaw = await response.json() ;
    
    const responseData = responseRaw as Record<string, unknown>;
    
    if (responseData.hasOwnProperty("error")) {
      const failresp: QuestResponse = {
      success: false,
      message: responseData.error as string || "Unknown error from questphone API",
      };
      return ctx.sendJson(failresp);
    }

    console.log("Quest generated successfully: " + JSON.stringify(responseData));

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

app.listen({ port: 2000 });
