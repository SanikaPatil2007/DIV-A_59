
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [students, setStudents] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [studentForm, setStudentForm] = useState({
    name: "",
    rollNumber: "",
    room: "",
    phone: "",
  });

  const [editingStudent, setEditingStudent] = useState(null);

  const [complaintForm, setComplaintForm] = useState({
    student: "",
    category: "Maintenance",
    description: "",
  });

  const [feeForm, setFeeForm] = useState({
    student: "",
    amount: "",
    paid: "0",
  });

  async function apiRequest(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || data.error || "Request failed.");
    }

    return data;
  }

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [studentData, complaintData, feeData] = await Promise.all([
        apiRequest("/students"),
        apiRequest("/complaints"),
        apiRequest("/fees"),
      ]);

      setStudents(Array.isArray(studentData) ? studentData : []);
      setComplaints(Array.isArray(complaintData) ? complaintData : []);
      setFees(Array.isArray(feeData) ? feeData : []);
    } catch (err) {
      setError(
        `${err.message} Check that MongoDB and the backend server are running.`
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function notify(message) {
    setSuccess(message);
    setError("");

    window.setTimeout(() => {
      setSuccess("");
    }, 3000);
  }

  function updateStudentForm(event) {
    setStudentForm({
      ...studentForm,
      [event.target.name]: event.target.value,
    });
  }

  async function handleStudentSubmit(event) {
    event.preventDefault();

    try {
      const url = editingStudent
        ? `/students/${editingStudent}`
        : "/students";

      const method = editingStudent ? "PUT" : "POST";

      await apiRequest(url, {
        method,
        body: JSON.stringify(studentForm),
      });

      setStudentForm({
        name: "",
        rollNumber: "",
        room: "",
        phone: "",
      });

      setEditingStudent(null);
      await loadData();
      notify(editingStudent ? "Student updated successfully." : "Student added successfully.");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  }

  function handleStudentEdit(student) {
    setEditingStudent(student._id);

    setStudentForm({
      name: student.name || "",
      rollNumber: student.rollNumber || "",
      room: student.room || "",
      phone: student.phone || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleStudentDelete(id) {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await apiRequest(`/students/${id}`, { method: "DELETE" });
      await loadData();
      notify("Student deleted successfully.");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  }

  async function handleComplaintSubmit(event) {
    event.preventDefault();

    try {
      await apiRequest("/complaints", {
        method: "POST",
        body: JSON.stringify(complaintForm),
      });

      setComplaintForm({
        student: "",
        category: "Maintenance",
        description: "",
      });

      await loadData();
      notify("Complaint submitted successfully.");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  }

  async function handleComplaintStatus(id, status) {
    try {
      await apiRequest(`/complaints/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      await loadData();
      notify("Complaint status updated.");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  }

  async function handleComplaintDelete(id) {
    if (!window.confirm("Are you sure you want to delete this complaint?")) {
      return;
    }

    try {
      await apiRequest(`/complaints/${id}`, { method: "DELETE" });
      await loadData();
      notify("Complaint deleted successfully.");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  }

  async function handleFeeSubmit(event) {
    event.preventDefault();

    const amount = Number(feeForm.amount);
    const paid = Number(feeForm.paid);

    if (!Number.isFinite(amount) || amount < 0) {
      setError("Enter a valid fee amount.");
      return;
    }

    if (!Number.isFinite(paid) || paid < 0 || paid > amount) {
      setError("Paid amount must be between zero and the total amount.");
      return;
    }

    try {
      await apiRequest("/fees", {
        method: "POST",
        body: JSON.stringify({
          student: feeForm.student,
          amount,
          paid,
        }),
      });

      setFeeForm({
        student: "",
        amount: "",
        paid: "0",
      });

      await loadData();
      notify("Fee record added successfully.");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  }

  async function handleFeePayment(fee) {
    const remaining = Number(fee.amount) - Number(fee.paid);
    const entered = window.prompt(
      `Remaining amount: ₹${remaining}\nEnter the new total paid amount:`,
      String(fee.paid)
    );

    if (entered === null) return;

    const paid = Number(entered);

    if (!Number.isFinite(paid) || paid < 0 || paid > Number(fee.amount)) {
      setError("Paid amount must be between zero and the total amount.");
      setSuccess("");
      return;
    }

    try {
      await apiRequest(`/fees/${fee._id}`, {
        method: "PUT",
        body: JSON.stringify({ paid }),
      });

      await loadData();
      notify("Payment updated successfully.");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  }

  async function handleFeeDelete(id) {
    if (!window.confirm("Are you sure you want to delete this fee record?")) {
      return;
    }

    try {
      await apiRequest(`/fees/${id}`, { method: "DELETE" });
      await loadData();
      notify("Fee record deleted successfully.");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  }

  const totalFees = fees.reduce(
    (sum, fee) => sum + Number(fee.amount || 0),
    0
  );

  const totalPaid = fees.reduce(
    (sum, fee) => sum + Number(fee.paid || 0),
    0
  );

  const totalPending = totalFees - totalPaid;

  const menuItems = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Students", icon: "♙" },
    { name: "Complaints", icon: "▤" },
    { name: "Fees", icon: "₹" },
  ];

  function formatDate(date) {
    if (!date) return "—";

    const parsed = new Date(date);

    return Number.isNaN(parsed.getTime())
      ? "—"
      : parsed.toLocaleDateString("en-IN");
  }

  function getStatusClass(status) {
    return String(status || "")
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">H</div>
          <div>
            <h2>HostelCare</h2>
            <p>Management Portal</p>
          </div>
        </div>

        <div className="sidebar-label">MAIN MENU</div>

        <nav className="navigation">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => {
                setActivePage(item.name);
                setError("");
                setSuccess("");
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="profile-avatar">A</div>
          <div>
            <strong>Administrator</strong>
            <p>Hostel Manager</p>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">HostelCare / {activePage}</p>
            <h1>{activePage}</h1>
          </div>

          <button className="refresh-button" onClick={loadData}>
            ↻ Refresh Data
          </button>
        </header>

        <section className="page-content">
          {error && (
            <div className="alert error-alert">
              <span>{error}</span>
              <button onClick={() => setError("")}>×</button>
            </div>
          )}

          {success && (
            <div className="alert success-alert">
              <span>{success}</span>
              <button onClick={() => setSuccess("")}>×</button>
            </div>
          )}

          {loading && (
            <div className="loading-message">Loading data from server...</div>
          )}

          {!loading && activePage === "Dashboard" && (
            <>
              <section className="welcome-banner">
                <div>
                  <p className="eyebrow">HOSTEL ADMINISTRATION</p>
                  <h2>Welcome to HostelCare 👋</h2>
                  <p>
                    Manage students, complaints, and fee records from one
                    place.
                  </p>
                </div>
                <div className="banner-symbol">⌂</div>
              </section>

              <section className="stats-grid">
                <div className="stat-card blue-card">
                  <div className="stat-icon">♙</div>
                  <p>Total Students</p>
                  <h2>{students.length}</h2>
                  <span>Registered students</span>
                </div>

                <div className="stat-card purple-card">
                  <div className="stat-icon">▤</div>
                  <p>Total Complaints</p>
                  <h2>{complaints.length}</h2>
                  <span>
                    {
                      complaints.filter(
                        (c) =>
                          String(c.status).toLowerCase() !== "resolved"
                      ).length
                    }{" "}
                    not resolved
                  </span>
                </div>

                <div className="stat-card green-card">
                  <div className="stat-icon">₹</div>
                  <p>Total Fees Collected</p>
                  <h2>₹{totalPaid.toLocaleString("en-IN")}</h2>
                  <span>Payments received</span>
                </div>

                <div className="stat-card orange-card">
                  <div className="stat-icon">!</div>
                  <p>Pending Fees</p>
                  <h2>₹{totalPending.toLocaleString("en-IN")}</h2>
                  <span>Outstanding balance</span>
                </div>
              </section>

              <section className="content-card">
                <div className="section-heading">
                  <div>
                    <h2>Recent Students</h2>
                    <p>Recently registered hostel students</p>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => setActivePage("Students")}
                  >
                    View all →
                  </button>
                </div>

                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Roll Number</th>
                        <th>Room</th>
                        <th>Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.slice(-5).reverse().map((student) => (
                        <tr key={student._id}>
                          <td>{student.name}</td>
                          <td>{student.rollNumber}</td>
                          <td>{student.room}</td>
                          <td>{student.phone}</td>
                        </tr>
                      ))}

                      {students.length === 0 && (
                        <tr>
                          <td colSpan="4" className="empty-state">
                            No students registered yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {!loading && activePage === "Students" && (
            <>
              <section className="content-card">
                <div className="section-heading">
                  <div>
                    <h2>{editingStudent ? "Edit Student" : "Add Student"}</h2>
                    <p>
                      Student information is saved in the MongoDB database.
                    </p>
                  </div>
                </div>

                <form className="data-form" onSubmit={handleStudentSubmit}>
                  <div className="form-field">
                    <label>Student Name</label>
                    <input
                      name="name"
                      value={studentForm.name}
                      onChange={updateStudentForm}
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>Roll Number</label>
                    <input
                      name="rollNumber"
                      value={studentForm.rollNumber}
                      onChange={updateStudentForm}
                      placeholder="Enter roll number"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>Room Number</label>
                    <input
                      name="room"
                      value={studentForm.room}
                      onChange={updateStudentForm}
                      placeholder="Enter room number"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>Phone Number</label>
                    <input
                      name="phone"
                      type="tel"
                      value={studentForm.phone}
                      onChange={updateStudentForm}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="primary-button">
                      {editingStudent ? "Update Student" : "Add Student"}
                    </button>

                    {editingStudent && (
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                          setEditingStudent(null);
                          setStudentForm({
                            name: "",
                            rollNumber: "",
                            room: "",
                            phone: "",
                          });
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </section>

              <section className="content-card">
                <div className="section-heading">
                  <div>
                    <h2>Student Records</h2>
                    <p>{students.length} registered students</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Roll Number</th>
                        <th>Room</th>
                        <th>Phone</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student._id}>
                          <td>{student.name}</td>
                          <td>{student.rollNumber}</td>
                          <td>{student.room}</td>
                          <td>{student.phone}</td>
                          <td>
                            <div className="table-actions">
                              <button
                                className="edit-button"
                                onClick={() => handleStudentEdit(student)}
                              >
                                Edit
                              </button>
                              <button
                                className="delete-button"
                                onClick={() =>
                                  handleStudentDelete(student._id)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {students.length === 0 && (
                        <tr>
                          <td colSpan="5" className="empty-state">
                            No student records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {!loading && activePage === "Complaints" && (
            <>
              <section className="content-card">
                <div className="section-heading">
                  <div>
                    <h2>Submit a Complaint</h2>
                    <p>Report a hostel issue for the administrator.</p>
                  </div>
                </div>

                <form className="data-form" onSubmit={handleComplaintSubmit}>
                  <div className="form-field">
                    <label>Student Name</label>
                    <select
                      value={complaintForm.student}
                      onChange={(event) =>
                        setComplaintForm({
                          ...complaintForm,
                          student: event.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select student</option>
                      {students.map((student) => (
                        <option key={student._id} value={student.name}>
                          {student.name} ({student.rollNumber})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Complaint Category</label>
                    <select
                      value={complaintForm.category}
                      onChange={(event) =>
                        setComplaintForm({
                          ...complaintForm,
                          category: event.target.value,
                        })
                      }
                      required
                    >
                      <option value="Maintenance">Maintenance</option>
                      <option value="Cleanliness">Cleanliness</option>
                      <option value="Food">Food</option>
                      <option value="Water">Water</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-field full-width">
                    <label>Complaint Description</label>
                    <textarea
                      value={complaintForm.description}
                      onChange={(event) =>
                        setComplaintForm({
                          ...complaintForm,
                          description: event.target.value,
                        })
                      }
                      placeholder="Describe the issue..."
                      rows="4"
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="primary-button"
                      disabled={students.length === 0}
                    >
                      Submit Complaint
                    </button>
                  </div>

                  {students.length === 0 && (
                    <p className="helper-text">
                      Add a student first to submit a complaint.
                    </p>
                  )}
                </form>
              </section>

              <section className="content-card">
                <div className="section-heading">
                  <div>
                    <h2>Complaint Records</h2>
                    <p>{complaints.length} complaints recorded</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map((complaint) => (
                        <tr key={complaint._id}>
                          <td>{complaint.student}</td>
                          <td>{complaint.category}</td>
                          <td className="description-cell">
                            {complaint.description}
                          </td>
                          <td>{formatDate(complaint.createdAt)}</td>
                          <td>
                            <span
                              className={`status-label ${getStatusClass(
                                complaint.status
                              )}`}
                            >
                              {complaint.status}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <select
                                aria-label="Update complaint status"
                                className="status-select"
                                value={complaint.status}
                                onChange={(event) =>
                                  handleComplaintStatus(
                                    complaint._id,
                                    event.target.value
                                  )
                                }
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                              </select>

                              <button
                                className="delete-button"
                                onClick={() =>
                                  handleComplaintDelete(complaint._id)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {complaints.length === 0 && (
                        <tr>
                          <td colSpan="6" className="empty-state">
                            No complaints submitted yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {!loading && activePage === "Fees" && (
            <>
              <section className="stats-grid fee-summary">
                <div className="stat-card green-card">
                  <div className="stat-icon">₹</div>
                  <p>Total Fees</p>
                  <h2>₹{totalFees.toLocaleString("en-IN")}</h2>
                </div>

                <div className="stat-card blue-card">
                  <div className="stat-icon">✓</div>
                  <p>Total Paid</p>
                  <h2>₹{totalPaid.toLocaleString("en-IN")}</h2>
                </div>

                <div className="stat-card orange-card">
                  <div className="stat-icon">!</div>
                  <p>Pending Amount</p>
                  <h2>₹{totalPending.toLocaleString("en-IN")}</h2>
                </div>
              </section>

              <section className="content-card">
                <div className="section-heading">
                  <div>
                    <h2>Add Fee Record</h2>
                    <p>Record the total fee and amount already paid.</p>
                  </div>
                </div>

                <form className="data-form" onSubmit={handleFeeSubmit}>
                  <div className="form-field">
                    <label>Student</label>
                    <select
                      value={feeForm.student}
                      onChange={(event) =>
                        setFeeForm({
                          ...feeForm,
                          student: event.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select student</option>
                      {students.map((student) => (
                        <option key={student._id} value={student.name}>
                          {student.name} ({student.rollNumber})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Total Fee (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={feeForm.amount}
                      onChange={(event) =>
                        setFeeForm({
                          ...feeForm,
                          amount: event.target.value,
                        })
                      }
                      placeholder="Enter total fee"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>Amount Paid (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={feeForm.paid}
                      onChange={(event) =>
                        setFeeForm({
                          ...feeForm,
                          paid: event.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="primary-button"
                      disabled={students.length === 0}
                    >
                      Add Fee Record
                    </button>
                  </div>

                  {students.length === 0 && (
                    <p className="helper-text">
                      Add a student first to create a fee record.
                    </p>
                  )}
                </form>
              </section>

              <section className="content-card">
                <div className="section-heading">
                  <div>
                    <h2>Fee Records</h2>
                    <p>{fees.length} fee records found</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Total Fee</th>
                        <th>Paid</th>
                        <th>Pending</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fees.map((fee) => {
                        const amount = Number(fee.amount || 0);
                        const paid = Number(fee.paid || 0);
                        const pending = amount - paid;
                        const paidInFull = pending <= 0;

                        return (
                          <tr key={fee._id}>
                            <td>{fee.student}</td>
                            <td>₹{amount.toLocaleString("en-IN")}</td>
                            <td>₹{paid.toLocaleString("en-IN")}</td>
                            <td>₹{pending.toLocaleString("en-IN")}</td>
                            <td>
                              <span
                                className={`status-label ${
                                  paidInFull ? "resolved" : "pending"
                                }`}
                              >
                                {paidInFull ? "Paid" : "Pending"}
                              </span>
                            </td>
                            <td>
                              <div className="table-actions">
                                <button
                                  className="edit-button"
                                  onClick={() => handleFeePayment(fee)}
                                >
                                  Update Payment
                                </button>

                                <button
                                  className="delete-button"
                                  onClick={() => handleFeeDelete(fee._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {fees.length === 0 && (
                        <tr>
                          <td colSpan="6" className="empty-state">
                            No fee records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
