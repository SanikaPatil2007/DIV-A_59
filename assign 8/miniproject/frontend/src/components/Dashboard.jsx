
function Dashboard() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Hostel Management System</h1>
          <p>Manage your hostel from one place.</p>
        </div>
        <span className="admin-badge">Admin Panel</span>
      </header>

      <section className="summary-grid">
        <div className="summary-card">
          <h3>Total Students</h3>
          <p>120</p>
        </div>

        <div className="summary-card">
          <h3>Total Rooms</h3>
          <p>40</p>
        </div>

        <div className="summary-card">
          <h3>Available Rooms</h3>
          <p>8</p>
        </div>

        <div className="summary-card">
          <h3>Hostel Staff</h3>
          <p>12</p>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Hostel Modules</h2>

        <div className="module-grid">
          <div className="module-card">Student Management</div>
          <div className="module-card">Room Management</div>
          <div className="module-card">Student Results</div>
          <div className="module-card">Employee Registration</div>
          <div className="module-card">Expense Tracker</div>
          <div className="module-card">Student Records API</div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
