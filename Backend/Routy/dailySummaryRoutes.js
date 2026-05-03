import express from "express";

import { DailySummary } from "../Model/DailySummaryModel.js";
import { Task } from "../Model/TaskModel.js";

const router = express.Router();

function validateCreateBody(body) {
  if (!body.date || typeof body.date !== "string") {
    return "Field 'date' is required and must be a string.";
  }

  return null;
}

function validateUpdateBody(body) {
  if (body.date !== undefined && typeof body.date !== "string") {
    return "Field 'date' must be a string.";
  }

  return null;
}

router.post("/create", async (req, res) => {
  try {
    const validationError = validateCreateBody(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const newSummary = await DailySummary.create({
      date: req.body.date,
      completedTasks: 0,
      pendingTasks: 0,
      progressRate: 0
    });

    return res.status(201).json({
      message: "Daily summary created successfully.",
      data: newSummary
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create daily summary.",
      error: error.message
    });
  }
});

router.get("/get/:id", async (req, res) => {
  try {
    const summary = await DailySummary.findOne({ id: req.params.id });

    if (!summary) {
      return res.status(404).json({ message: "Daily summary not found." });
    }

    return res.status(200).json({
      message: "Daily summary found.",
      data: summary
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get daily summary.",
      error: error.message
    });
  }
});

router.get("/list", async (req, res) => {
  try {
    const summaryList = await DailySummary.find({});

    return res.status(200).json({
      message: "Daily summary list loaded successfully.",
      data: summaryList
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to list daily summaries.",
      error: error.message
    });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const validationError = validateUpdateBody(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingSummary = await DailySummary.findOne({ id: req.params.id });

    if (!existingSummary) {
      return res.status(404).json({ message: "Daily summary not found." });
    }

    const updatedSummary = await DailySummary.findOneAndUpdate(
      { id: req.params.id },
      {
        date: req.body.date !== undefined ? req.body.date : existingSummary.date
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Daily summary updated successfully.",
      data: updatedSummary
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update daily summary.",
      error: error.message
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const existingSummary = await DailySummary.findOne({ id: req.params.id });

    if (!existingSummary) {
      return res.status(404).json({ message: "Daily summary not found." });
    }

    await Task.deleteMany({ summaryId: req.params.id });
    const deletedSummary = await DailySummary.findOneAndDelete({ id: req.params.id });

    return res.status(200).json({
      message: "Daily summary deleted successfully.",
      data: deletedSummary
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete daily summary.",
      error: error.message
    });
  }
});

export default router;
