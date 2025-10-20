// app/(app)/dashboard/page.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, FilePlus } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { jobPosts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { JobList } from "@/components/JobList";

type JobPost = typeof jobPosts.$inferSelect;

export default async function Dashboard() {
  // --- 1. Fetch the user's job posts ---
  const { userId } = await auth();
  let posts: JobPost[] = [];
  if (userId) {
    posts = await db.query.jobPosts.findMany({
      where: eq(jobPosts.userId, userId),
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }
  // --- End of data fetching ---

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Generated Proposals
        </h1>
        <Button asChild className="ml-auto">
          <Link href="/new-proposal">
            <FilePlus className="mr-2 h-4 w-4" />
            New Proposal
          </Link>
        </Button>
      </div>

      {/* --- 2. Render either the list or the empty state --- */}
      {posts.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-3 text-center">
            <Sparkles className="h-16 w-16 text-primary" />
            <h3 className="text-2xl font-bold tracking-tight">
              No proposals yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Click &quot;New Proposal&quot; to analyze your first job post.
            </p>
          </div>
        </div>
      ) : (
        <JobList posts={posts} />
      )}
    </div>
  );
}