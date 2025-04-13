import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "../../../models/User";
import Log from "@/models/Log";
import connectDB from "../../../lib/connectDB";

export async function GET() {
  try {
    await connectDB();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    
    const logs = await Log.find({ userEmail: session.user.email })
      .sort({ date: -1 })
      .limit(7);
      
    const totalTasks = logs.reduce((sum, log) => sum + (log.tasks ? log.tasks.length : 0), 0);
    const completedTasks = logs.reduce(
      (sum, log) => sum + (log.tasks ? log.tasks.filter((t) => t.done).length : 0),
      0
    );
    
    const completionRate =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
      
    return Response.json({
      name: session.user.name,
      email: session.user.email,
      mumasies: user.mumasies || 0, // Providing fallback if mumasies is undefined
      totalTasks,
      completedTasks,
      completionRate,
    });
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}