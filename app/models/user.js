import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  mumasies: { type: Number, default: 0 },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
