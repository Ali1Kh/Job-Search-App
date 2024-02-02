import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  recoveryEmail: { type: String, required: false },
  dob: { type: Date, required: true },
  mobileNumber: { type: String, unique: true, required: true },
  role: {
    type: String,
    // enum: ["user", "hr"],
    required: true,
    validate(value) {
      value = value.toLowerCase();
      return value === "user" || value === "hr";
    },
  },
  status: {
    type: String,
    // enum: ["ONLINE", "OFFLINE"],
    required: false,
    default: "OFFLINE",
    validate(value) {
      value = value.toLowerCase();
      return value === "online" || value === "offline";
    },
  },
  forgetCode: { type: String },
});

export const User = model("User", userSchema);
