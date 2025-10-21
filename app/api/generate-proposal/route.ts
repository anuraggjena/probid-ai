// app/api/generate-proposal/route.ts

import { db } from "@/lib/db";
import { jobPosts, portfolios, proposals } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// --- Updated OpenAI Client for OpenRouter ---
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL, // Change to your site URL in production
    "X-Title": "ProBid AI", // Optional: Your app name
  },
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { jobPostId, tone } = body;

    if (!jobPostId) {
      return new NextResponse("Job Post ID is required", { status: 400 });
    }

    const jobPost = await db.query.jobPosts.findFirst({
      where: eq(jobPosts.id, jobPostId),
    });
    if (!jobPost) {
      return new NextResponse("Job Post not found", { status: 404 });
    }

    const portfolio = await db.query.portfolios.findFirst({
      where: eq(portfolios.userId, userId),
    });
    if (!portfolio || !portfolio.parsedText) {
      return new NextResponse("Portfolio not found. Please add one.", {
        status: 400,
      });
    }

    // --- Master Prompt (Slightly tuned for Claude) ---
    const prompt = `
      You are ProBid AI, an expert proposal writer for freelancers.
      Your task is to write a compelling, personalized proposal.

      Here is the client's job post:
      <job_post>
      Title: ${jobPost.title}
      Description: ${jobPost.description}
      Keywords to include: ${jobPost.keywords?.join(", ")}
      Required Tone: ${tone || jobPost.tone}
      </job_post>

      Here is the freelancer's portfolio/resume:
      <portfolio>
      ${portfolio.parsedText}
      </portfolio>

      Please write a professional and persuasive proposal that:
      1. Directly addresses the client's job post.
      2. Matches the required tone (${tone || jobPost.tone}).
      3. Uses the keywords naturally.
      4. Highlights the freelancer's most RELEVANT skills and projects from their portfolio.
      5. Is ready to be sent. **IMPORTANT: Do not include any notes, explanations, or surrounding text. Just output the proposal text itself.**
    `;

    // 5. Call OpenRouter
    const response = await openai.chat.completions.create({
      model: "anthropic/claude-3-haiku", // Using Haiku again
      messages: [
        {
          role: "user", // Claude models often prefer a single user prompt
          content: prompt,
        },
      ],
    });

    const proposalContent = response.choices[0].message.content;
    if (!proposalContent) {
      return new NextResponse("Failed to generate proposal", { status: 500 });
    }

    // 6. Save the new proposal to the database
    const newProposal = await db
      .insert(proposals)
      .values({
        userId: userId,
        jobPostId: jobPostId,
        content: proposalContent,
        tone: tone || jobPost.tone || "persuasive",
        score: 0, // We'll add scoring later
      })
      .returning();

    return NextResponse.json(newProposal[0]);
  } catch (error) {
    console.error("[PROPOSAL_GENERATE_API]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}