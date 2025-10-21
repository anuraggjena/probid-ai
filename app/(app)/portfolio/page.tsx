// app/(app)/portfolio/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Label } from "@/components/ui/label"; // Keep Label

// Define a simpler type just for the data we fetch/use
interface PortfolioData {
  parsedText: string | null;
}

export default function PortfolioPage() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // --- Fetch existing portfolio text ---
  useEffect(() => {
    const fetchPortfolio = async () => {
      setIsFetching(true);
      try {
        const response = await fetch("/api/portfolio"); // GET request
        if (response.ok) {
          const data = (await response.json()) as PortfolioData;
          setText(data.parsedText || ""); // Set text or empty string
        } else {
           // Handle non-404 errors during fetch
           if(response.status !== 404) throw new Error(`Failed with status: ${response.status}`);
           // If 404 (not found), just leave text empty
        }
      } catch (error) {
        console.error("Failed to fetch portfolio", error);
        toast.error("Could not load your existing portfolio.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchPortfolio();
  }, []);

  // --- Handle saving the text ---
  const handleSaveText = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/portfolio", { // POST request
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsedText: text }),
      });

      if (!response.ok) {
        throw new Error("Failed to save portfolio text");
      }

      toast.success("Portfolio saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong saving text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Portfolio / Resume</CardTitle>
        <CardDescription>
          Paste your full resume, skills, portfolio content, or bio below. The AI will use this text to find your most relevant experience.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Label htmlFor="paste-area">Portfolio Content (Used for Analysis)</Label>
        <Textarea
          id="paste-area"
          placeholder={
            isFetching
              ? "Loading existing portfolio..."
              : "Paste your resume here..."
          }
          className="min-h-[400px] text-base"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isFetching}
        />
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button
          onClick={handleSaveText}
          disabled={isLoading || isFetching}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Save Portfolio
        </Button>
      </CardFooter>
    </Card>
  );
}