// app/api/portfolio/route.ts

import { db } from "@/lib/db";
import { portfolios } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// --- GET Function (Simplified) ---
export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the user's portfolio
    const portfolio = await db.query.portfolios.findFirst({
      where: eq(portfolios.userId, userId),
      // Only select necessary fields if needed, or fetch all
      // columns: { id: true, userId: true, parsedText: true, createdAt: true }
    });

    if (!portfolio) {
      // Return empty object or specific fields with null text
      // to indicate no portfolio exists yet, instead of 404
      return NextResponse.json({ parsedText: null });
    }

    // Only return relevant fields
    return NextResponse.json({ parsedText: portfolio.parsedText });

  } catch (error) {
    console.error("[PORTFOLIO_GET_API]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// --- POST Function (Simplified) ---
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { parsedText } = body; // Only expect parsedText

    // Basic validation
    if (typeof parsedText !== 'string') {
        return new NextResponse("Invalid portfolio text provided", { status: 400 });
    }

    // Check if a portfolio record already exists
    const existingPortfolio = await db.query.portfolios.findFirst({
      where: eq(portfolios.userId, userId),
      columns: { id: true } // Only need the ID to check existence
    });

    let savedPortfolio;

    if (existingPortfolio) {
      // Update existing record
      savedPortfolio = await db
        .update(portfolios)
        .set({
          parsedText: parsedText || "", // Ensure it's never null
          // Reset file fields if they exist in schema, or remove them
          fileName: null,
          fileUrl: null,
        })
        .where(eq(portfolios.id, existingPortfolio.id))
        .returning({ id: portfolios.id, parsedText: portfolios.parsedText }); // Return only needed fields
    } else {
      // Create a new record
      savedPortfolio = await db
        .insert(portfolios)
        .values({
          userId: userId,
          parsedText: parsedText || "", // Ensure it's never null
          // Set file fields to null explicitly if they exist in schema
          fileName: null,
          fileUrl: null,
        })
        .returning({ id: portfolios.id, parsedText: portfolios.parsedText }); // Return only needed fields
    }

    return NextResponse.json(savedPortfolio[0]);
  } catch (error) {
    console.error("[PORTFOLIO_POST_API]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}