import { Schema, Types, model } from "mongoose";

const appSchema = new Schema({
  jobId: { type: Types.ObjectId, ref: "Job", required: true },
  userId: { type: Types.ObjectId, ref: "User", required: true },
  userTechSkills: {
    type: Array,
    required: true,
  },
  userSoftSkills: {
    type: Array,
    required: true,
  },
  userResume: {
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
},{timestamps:true});

export const Application = model("Application", appSchema);
