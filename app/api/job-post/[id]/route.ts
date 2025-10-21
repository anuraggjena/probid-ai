// app/api/job-post/[id]/route.ts

import { db } from "@/lib/db";
import { jobPosts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Define the expected shape for params directly
interface DeleteParams {
  id: string;
}

// Define the handler function separately
const handleDelete = async (
  req: Request,
  { params }: { params: DeleteParams }
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return new NextResponse("Job Post ID is required", { status: 400 });
    }

    const deletedPost = await db
      .delete(jobPosts)
      .where(and(eq(jobPosts.id, id), eq(jobPosts.userId, userId)))
      .returning();

    if (deletedPost.length === 0) {
      return new NextResponse("Job Post not found or unauthorized", {
        status: 404,
      });
    }

    return NextResponse.json(deletedPost[0]);
  } catch (error) {
    console.error("[JOB_POST_DELETE_API]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// Export the handler with the type cast applied
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DELETE = handleDelete as any;