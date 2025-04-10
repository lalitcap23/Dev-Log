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

    if (status === "loading") return;
  
    // Redirect to home if user is already logged in
    // This is a workaround for the issue where the session is not available on the first render
    // and the user is redirected to the login page


    if (session) {
      router.push("/");
    }
  }, [session, router]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Welcome to DevLogs
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Your private daily journal for developers. Track your coding journey, document your progress, and build a record of your professional growth.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6">
              <div className="rounded-full bg-primary/10 p-3">
                <svg
                  className="h-6 w-6 text-primary"
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
              <h3 className="text-xl font-bold">Daily Developer Journal</h3>
              <p className="text-muted-foreground">
                Record what you did each day as a developer in your private log
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6">
              <div className="rounded-full bg-primary/10 p-3">
                <svg
                  className="h-6 w-6 text-primary"
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
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Track Your Progress</h3>
              <p className="text-muted-foreground">
                Review your past logs to see how far you've come and what you've accomplished
              </p>
            </div>
            
            <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6">
              <div className="rounded-full bg-primary/10 p-3">
                <svg
                  className="h-6 w-6 text-primary"
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
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Stay Consistent</h3>
              <p className="text-muted-foreground">
                Build a habit of documenting your work to improve for interviews, blogs, and reports
              </p>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto mt-8 px-4">
            <h2 className="text-2xl font-bold mb-4">How DevLogs Helps You</h2>
            <ul className="text-left space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Remember exactly what you worked on, even weeks or months later</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Prepare for job interviews with detailed examples of your past work</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Create technical blogs or write GSoC reports with ease</span>
              </li>
            </ul>
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
          
          <div className="text-sm text-muted-foreground mt-4">
            Private and secure - only you can access your logs
          </div>
        </div>
      </div>
    </div>
  );
}