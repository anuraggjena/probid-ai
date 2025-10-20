// components/JobList.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { jobPosts } from "@/db/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter, // Import CardFooter
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FilePen, Trash, Clock } from "lucide-react"; // Add Clock icon
import { formatDistanceToNow } from "date-fns"; // For nicer dates

type JobPost = typeof jobPosts.$inferSelect;

interface JobListProps {
  posts: JobPost[];
}

export function JobList({ posts }: JobListProps) {
  const router = useRouter();

  const handleDelete = async (postId: string) => {
    // ... (delete function remains the same)
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const response = await fetch(`/api/job-post/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      toast.success("Job post deleted successfully!");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"> {/* Added xl:grid-cols-4 */}
      {posts.map((post) => (
        <Card key={post.id} className="flex flex-col"> {/* Make card flex column */}
          <CardHeader>
            <CardTitle className="truncate">{post.title || "Untitled Job"}</CardTitle> {/* Handle untitled */}
            <CardDescription className="flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              {/* Nicer date format */}
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-3"> {/* Use flex-grow */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Tone:</span>
              <Badge variant="outline" className="capitalize">{post.tone}</Badge> {/* Capitalize tone */}
            </div>
            <div>
              <span className="font-semibold text-sm mb-1 block">Keywords:</span>
              <div className="flex gap-1 flex-wrap">
                {post.keywords?.slice(0, 4).map((kw) => ( // Show up to 4 keywords
                  <Badge key={kw} variant="secondary" className="text-xs">
                    {kw}
                  </Badge>
                ))}
                {post.keywords && post.keywords.length > 4 && (
                  <Badge variant="secondary" className="text-xs">...</Badge>
                )}
              </div>
            </div>
          </CardContent>
          {/* Move buttons to CardFooter for consistent bottom alignment */}
          <CardFooter className="flex gap-2 border-t pt-4 items-center justify-center">
             <Button asChild variant="outline" size="sm" className="w-2/3">
              <Link href={`/proposals/${post.id}`}>
                <FilePen className="mr-1 h-4 w-4" />
                View/Edit
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDelete(post.id)}
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}