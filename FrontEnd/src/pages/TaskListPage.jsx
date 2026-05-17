import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { deleteTask, getTaskList } from "../api/api.js";

function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      const response = await getTaskList();
      setTasks(response.data);
      setError("");
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(taskId) {
    try {
      await deleteTask(taskId);
      await loadTasks();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <section className="page-content">
      <div className="section-header">
        <div>
          <p className="eyebrow">Tasks</p>
          <h2>Task list</h2>
        </div>
        <Link className="primary-button" to="/tasks/create">
          Create task
        </Link>
      </div>

      {loading ? <p className="message">Loading tasks...</p> : null}
      {error ? <p className="message error-message">{error}</p> : null}

      <div className="table-card card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Due date</th>
              <th>Status</th>
              <th>Summary Id</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.name}</td>
                <td>{task.dueDate}</td>
                <td>
                  <span className={`status-pill ${task.status}`}>{task.status}</span>
                </td>
                <td>{task.summaryId}</td>
                <td className="action-cell">
                  <button onClick={() => navigate(`/tasks/${task.id}`)}>View</button>
                  <button onClick={() => navigate(`/tasks/${task.id}/edit`)}>Edit</button>
                  <button className="danger-button" onClick={() => handleDelete(task.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!tasks.length && !loading ? <p className="empty-state">No tasks found.</p> : null}
      </div>
    </section>
  );
}

export default TaskListPage;
