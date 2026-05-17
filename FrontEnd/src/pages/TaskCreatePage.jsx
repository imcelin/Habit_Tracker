import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createTask } from "../api/api.js";
import TaskForm from "../components/TaskForm.jsx";

function TaskCreatePage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dueDate: "",
    status: "pending"
  });

  function handleChange(event) {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await createTask(formData);
      navigate("/tasks");
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <section className="page-content">
      <div className="section-header">
        <div>
          <p className="eyebrow">New task</p>
          <h2>Create task</h2>
        </div>
      </div>

      <TaskForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Save task"
        error={error}
      />
    </section>
  );
}

export default TaskCreatePage;
