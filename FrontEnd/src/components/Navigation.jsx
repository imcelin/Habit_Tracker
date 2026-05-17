import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <header className="topbar">
      <div className="brand-block">
        <h1>
          <NavLink to="/">Habit Tracker</NavLink>
        </h1>
      </div>
      <nav className="nav-links">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/tasks">Tasks</NavLink>
        <NavLink to="/summaries">Daily Summaries</NavLink>
      </nav>
    </header>
  );
}

export default Navigation;
