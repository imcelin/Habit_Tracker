import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getSummary, getTaskList } from "../api/api.js";

function DailySummaryDetailPage() {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      const [summaryResponse, taskResponse] = await Promise.all([getSummary(id), getTaskList()]);
      const loadedSummary = summaryResponse.data;
      const relatedTasks = taskResponse.data.filter((task) => task.summaryId === loadedSummary.id);

      setSummary(loadedSummary);
      setTasks(relatedTasks);
      setError("");
    } catch (loadError) {
      setError(loadError.message);
    }
  }

  return (
    <section className="page-content">
      <div className="section-header">
        <div>
          <p className="eyebrow">Summary detail</p>
          <h2>Daily summary</h2>
        </div>
        <Link className="secondary-button" to="/summaries">
          Back to summaries
        </Link>
      </div>

      {error ? <p className="message error-message">{error}</p> : null}

      {summary ? (
        <>
          <article className="card detail-card">
            <div className="detail-row">
              <span>Date</span>
              <strong>{summary.date}</strong>
            </div>
            <div className="detail-row">
              <span>Completed tasks</span>
              <strong>{summary.completedTasks}</strong>
            </div>
            <div className="detail-row">
              <span>Pending tasks</span>
              <strong>{summary.pendingTasks}</strong>
            </div>
            <div className="detail-row">
              <span>Progress rate</span>
              <strong>{summary.progressRate}%</strong>
            </div>
          </article>

          <section className="card">
            <div className="section-header">
              <h3>Tasks for this day</h3>
            </div>
            <div className="list-stack">
              {tasks.map((task) => (
                <Link className="list-item" key={task.id} to={`/tasks/${task.id}`}>
                  <div>
                    <strong>{task.name}</strong>
                    <p>{task.dueDate}</p>
                  </div>
                  <span className={`status-pill ${task.status}`}>{task.status}</span>
                </Link>
              ))}
              {!tasks.length ? <p>No tasks connected to this summary.</p> : null}
            </div>
          </section>
        </>
      ) : null}
    </section>
  );
}

export default DailySummaryDetailPage;
