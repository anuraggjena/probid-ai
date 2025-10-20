// app/(app)/new-proposal/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label"; // <-- We need this
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { jobPosts } from "@/db/schema"; // Import the type

// We need the Label component
// Run: npx shadcn-ui@latest add label

// Define the type for the API response
type NewJobPost = typeof jobPosts.$inferInsert;

export default function NewProposalPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!description) {
      toast.error("Job description is required.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/job-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze job post");
      }

      const newJobPost = (await response.json()) as NewJobPost;
      
      toast.success("Job post analyzed successfully!");

      // Redirect to the new proposal editor page
      if (newJobPost.id) {
        router.push(`/proposals/${newJobPost.id}`);
      } else {
        throw new Error("Failed to get new job post ID");
      }

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start pt-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Create New Proposal</CardTitle>
          <CardDescription>
            Start by pasting in the job description. Our AI will analyze it for
            keywords and tone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title (Optional)</Label>
            <Input
              id="title"
              placeholder="e.g., 'Senior Frontend Developer'"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              placeholder="Paste the full job description here..."
              className="min-h-[300px] text-base"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Analyze Job Post
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}