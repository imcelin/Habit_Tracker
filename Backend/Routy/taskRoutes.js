import express from "express";

import { DailySummary } from "../Model/DailySummaryModel.js";
import { Task } from "../Model/TaskModel.js";

const router = express.Router();

async function recalculateDailySummary(summaryId) {
  const summary = await DailySummary.findOne({ id: summaryId });

  if (!summary) {
    return null;
  }

  const tasks = await Task.find({ summaryId });
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const totalTasks = tasks.length;
  const progressRate = totalTasks === 0 ? 0 : Number(((completedTasks / totalTasks) * 100).toFixed(2));

  return await DailySummary.findOneAndUpdate(
    { id: summaryId },
    {
      completedTasks,
      pendingTasks,
      progressRate
    },
    { new: true }
  );
}

function validateCreateBody(body) {
  if (!body.summaryId || typeof body.summaryId !== "string") {
    return "Field 'summaryId' is required and must be a string.";
  }

  if (!body.name || typeof body.name !== "string") {
    return "Field 'name' is required and must be a string.";
  }

  if (body.description !== undefined && typeof body.description !== "string") {
    return "Field 'description' must be a string.";
  }

  if (!body.dueDate || typeof body.dueDate !== "string") {
    return "Field 'dueDate' is required and must be a string.";
  }

  if (body.status !== undefined && body.status !== "pending" && body.status !== "completed") {
    return "Field 'status' must be 'pending' or 'completed'.";
  }

  if (body.completionTime !== undefined && body.completionTime !== null && typeof body.completionTime !== "string") {
    return "Field 'completionTime' must be a string or null.";
  }

  return null;
}

function validateUpdateBody(body) {
  if (body.summaryId !== undefined && typeof body.summaryId !== "string") {
    return "Field 'summaryId' must be a string.";
  }

  if (body.name !== undefined && typeof body.name !== "string") {
    return "Field 'name' must be a string.";
  }

  if (body.description !== undefined && body.description !== null && typeof body.description !== "string") {
    return "Field 'description' must be a string or null.";
  }

  if (body.dueDate !== undefined && typeof body.dueDate !== "string") {
    return "Field 'dueDate' must be a string.";
  }

  if (body.status !== undefined && body.status !== "pending" && body.status !== "completed") {
    return "Field 'status' must be 'pending' or 'completed'.";
  }

  if (body.completionTime !== undefined && body.completionTime !== null && typeof body.completionTime !== "string") {
    return "Field 'completionTime' must be a string or null.";
  }

  return null;
}

router.post("/create", async (req, res) => {
  try {
    const validationError = validateCreateBody(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const relatedSummary = await DailySummary.findOne({ id: req.body.summaryId });

    if (!relatedSummary) {
      return res.status(404).json({ message: "Daily summary for this task was not found." });
    }

    const status = req.body.status || "pending";
    let completionTime = req.body.completionTime !== undefined ? req.body.completionTime : null;

    if (status === "completed" && !completionTime) {
      completionTime = new Date().toISOString();
    }

    if (status === "pending") {
      completionTime = null;
    }

    const newTask = await Task.create({
      summaryId: req.body.summaryId,
      name: req.body.name,
      description: req.body.description || "",
      dueDate: req.body.dueDate,
      status,
      completionTime
    });

    await recalculateDailySummary(req.body.summaryId);

    return res.status(201).json({
      message: "Task created successfully.",
      data: newTask
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create task.",
      error: error.message
    });
  }
});

router.get("/get/:id", async (req, res) => {
  try {
    const task = await Task.findOne({ id: req.params.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.status(200).json({
      message: "Task found.",
      data: task
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get task.",
      error: error.message
    });
  }
});

router.get("/list", async (req, res) => {
  try {
    const taskList = await Task.find({});

    return res.status(200).json({
      message: "Task list loaded successfully.",
      data: taskList
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to list tasks.",
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

    const existingTask = await Task.findOne({ id: req.params.id });

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    const newSummaryId = req.body.summaryId || existingTask.summaryId;
    const relatedSummary = await DailySummary.findOne({ id: newSummaryId });

    if (!relatedSummary) {
      return res.status(404).json({ message: "Daily summary for this task was not found." });
    }

    const status = req.body.status || existingTask.status;
    let completionTime =
      req.body.completionTime !== undefined ? req.body.completionTime : existingTask.completionTime;

    if (status === "completed" && !completionTime) {
      completionTime = new Date().toISOString();
    }

    if (status === "pending") {
      completionTime = null;
    }

    const updatedTask = await Task.findOneAndUpdate(
      { id: req.params.id },
      {
        summaryId: newSummaryId,
        name: req.body.name !== undefined ? req.body.name : existingTask.name,
        description: req.body.description !== undefined ? req.body.description : existingTask.description,
        dueDate: req.body.dueDate !== undefined ? req.body.dueDate : existingTask.dueDate,
        status,
        completionTime
      },
      { new: true }
    );

    await recalculateDailySummary(existingTask.summaryId);

    if (newSummaryId !== existingTask.summaryId) {
      await recalculateDailySummary(newSummaryId);
    }

    return res.status(200).json({
      message: "Task updated successfully.",
      data: updatedTask
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update task.",
      error: error.message
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const existingTask = await Task.findOne({ id: req.params.id });

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    const deletedTask = await Task.findOneAndDelete({ id: req.params.id });
    await recalculateDailySummary(existingTask.summaryId);

    return res.status(200).json({
      message: "Task deleted successfully.",
      data: deletedTask
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete task.",
      error: error.message
    });
  }
});

export default router;
