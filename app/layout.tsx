import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProBid AI",
  description: "AI that helps freelancers write smarter proposals & win more projects",
};

const clerkAppearance = {
  baseTheme: dark,
  elements: {
    card: "bg-slate-900/70 border-slate-700 backdrop-blur-sm shadow-2xl",
    headerTitle: "text-slate-50",
    headerSubtitle: "text-slate-400",
    socialButtonsBlockButton:
      "border-slate-700 hover:bg-slate-800 text-slate-200",
    dividerLine: "bg-slate-700",
    dividerText: "text-slate-400",
    formFieldLabel: "text-slate-200",
    formInput:
      "bg-slate-800 border-slate-700 text-slate-50 focus:ring-primary focus:border-primary",
    formButtonPrimary:
      "bg-primary text-primary-foreground hover:bg-primary/90",
    footerActionText: "text-slate-400",
    footerActionLink: "text-primary hover:text-primary/90",
    
    // This will style the UserButton dropdown menu too!
    userButtonPopoverCard: "bg-slate-900/70 border-slate-700 backdrop-blur-sm",
    userButtonPopoverLink: "text-slate-200 hover:bg-slate-800",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* We will add a Header component here later */}
            <main>{children}</main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}