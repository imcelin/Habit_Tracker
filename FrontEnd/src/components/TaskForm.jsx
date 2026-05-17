function TaskForm({ formData, onChange, onSubmit, submitLabel, error }) {
  return (
    <form className="card form-card" onSubmit={onSubmit}>
      <div className="form-grid">
        <label>
          Task name
          <input name="name" value={formData.name} onChange={onChange} />
        </label>

        <label>
          Due date
          <input name="dueDate" type="date" value={formData.dueDate} onChange={onChange} />
        </label>

        <label>
          Status
          <select name="status" value={formData.status} onChange={onChange}>
            <option value="pending">pending</option>
            <option value="completed">completed</option>
          </select>
        </label>
      </div>

      <label>
        Description
        <textarea
          name="description"
          rows="4"
          value={formData.description}
          onChange={onChange}
        />
      </label>

      {error ? <p className="message error-message">{error}</p> : null}

      <button className="primary-button" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}

export default TaskForm;
