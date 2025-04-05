"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Welcome to DevLog 2.0
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Your smart task planner and motivator. Plan your day, track your progress,
              and earn rewards for completing tasks.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6">
              <div className="rounded-full bg-primary/10 p-3">
                <svg
                  className=" h-6 w-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Smart Task Planning</h3>
              <p className="text-muted-foreground">
                Add tasks with time estimates and let DevLog schedule them intelligently
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6">
              <div className="rounded-full bg-primary/10 p-3">
                <svg
                  className=" h-6 w-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Z" />
                  <path d="M12 20c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Z" />
                  <path d="M20 12c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2Z" />
                  <path d="M4 12c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your performance and receive helpful feedback
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6">
              <div className="rounded-full bg-primary/10 p-3">
                <svg
                  className=" h-6 w-6 text-primary"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2v20" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Earn Rewards</h3>
              <p className="text-muted-foreground">
                Complete tasks to earn Mumasy tokens and unlock achievements
              </p>
            </div>
          </div>

          <Button 
            size="lg" 
            className="mt-8"
            onClick={() => signIn("github")}
            disabled={status === "loading"}
          >
            <Github className="mr-2 h-5 w-5" />
            Sign in with GitHub
          </Button>
        </div>
      </div>
    </div>
  );
}