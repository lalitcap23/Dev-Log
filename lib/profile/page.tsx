import { getServerSession } from "next-auth";
import { authOptions } from "../../app/api/auth/[...nextauth]/route";
import User from "../../app/models/user";
import Log from "../../app/models/log";
import { connectDB } from "../connectDB";
import { NextResponse } from 'next/server'; 

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const logs = await Log.find({ userEmail: session.user.email })
      .sort({ date: -1 })
      .limit(7);

    // Ensure logs is an array
    const logsArray = Array.isArray(logs) ? logs : [];

    const totalTasks = logsArray.reduce((sum, log) => {
      return sum + (Array.isArray(log.tasks) ? log.tasks.length : 0);
    }, 0);

    const completedTasks = logsArray.reduce((sum, log) => {
      return sum + (Array.isArray(log.tasks) ? log.tasks.filter((t: { done: any; }) => t && t.done).length : 0);
    }, 0);

    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return NextResponse.json({
      name: session.user.name,
      email: session.user.email,
      mumasies: user.mumasies || 0,
      totalTasks,
      completedTasks,
      completionRate,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "An unknown error occurred"
    }, { status: 500 });
  }
}
