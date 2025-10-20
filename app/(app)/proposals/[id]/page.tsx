// app/(app)/proposals/[id]/page.tsx
import { db } from "@/lib/db";
import { jobPosts, portfolios, proposals } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProposalEditor } from "@/components/ProposalEditor";

export const dynamic = "force-dynamic"; // ensures SSR for this page

// Properly type the route params
interface ProposalPageProps {
  params: {
    id: string;
  };
}

export default async function ProposalPage({ params }: ProposalPageProps) {
  const { userId } = await auth();
  if (!userId) return notFound();

  // --- Fetch the Job Post ---
  const jobPost = await db.query.jobPosts.findFirst({
    where: eq(jobPosts.id, params.id),
  });

  if (!jobPost || jobPost.userId !== userId) {
    console.error(`Job post not found or user mismatch. ID: ${params.id}, UserID: ${userId}`);
    return notFound();
  }

  // --- Fetch the User's Portfolio ---
  const portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.userId, userId),
  });

  // --- Fetch existing proposals for this job ---
  const existingProposals = await db.query.proposals.findMany({
    where: eq(proposals.jobPostId, params.id),
    orderBy: (proposals, { desc }) => [desc(proposals.createdAt)],
  });

  return (
    <ProposalEditor
      jobPost={jobPost}
      portfolio={portfolio || null}
      initialProposal={existingProposals[0] || null}
    />
  );
}
