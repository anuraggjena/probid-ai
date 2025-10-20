// app/api/score-proposal/route.ts

import { db } from "@/lib/db";
import { proposals } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { pipeline, cos_sim, FeatureExtractionPipeline } from "@xenova/transformers";

let extractor: FeatureExtractionPipeline | null = null;

// Initialize or reuse the extractor model
async function getExtractor(): Promise<FeatureExtractionPipeline> {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return extractor;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { proposalId } = body;
    if (!proposalId) return new NextResponse("Proposal ID is required", { status: 400 });

    // Fetch proposal with its job post
    const proposal = await db.query.proposals.findFirst({
      where: eq(proposals.id, proposalId),
      with: { jobPost: true },
    });

    if (!proposal || proposal.userId !== userId)
      return new NextResponse("Proposal not found", { status: 404 });
    if (!proposal.jobPost || !proposal.content)
      return new NextResponse("Invalid proposal data", { status: 400 });

    // Extract embeddings
    const model = await getExtractor();

    const jobTensor = await model(proposal.jobPost.description, { pooling: "mean", normalize: true });
    const proposalTensor = await model(proposal.content, { pooling: "mean", normalize: true });

    // Convert Float32Array to number[]
    const jobEmbedding: number[] = Array.from(jobTensor.data as Float32Array);
    const proposalEmbedding: number[] = Array.from(proposalTensor.data as Float32Array);

    // Calculate similarity
    const score = cos_sim(jobEmbedding, proposalEmbedding);
    const percentageScore = Math.round(score * 100);

    // Save to DB
    const updatedProposal = await db
      .update(proposals)
      .set({ score: percentageScore })
      .where(eq(proposals.id, proposalId))
      .returning();

    return NextResponse.json(updatedProposal[0]);
  } catch (error) {
    console.error("[SCORE_PROPOSAL_API]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
