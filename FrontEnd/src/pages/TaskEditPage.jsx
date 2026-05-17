import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getTask, updateTask } from "../api/api.js";
import TaskForm from "../components/TaskForm.jsx";

function TaskEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dueDate: "",
    status: "pending"
  });

  useEffect(() => {
    async function loadData() {
      try {
        const taskResponse = await getTask(id);
        const task = taskResponse.data;

        setFormData({
          name: task.name || "",
          description: task.description || "",
          dueDate: task.dueDate || "",
          status: task.status || "pending"
        });
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    loadData();
  }, [id]);

  function handleChange(event) {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await updateTask(id, formData);
      navigate(`/tasks/${id}`);
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <section className="page-content">
      <div className="section-header">
        <div>
          <p className="eyebrow">Task update</p>
          <h2>Edit task</h2>
        </div>
      </div>

      <TaskForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Update task"
        error={error}
      />
    </section>
  );
}

export default TaskEditPage;
