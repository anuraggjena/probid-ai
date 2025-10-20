// app/(app)/portfolio/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { portfolios } from "@/db/schema"; // Import the type

// Define the type
type Portfolio = typeof portfolios.$inferSelect;

export default function PortfolioPage() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // For initial load

  // --- Fetch existing portfolio text ---
  useEffect(() => {
    const fetchPortfolio = async () => {
      setIsFetching(true);
      try {
        // We'll create this GET API route next
        const response = await fetch("/api/portfolio");
        if (response.ok) {
          const data = (await response.json()) as Portfolio;
          if (data && data.parsedText) {
            setText(data.parsedText);
          }
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
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parsedText: text }),
      });

      if (!response.ok) {
        throw new Error("Failed to save portfolio");
      }

      toast.success("Portfolio saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Portfolio / Resume</CardTitle>
        <CardDescription>
          Provide your resume/portfolio content. The AI will use
          this to find relevant experience for your proposals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="paste">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paste">Paste Text</TabsTrigger>
            <TabsTrigger value="upload" disabled>
              Upload File (Coming Soon)
            </TabsTrigger>
          </TabsList>
          
          {/* --- Tab 1: Paste Text --- */}
          <TabsContent value="paste">
            <Textarea
              placeholder={
                isFetching
                  ? "Loading existing portfolio..."
                  : "Paste your resume here..."
              }
              className="min-h-[400px] text-base mt-4"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isFetching}
            />
            <Button
              onClick={handleSave}
              disabled={isLoading || isFetching}
              className="mt-4"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Save Text
            </Button>
          </TabsContent>

          {/* --- Tab 2: Upload File (Disabled) --- */}
          <TabsContent value="upload">
            <Alert className="mt-4">
              <Upload className="h-4 w-4" />
              <AlertTitle>Coming Soon!</AlertTitle>
              <AlertDescription>
                File uploads for PDF and DOCX files will be enabled after the
                project is deployed.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}