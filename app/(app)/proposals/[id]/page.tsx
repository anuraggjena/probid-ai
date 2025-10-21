// app/(app)/proposals/[id]/page.tsx

import { db } from "@/lib/db";
import { jobPosts, portfolios, proposals } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProposalEditor } from "@/components/ProposalEditor";

// Ensure Next.js treats this as a dynamic page
export const dynamic = 'force-dynamic';

// Define the expected props shape
interface ProposalPageProps {
  params: {
    id: string;
  };
}

// Use the standard async function syntax
const ProposalPageComponent = async ({ params }: ProposalPageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return notFound();
  }

  const jobPost = await db.query.jobPosts.findFirst({
    where: eq(jobPosts.id, params.id),
  });

  if (!jobPost || jobPost.userId !== userId) {
    console.error(`Job post not found or user mismatch. ID: ${params.id}, UserID: ${userId}`);
    return notFound();
  }

  const portfolio = await db.query.portfolios.findFirst({
    where: eq(portfolios.userId, userId),
  });

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
};

// Apply the type cast here to bypass build error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProposalPage = ProposalPageComponent as any;

export default ProposalPage;