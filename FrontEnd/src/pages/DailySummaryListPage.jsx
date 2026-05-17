import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { deleteSummary, getSummaryList } from "../api/api.js";

function DailySummaryListPage() {
  const [summaries, setSummaries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadSummaries();
  }, []);

  async function loadSummaries() {
    try {
      setLoading(true);
      const response = await getSummaryList();
      setSummaries(response.data);
      setError("");
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(summaryId) {
    try {
      await deleteSummary(summaryId);
      await loadSummaries();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <section className="page-content">
      <div className="section-header">
        <div>
          <p className="eyebrow">Daily summaries</p>
          <h2>Summary list</h2>
        </div>
      </div>

      {loading ? <p className="message">Loading summaries...</p> : null}
      {error ? <p className="message error-message">{error}</p> : null}

      <div className="table-card card">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Total tasks</th>
              <th>Completed</th>
              <th>Pending</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {summaries.map((summary) => (
              <tr key={summary.id}>
                <td>{summary.date}</td>
                <td>{summary.completedTasks + summary.pendingTasks}</td>
                <td>{summary.completedTasks}</td>
                <td>{summary.pendingTasks}</td>
                <td>{summary.progressRate}%</td>
                <td className="action-cell">
                  <button onClick={() => navigate(`/summaries/${summary.id}`)}>View</button>
                  <button className="danger-button" onClick={() => handleDelete(summary.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!summaries.length && !loading ? <p className="empty-state">No summaries found.</p> : null}
      </div>

      <Link className="secondary-button inline-button" to="/">
        Back to dashboard
      </Link>
    </section>
  );
}

export default DailySummaryListPage;
