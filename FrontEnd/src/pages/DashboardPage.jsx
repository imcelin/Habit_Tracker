import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getSummaryList, getTaskList } from "../api/api.js";

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [taskResponse, summaryResponse] = await Promise.all([getTaskList(), getSummaryList()]);
        setTasks(taskResponse.data);
        setSummaries(summaryResponse.data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const completedCount = tasks.filter((task) => task.status === "completed").length;
  const pendingCount = tasks.filter((task) => task.status === "pending").length;
  const todayDate = new Date().toISOString().slice(0, 10);
  const todaySummary = summaries.find((summary) => summary.date === todayDate);
  const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

  return (
    <section className="page-content">
      <div className="hero-block">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Track daily habits in one simple place.</h2>
          <p className="lead-text">
            This dashboard shows current tasks and daily summaries from the backend.
          </p>
        </div>
        <div className="button-row">
          <Link className="primary-button" to="/tasks/create">
            Add task
          </Link>
          <Link className="secondary-button" to="/summaries">
            Open summaries
          </Link>
        </div>
      </div>

      {loading ? <p className="message">Loading data...</p> : null}
      {error ? <p className="message error-message">{error}</p> : null}

      <div className="stats-grid">
        <article className="card stat-card">
          <span>Total tasks</span>
          <strong>{tasks.length}</strong>
        </article>
        <article className="card stat-card">
          <span>Completed</span>
          <strong>{completedCount}</strong>
        </article>
        <article className="card stat-card">
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </article>
        <article className="card stat-card">
          <span>Tasks today</span>
          <strong>{todaySummary ? todaySummary.completedTasks + todaySummary.pendingTasks : 0}</strong>
        </article>
      </div>

      <div className="dashboard-grid">
        <section className="card">
          <div className="section-header">
            <h3>Recent tasks</h3>
            <Link to="/tasks">View all</Link>
          </div>
          <div className="list-stack">
            {recentTasks.map((task) => (
              <Link className="list-item" key={task.id} to={`/tasks/${task.id}`}>
                <div>
                  <strong>{task.name}</strong>
                  <p>{task.dueDate}</p>
                </div>
                <span className={`status-pill ${task.status}`}>{task.status}</span>
              </Link>
            ))}
            {!tasks.length && !loading ? <p>No tasks yet.</p> : null}
          </div>
        </section>

        <section className="card">
          <div className="section-header">
            <h3>Today&apos;s summary</h3>
            <Link to="/summaries">View all</Link>
          </div>
          {todaySummary ? (
            <div className="summary-preview">
              <p>Date: {todaySummary.date}</p>
              <p>Total tasks: {todaySummary.completedTasks + todaySummary.pendingTasks}</p>
              <p>Completed: {todaySummary.completedTasks}</p>
              <p>Pending: {todaySummary.pendingTasks}</p>
              <p>Progress: {todaySummary.progressRate}%</p>
            </div>
          ) : (
            <p>No summary for today yet.</p>
          )}
        </section>
      </div>
    </section>
  );
}

export default DashboardPage;
