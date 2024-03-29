import { Schema, Types, model } from "mongoose";

const companySchema = new Schema(
  {
    companyName: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    industry: { type: String, required: true },
    address: { type: String, required: true },
    numberOfEmployees: [
      { type: Number, required: true },
      { type: Number, required: true },
    ],
    companyEmail: { type: String, unique: true, required: true },
    companyHR: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

companySchema.virtual("jobs", {
  ref: "Job",
  localField: "companyHR",
  foreignField: "addedBy",
});

export const Company = model("Company", companySchema);
