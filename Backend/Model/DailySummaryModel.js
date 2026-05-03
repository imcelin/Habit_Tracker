import mongoose from "mongoose";
import crypto from "crypto";

const dailySummarySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => crypto.randomUUID()
    },
    date: {
      type: String,
      required: true
    },
    completedTasks: {
      type: Number,
      default: 0
    },
    pendingTasks: {
      type: Number,
      default: 0
    },
    progressRate: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const DailySummary = mongoose.model("DailySummary", dailySummarySchema);
