import express from "express";
import mongoose from "mongoose";

import { PORT, mongoDBURL } from "./config.js";
import dailySummaryRoutes from "./Routy/dailySummaryRoutes.js";
import taskRoutes from "./Routy/taskRoutes.js";

const app = express();

app.use(express.json());

app.use("/daily-summary", dailySummaryRoutes);
app.use("/task", taskRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Habit Tracker backend is running."
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found."
  });
});

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
