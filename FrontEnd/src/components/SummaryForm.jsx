function SummaryForm({ formData, onChange, onSubmit, submitLabel, error }) {
  return (
    <form className="card form-card" onSubmit={onSubmit}>
      <label>
        Date
        <input name="date" type="date" value={formData.date} onChange={onChange} />
      </label>

      {error ? <p className="message error-message">{error}</p> : null}

      <button className="primary-button" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}

export default SummaryForm;
