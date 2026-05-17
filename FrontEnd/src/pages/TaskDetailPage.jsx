import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getTask } from "../api/api.js";

function TaskDetailPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTask() {
      try {
        const response = await getTask(id);
        setTask(response.data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadTask();
  }, [id]);

  return (
    <section className="page-content">
      <div className="section-header">
        <div>
          <p className="eyebrow">Task detail</p>
          <h2>Selected task</h2>
        </div>
        <Link className="secondary-button" to="/tasks">
          Back to list
        </Link>
      </div>

      {loading ? <p className="message">Loading task...</p> : null}
      {error ? <p className="message error-message">{error}</p> : null}

      {task ? (
        <article className="card detail-card">
          <div className="detail-row">
            <span>Name</span>
            <strong>{task.name}</strong>
          </div>
          <div className="detail-row">
            <span>Description</span>
            <strong>{task.description || "No description"}</strong>
          </div>
          <div className="detail-row">
            <span>Due date</span>
            <strong>{task.dueDate}</strong>
          </div>
          <div className="detail-row">
            <span>Status</span>
            <strong>{task.status}</strong>
          </div>
          <div className="detail-row">
            <span>Completion time</span>
            <strong>{task.completionTime || "Not completed yet"}</strong>
          </div>
          <div className="detail-row">
            <span>Summary Id</span>
            <strong>{task.summaryId}</strong>
          </div>
          <Link className="primary-button inline-button" to={`/tasks/${task.id}/edit`}>
            Edit task
          </Link>
        </article>
      ) : null}
    </section>
  );
}

export default TaskDetailPage;
