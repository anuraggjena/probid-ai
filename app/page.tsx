"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { LandingHeader } from "@/components/layout/LandingHeader";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-blue-950 dark:via-indigo-950 dark:to-black text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <LandingHeader />

      {/* --- Main Content --- */}
      <main className="flex-1">
        {/* --- Hero Section --- */}
        <section className="relative overflow-hidden pt-32 md:pt-40 lg:pt-58 pb-16 md:pb-24 lg:pb-32 min-h-screen">
          {/* Animated background only for dark mode */}
          <div
            className="absolute inset-0 z-0 animate-gradient-xy opacity-30 dark:opacity-40"
            style={{
              background: `linear-gradient(45deg, var(--primary) 0%, var(--secondary) 50%, #d0e2ff 100%)`,
              backgroundSize: `400% 400%`,
            }}
          ></div>

          <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column */}
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-6xl text-blue-950 dark:text-white">
                    Win More Projects with{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      AI-Powered Proposals.
                    </span>
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-blue-200 md:text-lg max-w-xl pt-4">
                    ProBid AI crafts tailored proposals that match job posts and
                    showcase your strengths — helping you stand out every time.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white">
                    <Link href="/sign-up">
                      Start Winning Today
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Column */}
              <div className="relative mt-12 lg:mt-0">
                <Card className="shadow-2xl backdrop-blur-md bg-white/80 dark:bg-slate-950/60 border-slate-300 dark:border-blue-800/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-800 dark:text-slate-100">
                      AI Analysis in Action
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="font-mono text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* BEFORE */}
                      <div>
                        <p className="text-slate-700 dark:text-slate-400 mb-2">~ Before: Job Post</p>
                        <div className="bg-slate-100 dark:bg-slate-900/70 p-3 rounded-md border border-slate-300 dark:border-slate-700 h-48 overflow-y-auto">
                          <span className="text-slate-700 dark:text-slate-300">
                            We need a senior dev for our new e-comm site. Must
                            know React, Next.js, and TypeScript. Experience with
                            PostgreSQL is a huge plus. We are a fast-moving,
                            friendly team.
                          </span>
                        </div>
                      </div>

                      {/* AFTER */}
                      <div>
                        <p className="text-slate-700 dark:text-slate-400 mb-2">~ After: ProBid AI</p>
                        <div className="bg-slate-100 dark:bg-slate-900/70 p-3 rounded-md border border-slate-300 dark:border-slate-700 h-48 overflow-y-auto">
                          <p>
                            <span className="text-pink-500 dark:text-pink-400">&quot;keywords&quot;</span>: [
                            <br />
                            <span className="text-green-600 dark:text-green-400">
                              &nbsp;&nbsp;&quot;React&quot;,
                            </span>
                            <br />
                            <span className="text-green-600 dark:text-green-400">
                              &nbsp;&nbsp;&quot;Next.js&quot;,
                            </span>
                            <br />
                            <span className="text-green-600 dark:text-green-400">
                              &nbsp;&nbsp;&quot;TypeScript&quot;,
                            </span>
                            <br />
                            <span className="text-green-600 dark:text-green-400">
                              &nbsp;&nbsp;&quot;PostgreSQL&quot;
                            </span>
                            <br />
                            ],
                          </p>
                          <p>
                            <span className="text-pink-500 dark:text-pink-400">&quot;tone&quot;</span>:{" "}
                            <span className="text-green-600 dark:text-green-400">
                              &quot;friendly&quot;
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section
          id="features"
          className="w-full border-t border-slate-200 dark:border-blue-900/50 bg-white dark:bg-black py-20 md:py-28 lg:py-36 transition-colors"
        >
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-blue-100 dark:bg-blue-900/50 px-3 py-2 text-sm font-medium text-blue-700 dark:text-blue-100">
                  Core Features
                </div>
                <h2 className="text-3xl font-bold sm:text-5xl pt-4 text-blue-950 dark:text-white">
                  Intelligent Tools to Boost Your Success
                </h2>
                <p className="text-lg text-slate-600 dark:text-blue-200 max-w-3xl mx-auto">
                  Leverage cutting-edge AI to personalize your proposals and
                  optimize your bids for maximum impact.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-6 lg:grid-cols-3 lg:gap-8">
              {[
                {
                  title: "Job Post Analysis",
                  desc: "Our AI scans job descriptions, extracting keywords, tone, and essential details for perfect alignment.",
                },
                {
                  title: "Personalized Generation",
                  desc: "Generate proposals that weave in your portfolio and directly address client needs.",
                },
                {
                  title: "Proposal Success Scoring",
                  desc: "Get instant feedback with relevance scores and tips for improvement.",
                },
              ].map((f) => (
                <Card
                  key={f.title}
                  className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-white/80 dark:bg-blue-950/30 border border-slate-300 dark:border-blue-800/50 cursor-pointer"
                >
                  <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                    <CheckCircle className="h-6 w-6 text-blue-600 dark:text-primary" />
                    <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                      {f.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed text-slate-600 dark:text-blue-200">
                      {f.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="w-full border-t border-slate-200 dark:border-gray-900 bg-slate-50 dark:bg-black">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 sm:flex-row md:px-6">
          <p className="text-sm text-slate-500 dark:text-blue-300">
            &copy; {new Date().getFullYear()} ProBid AI. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm text-slate-500 dark:text-blue-300 hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="text-sm text-slate-500 dark:text-blue-300 hover:underline underline-offset-4">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
