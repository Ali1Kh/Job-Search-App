import { Schema, Types, model } from "mongoose";

const jobSchema = new Schema(
  {
    jobTitle: { type: String, required: true },
    jobLocation: {
      type: String,
      enum: ["onsite", "remotely", "hybrid "],
      required: true,
    },
    workingTime: {
      type: String,
      enum: ["part-time", "full-time"],
      required: true,
    },
    seniorityLevel: {
      type: String,
      enum: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    technicalSkills: {
      type: Array,
      required: true,
    },
    softSkills: {
      type: Array,
      required: true,
    },
    addedBy: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

jobSchema.virtual("company", {
  ref: "Company",
  localField: "addedBy",
  foreignField: "companyHR",
});

export const Job = model("Job", jobSchema);
