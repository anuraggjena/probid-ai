// app/(app)/layout.tsx

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm"
import { DashboardWrapper } from "./DashboardWrapper";

async function syncUser() {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) {
    // This should be handled by middleware, but as a fallback
    return;
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  const primaryEmail =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress || "";

  const newName = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
  const newEmail = primaryEmail;

  if (!dbUser) {
    try {
      await db.insert(users).values({
        clerkId: userId,
        name: newName,
        email: newEmail,
      });
    } catch (e) {
      console.error("Error creating user in DB:", e);
    }
    return;
  }

  if (dbUser.name !== newName || dbUser.email !== newEmail) {
    try {
      await db
        .update(users)
        .set({
          name: newName,
          email: newEmail,
        })
        .where(eq(users.clerkId, userId));
    } catch (e) {
      console.error("Error updating user in DB:", e);
    }
  }
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await syncUser();

  return (
    <DashboardWrapper>
      {children}
    </DashboardWrapper>
  );
}