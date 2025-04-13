import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  content: String,
  estimate: Number,
  done: Boolean,
  startTime: Date,
  endTime: Date,
});

const logSchema = new mongoose.Schema({
  userEmail: String,
  date: Date,
  tasks: [taskSchema],
  score: Number,
  complete: Boolean,
});

export default mongoose.models.Log || mongoose.model("Log", logSchema);
