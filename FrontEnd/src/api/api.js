const BASE_URL = "http://localhost:3000";

async function callApi(path, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json"
      },
      ...options
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.message || "Request failed.");
    }

    return data;
  } catch (error) {
    if (error.name === "TypeError") {
      throw new Error("Cannot connect to backend. Check if backend is running on port 3000.");
    }

    throw error;
  }
}

export function getTaskList() {
  return callApi("/task/list");
}

export function getTask(id) {
  return callApi(`/task/get/${id}`);
}

export function createTask(taskData) {
  return callApi("/task/create", {
    method: "POST",
    body: JSON.stringify(taskData)
  });
}

export function updateTask(id, taskData) {
  return callApi(`/task/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(taskData)
  });
}

export function deleteTask(id) {
  return callApi(`/task/delete/${id}`, {
    method: "DELETE"
  });
}

export function getSummaryList() {
  return callApi("/daily-summary/list");
}

export function getSummary(id) {
  return callApi(`/daily-summary/get/${id}`);
}

export function createSummary(summaryData) {
  return callApi("/daily-summary/create", {
    method: "POST",
    body: JSON.stringify(summaryData)
  });
}

export function updateSummary(id, summaryData) {
  return callApi(`/daily-summary/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(summaryData)
  });
}

export function deleteSummary(id) {
  return callApi(`/daily-summary/delete/${id}`, {
    method: "DELETE"
  });
}
