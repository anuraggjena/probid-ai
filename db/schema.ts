// db/schema.ts

import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  real,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Users Table
// This table will sync with your Clerk users
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(), // From Clerk
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Portfolios Table
// Stores the freelancer's resumes/portfolios
export const portfolios = pgTable("portfolios", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id") // References users.clerkId
    .notNull()
    .references(() => users.clerkId, { onDelete: "cascade" }),
  fileName: text("file_name"),
  fileUrl: text("file_url"), // URL from S3/Cloudinary/Vercel Blob
  parsedText: text("parsed_text"), // The extracted text from the doc
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Job Posts Table
// Stores the job descriptions posted by the user
export const jobPosts = pgTable("job_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id") // References users.clerkId
    .notNull()
    .references(() => users.clerkId, { onDelete: "cascade" }),
  title: text("title"),
  description: text("description").notNull(),
  keywords: jsonb("keywords").$type<string[]>(), // Store keywords as a string array
  tone: text("tone"), // e.g., 'formal', 'friendly'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. Proposals Table
// Stores the AI-generated proposals
export const proposals = pgTable("proposals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id") // References users.clerkId
    .notNull()
    .references(() => users.clerkId, { onDelete: "cascade" }),
  jobPostId: uuid("job_post_id") // Link to the job post
    .notNull()
    .references(() => jobPosts.id, { onDelete: "cascade" }),
  content: text("content").notNull(), // The AI-generated proposal text
  tone: text("tone").notNull(),
  score: real("score"), // The matching score (0.0 to 1.0)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- RELATIONS ---
// Define how tables are linked for easier querying

export const usersRelations = relations(users, ({ many }) => ({
  portfolios: many(portfolios),
  jobPosts: many(jobPosts),
  proposals: many(proposals),
}));

export const jobPostsRelations = relations(jobPosts, ({ one, many }) => ({
  user: one(users, {
    fields: [jobPosts.userId],
    references: [users.clerkId],
  }),
  proposals: many(proposals), // A job post can have many proposals
}));

export const portfoliosRelations = relations(portfolios, ({ one }) => ({
  user: one(users, {
    fields: [portfolios.userId],
    references: [users.clerkId],
  }),
}));

export const proposalsRelations = relations(proposals, ({ one }) => ({
  user: one(users, {
    fields: [proposals.userId],
    references: [users.clerkId],
  }),
  jobPost: one(jobPosts, {
    fields: [proposals.jobPostId],
    references: [jobPosts.id],
  }),
}));