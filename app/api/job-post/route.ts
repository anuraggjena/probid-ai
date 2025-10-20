// app/api/job-post/route.ts

import { db } from "@/lib/db";
import { jobPosts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai"; // We can still use the official OpenAI library

// --- Updated OpenAI Client for OpenRouter ---
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // Change to your site URL in production
    "X-Title": "ProBid AI", // Optional: Your app name
  },
});

// Define the shape of the AI's response
interface AnalysisResponse {
  keywords: string[];
  tone: string;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, description } = body;

    if (!description) {
      return new NextResponse("Description is required", { status: 400 });
    }

    // --- We'll use a fast and cheap model like Claude Haiku ---
    const response = await openai.chat.completions.create({
      model: "anthropic/claude-3-haiku", // A great, fast model on OpenRouter
      messages: [
        {
          role: "system",
          content: `You are an expert recruitment analyst. Analyze the following job description and return ONLY a JSON object with two keys: "keywords" (an array of the 5-10 most important technical skills or requirements) and "tone" (a single word describing the client's tone, e.g., 'formal', 'friendly', 'urgent', 'corporate'). Do not provide any other text or explanation.`,
        },
        {
          role: "user",
          content: description,
        },
      ],
      response_format: { type: "json_object" }, // This still works for many models
    });

    const analysis = JSON.parse(
      response.choices[0].message.content || "{}"
    ) as AnalysisResponse;

    if (!analysis.keywords || !analysis.tone) {
      console.error("Invalid AI Response:", response.choices[0].message.content);
      return new NextResponse("Failed to analyze job post", { status: 500 });
    }

    // 4. Save the job post and analysis to your database
    const newJobPost = await db
      .insert(jobPosts)
      .values({
        userId: userId,
        title: title || "Untitled Job Post",
        description: description,
        keywords: analysis.keywords,
        tone: analysis.tone,
      })
      .returning();

    return NextResponse.json(newJobPost[0]);
  } catch (error) {
    console.error("[JOB_POST_API]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}