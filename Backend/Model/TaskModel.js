import mongoose from "mongoose";
import crypto from "crypto";

const taskSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => crypto.randomUUID()
    },
    summaryId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    dueDate: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending"
    },
    completionTime: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const Task = mongoose.model("Task", taskSchema);
