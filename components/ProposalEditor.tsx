// components/ProposalEditor.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"; // Import CardDescription
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs
import { Label } from "@/components/ui/label";
import { jobPosts, portfolios, proposals } from "@/db/schema";
import { toast } from "sonner";
import { Loader2, Wand2, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type JobPost = typeof jobPosts.$inferSelect;
type Portfolio = typeof portfolios.$inferSelect;
type Proposal = typeof proposals.$inferSelect;

interface ProposalEditorProps {
  jobPost: JobPost;
  portfolio: Portfolio | null;
  initialProposal: Proposal | null;
}

export function ProposalEditor({
  jobPost,
  portfolio,
  initialProposal,
}: ProposalEditorProps) {
  const [proposal, setProposal] = useState(initialProposal);
  const [tone, setTone] = useState(jobPost.tone || "persuasive");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScoring, setIsScoring] = useState(false);

  const proposalContent = proposal?.content || "";
  const proposalScore = proposal?.score;

  // --- Main Generate Function ---
  const handleGenerate = async () => {
    setIsGenerating(true);
    if (!portfolio) {
      toast.error("You must save a portfolio before generating a proposal.");
      setIsGenerating(false);
      return;
    }
    try {
      const response = await fetch("/api/generate-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobPostId: jobPost.id, tone: tone }),
      });
      if (!response.ok) throw new Error("Failed to generate proposal");
      
      const newProposal = (await response.json()) as Proposal;
      setProposal(newProposal);
      toast.success("New proposal generated!");
      
      // Automatically score it
      handleScore(newProposal.id);
      
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Scoring Function ---
  const handleScore = async (proposalId: string) => {
    setIsScoring(true);
    try {
      const response = await fetch("/api/score-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId: proposalId }),
      });
      if (!response.ok) throw new Error("Failed to score proposal");

      const updatedProposal = (await response.json()) as Proposal;
      setProposal(updatedProposal); // Update with new score
      toast.success(`Proposal Score: ${updatedProposal.score}%`);
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to calculate score.");
    } finally {
      setIsScoring(false);
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score == null) return "text-muted-foreground"; // Use == to catch undefined too
    if (score >= 85) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    // New 2-column layout. 1/3 for context, 2/3 for editor.
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* --- Column 1: Context (Job Details, Score, Analysis) --- */}
      <div className="lg:col-span-1 space-y-6">
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>
          
          {/* Job Details Tab */}
          <TabsContent value="details">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>{jobPost.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground max-h-64 overflow-y-auto">
                  {jobPost.description}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Analysis Tab */}
          <TabsContent value="analysis">
            <Card className="mt-4 space-y-4">
              <CardHeader>
                <CardTitle>AI Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Keywords</h4>
                  <div className="flex gap-2 flex-wrap">
                    {jobPost.keywords?.map((kw) => (
                      <span key={kw} className="text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-0.5">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Detected Tone</h4>
                  <p className="text-sm text-muted-foreground">{jobPost.tone}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Match Score
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => proposal && handleScore(proposal.id)}
                    disabled={!proposal || isScoring}
                  >
                    {isScoring ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </CardTitle>
                <CardDescription>
                  How well this proposal matches the job post.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isScoring ? (
                  <Skeleton className="h-16 w-1/2" />
                ) : (
                  <div
                    className={`text-6xl font-bold ${getScoreColor(proposalScore ?? null)}`}
                  >
                    {proposalScore != null ? `${proposalScore}%` : "N/A"}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* --- Column 2: Proposal Editor --- */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your AI-Generated Proposal</CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="tone" className="text-sm">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone" className="w-[150px]">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isGenerating && !proposalContent ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ) : (
              <Textarea
                placeholder="Click 'Generate Proposal' and your AI-crafted proposal will appear here..."
                className="min-h-[500px] text-base"
                value={proposalContent}
                onChange={(e) => setProposal(prev => ({...prev, content: e.target.value} as Proposal))}
              />
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              {proposalContent ? "Regenerate" : "Generate Proposal"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}