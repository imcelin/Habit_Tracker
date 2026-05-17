import { Route, Routes } from "react-router-dom";

import Navigation from "./components/Navigation.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import TaskListPage from "./pages/TaskListPage.jsx";
import TaskDetailPage from "./pages/TaskDetailPage.jsx";
import TaskCreatePage from "./pages/TaskCreatePage.jsx";
import TaskEditPage from "./pages/TaskEditPage.jsx";
import DailySummaryListPage from "./pages/DailySummaryListPage.jsx";
import DailySummaryDetailPage from "./pages/DailySummaryDetailPage.jsx";

function App() {
  return (
    <div className="app-shell">
      <Navigation />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tasks" element={<TaskListPage />} />
          <Route path="/tasks/create" element={<TaskCreatePage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="/tasks/:id/edit" element={<TaskEditPage />} />
          <Route path="/summaries" element={<DailySummaryListPage />} />
          <Route path="/summaries/:id" element={<DailySummaryDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
