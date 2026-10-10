import { useState } from "react";
import "./App.css";

const initialStudents = [
  {
    id: 1,
    name: "Aarav Sharma",
    rollNumber: "IT101",
    room: "101",
    phone: "9876543210",
  },
  {
    id: 2,
    name: "Priya Patil",
    rollNumber: "IT102",
    room: "102",
    phone: "9876543211",
  },
];

const initialComplaints = [
  {
    id: 1,
    student: "Aarav Sharma",
    category: "Maintenance",
    description: "Room light is not working",
    status: "Pending",
  },
];

const initialFees = [
  {
    id: 1,
    student: "Aarav Sharma",
    amount: 30000,
    paid: 20000,
  },
  {
    id: 2,
    student: "Priya Patil",
    amount: 30000,
    paid: 30000,
  },
];

function App() {
  const [role, setRole] = useState("Rector");
  const [activeSection, setActiveSection] = useState("Dashboard");

  const [students, setStudents] = useState(initialStudents);
  const [complaints, setComplaints] = useState(initialComplaints);
  const [fees, setFees] = useState(initialFees);

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
    paid: "",
  });

  const menuItems = [
    "Dashboard",
    "Complaints",
    "Fee Management",
    "Student Details",
  ];

  const totalRooms = 40;
  const occupiedRooms = students.length;
  const availableRooms = Math.max(totalRooms - occupiedRooms, 0);
  const pendingFees = fees.reduce(
    (sum, fee) => sum + Math.max(Number(fee.amount) - Number(fee.paid), 0),
    0
  );

  function resetStudentForm() {
    setStudentForm({ name: "", rollNumber: "", room: "", phone: "" });
    setEditingStudent(null);
  }

  function saveStudent(event) {
    event.preventDefault();

    if (editingStudent !== null) {
      setStudents((current) =>
        current.map((student) =>
          student.id === editingStudent
            ? { ...studentForm, id: editingStudent }
            : student
        )
      );
    } else {
      setStudents((current) => [
        ...current,
        { ...studentForm, id: Date.now() },
      ]);
    }

    resetStudentForm();
  }

  function editStudent(student) {
    setStudentForm({
      name: student.name,
      rollNumber: student.rollNumber,
      room: student.room,
      phone: student.phone,
    });
    setEditingStudent(student.id);
    setActiveSection("Student Details");
  }

  function deleteStudent(id) {
    if (!window.confirm("Delete this student record?")) return;

    setStudents((current) => current.filter((student) => student.id !== id));
  }

  function saveComplaint(event) {
    event.preventDefault();

    setComplaints((current) => [
      ...current,
      {
        ...complaintForm,
        id: Date.now(),
        status: "Pending",
      },
    ]);

    setComplaintForm({
      student: "",
      category: "Maintenance",
      description: "",
    });
  }

  function updateComplaintStatus(id, status) {
    setComplaints((current) =>
      current.map((complaint) =>
        complaint.id === id ? { ...complaint, status } : complaint
      )
    );
  }

  function deleteComplaint(id) {
    if (!window.confirm("Delete this complaint?")) return;

    setComplaints((current) =>
      current.filter((complaint) => complaint.id !== id)
    );
  }

  function saveFee(event) {
    event.preventDefault();

    setFees((current) => [
      ...current,
      {
        id: Date.now(),
        student: feeForm.student,
        amount: Number(feeForm.amount),
        paid: Number(feeForm.paid),
      },
    ]);

    setFeeForm({ student: "", amount: "", paid: "" });
  }

  function updateFeePayment(id, paid) {
    setFees((current) =>
      current.map((fee) =>
        fee.id === id
          ? { ...fee, paid: Math.min(Math.max(Number(paid), 0), fee.amount) }
          : fee
      )
    );
  }

  function deleteFee(id) {
    if (!window.confirm("Delete this fee record?")) return;

    setFees((current) => current.filter((fee) => fee.id !== id));
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2>Hostel<span>Care</span></h2>
        <p className="sidebar-label">HOSTEL MANAGEMENT</p>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item}
              className={
                activeSection === item ? "nav-item active" : "nav-item"
              }
              onClick={() => setActiveSection(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="role-switch">
          <label htmlFor="role">View application as</label>
          <select
            id="role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="Rector">Rector</option>
            <option value="Student">Student</option>
          </select>
        </div>

        <div className="sidebar-footer">HostelCare Management</div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>{activeSection}</h1>
            <p>Welcome to your hostel portal.</p>
          </div>
          <span className="admin-label">{role} Panel</span>
        </header>

        {activeSection === "Dashboard" && (
          <>
            <section className="welcome-banner">
              <h2>
                {role === "Rector"
                  ? "Welcome, Rector!"
                  : "Welcome to your Hostel Portal!"}
              </h2>
              <p>
                {role === "Rector"
                  ? "View and manage hostel operations."
                  : "View hostel information, fees and complaints."}
              </p>
            </section>

            <section className="stats-grid">
              <article className="stat-card">
                <span>Total Students</span>
                <h2>{students.length}</h2>
                <p>Registered hostel students</p>
              </article>
              <article className="stat-card">
                <span>Total Rooms</span>
                <h2>{totalRooms}</h2>
                <p>Hostel room capacity</p>
              </article>
              <article className="stat-card">
                <span>Occupied Rooms</span>
                <h2>{occupiedRooms}</h2>
                <p>Based on registered students</p>
              </article>
              <article className="stat-card">
                <span>Available Rooms</span>
                <h2>{availableRooms}</h2>
                <p>Estimated room availability</p>
              </article>
              <article className="stat-card">
                <span>Pending Fees</span>
                <h2>₹{pendingFees.toLocaleString("en-IN")}</h2>
                <p>Outstanding fee balance</p>
              </article>
              <article className="stat-card">
                <span>Open Complaints</span>
                <h2>
                  {complaints.filter((c) => c.status !== "Resolved").length}
                </h2>
                <p>Complaints needing attention</p>
              </article>
            </section>

            <section className="content-card">
              <h2>Quick Access</h2>
              <div className="quick-links">
                {menuItems.slice(1).map((item) => (
                  <button key={item} onClick={() => setActiveSection(item)}>
                    {item} →
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {activeSection === "Student Details" && (
          <>
            <section className="content-card">
              <h2>Student Details</h2>

              {role === "Rector" && (
                <form className="data-form" onSubmit={saveStudent}>
                  <input
                    placeholder="Student name"
                    value={studentForm.name}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, name: e.target.value })
                    }
                    required
                  />
                  <input
                    placeholder="Roll number"
                    value={studentForm.rollNumber}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        rollNumber: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    placeholder="Room number"
                    value={studentForm.room}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, room: e.target.value })
                    }
                    required
                  />
                  <input
                    placeholder="Phone number"
                    type="tel"
                    value={studentForm.phone}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, phone: e.target.value })
                    }
                    required
                  />
                  <button type="submit">
                    {editingStudent !== null ? "Update Student" : "Add Student"}
                  </button>
                  {editingStudent !== null && (
                    <button type="button" className="secondary-button" onClick={resetStudentForm}>
                      Cancel Edit
                    </button>
                  )}
                </form>
              )}

              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Roll Number</th>
                      <th>Room</th>
                      <th>Phone</th>
                      {role === "Rector" && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.rollNumber}</td>
                        <td>{student.room}</td>
                        <td>{student.phone}</td>
                        {role === "Rector" && (
                          <td className="action-cell">
                            <button className="edit-button" onClick={() => editStudent(student)}>
                              Edit
                            </button>
                            <button className="delete-button" onClick={() => deleteStudent(student.id)}>
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr>
                        <td colSpan={role === "Rector" ? 5 : 4}>No student records available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {activeSection === "Complaints" && (
          <>
            {role === "Student" && (
              <section className="content-card">
                <h2>Submit a Complaint</h2>
                <form className="data-form" onSubmit={saveComplaint}>
                  <input
                    placeholder="Your name"
                    value={complaintForm.student}
                    onChange={(e) =>
                      setComplaintForm({
                        ...complaintForm,
                        student: e.target.value,
                      })
                    }
                    required
                  />
                  <select
                    value={complaintForm.category}
                    onChange={(e) =>
                      setComplaintForm({
                        ...complaintForm,
                        category: e.target.value,
                      })
                    }
                  >
                    <option>Maintenance</option>
                    <option>Cleaning</option>
                    <option>Water Supply</option>
                    <option>Electricity</option>
                    <option>Other</option>
                  </select>
                  <textarea
                    placeholder="Describe your complaint"
                    value={complaintForm.description}
                    onChange={(e) =>
                      setComplaintForm({
                        ...complaintForm,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                  <button type="submit">Submit Complaint</button>
                </form>
              </section>
            )}

            <section className="content-card">
              <h2>{role === "Rector" ? "All Complaints" : "My Complaints"}</h2>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Status</th>
                      {role === "Rector" && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((complaint) => (
                      <tr key={complaint.id}>
                        <td>{complaint.student}</td>
                        <td>{complaint.category}</td>
                        <td>{complaint.description}</td>
                        <td>
                          {role === "Rector" ? (
                            <select
                              value={complaint.status}
                              onChange={(e) =>
                                updateComplaintStatus(complaint.id, e.target.value)
                              }
                            >
                              <option>Pending</option>
                              <option>In Progress</option>
                              <option>Resolved</option>
                            </select>
                          ) : (
                            <span className="status-label">{complaint.status}</span>
                          )}
                        </td>
                        {role === "Rector" && (
                          <td>
                            <button className="delete-button" onClick={() => deleteComplaint(complaint.id)}>
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {complaints.length === 0 && (
                      <tr>
                        <td colSpan={role === "Rector" ? 5 : 4}>No complaints available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {activeSection === "Fee Management" && (
          <>
            {role === "Rector" && (
              <section className="content-card">
                <h2>Add Fee Record</h2>
                <form className="data-form" onSubmit={saveFee}>
                  <input
                    placeholder="Student name"
                    value={feeForm.student}
                    onChange={(e) =>
                      setFeeForm({ ...feeForm, student: e.target.value })
                    }
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Total fee (₹)"
                    value={feeForm.amount}
                    onChange={(e) =>
                      setFeeForm({ ...feeForm, amount: e.target.value })
                    }
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    max={feeForm.amount || undefined}
                    placeholder="Amount paid (₹)"
                    value={feeForm.paid}
                    onChange={(e) =>
                      setFeeForm({ ...feeForm, paid: e.target.value })
                    }
                    required
                  />
                  <button type="submit">Add Fee Record</button>
                </form>
              </section>
            )}

            <section className="content-card">
              <h2>{role === "Rector" ? "All Fee Records" : "Fee Records"}</h2>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Total Fee</th>
                      <th>Paid</th>
                      <th>Pending</th>
                      <th>Status</th>
                      {role === "Rector" && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map((fee) => (
                      <tr key={fee.id}>
                        <td>{fee.student}</td>
                        <td>₹{Number(fee.amount).toLocaleString("en-IN")}</td>
                        <td>
                          {role === "Rector" ? (
                            <input
                              className="paid-input"
                              type="number"
                              min="0"
                              max={fee.amount}
                              value={fee.paid}
                              onChange={(e) => updateFeePayment(fee.id, e.target.value)}
                            />
                          ) : (
                            `₹${Number(fee.paid).toLocaleString("en-IN")}`
                          )}
                        </td>
                        <td>₹{Math.max(fee.amount - fee.paid, 0).toLocaleString("en-IN")}</td>
                        <td>
                          <span className="status-label">
                            {fee.paid >= fee.amount ? "Paid" : "Pending"}
                          </span>
                        </td>
                        {role === "Rector" && (
                          <td>
                            <button className="delete-button" onClick={() => deleteFee(fee.id)}>
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {fees.length === 0 && (
                      <tr>
                        <td colSpan={role === "Rector" ? 6 : 5}>No fee records available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;