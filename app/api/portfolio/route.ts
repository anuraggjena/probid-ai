// app/api/portfolio/route.ts

import { db } from "@/lib/db";
import { portfolios } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const portfolio = await db.query.portfolios.findFirst({
      where: eq(portfolios.userId, userId),
    });

    if (!portfolio) {
      return new NextResponse("Portfolio not found", { status: 404 });
    }

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("[PORTFOLIO_GET_API]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { parsedText } = body;

    if (!parsedText) {
      return new NextResponse("Portfolio text is required", { status: 400 });
    }

    // Check if a portfolio already exists for this user
    const existingPortfolio = await db.query.portfolios.findFirst({
      where: eq(portfolios.userId, userId),
    });

    let savedPortfolio;

    if (existingPortfolio) {
      // If one exists, update it
      savedPortfolio = await db
        .update(portfolios)
        .set({
          parsedText: parsedText,
        })
        .where(eq(portfolios.id, existingPortfolio.id))
        .returning();
    } else {
      // If not, create a new one
      savedPortfolio = await db
        .insert(portfolios)
        .values({
          userId: userId,
          parsedText: parsedText,
          fileName: "Pasted Text", // Add a default file name
        })
        .returning();
    }

    return NextResponse.json(savedPortfolio[0]);
  } catch (error) {
    console.error("[PORTFOLIO_API]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}