import { useState } from "react";

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    rollNumber: "",
    department: "",
    email: "",
    age: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newStudent = {
      ...form,
      age: Number(form.age),
      id: Date.now(),
    };

    setStudents([...students, newStudent]);

    setForm({
      name: "",
      rollNumber: "",
      department: "",
      email: "",
      age: "",
    });
  }

  function deleteStudent(id) {
    setStudents(students.filter((student) => student.id !== id));
  }

  return (
    <section className="student-section">
      <h2>Student Management</h2>
      <p>Register students and manage their details.</p>

      <form className="student-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Student Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="rollNumber"
          placeholder="Roll Number"
          value={form.rollNumber}
          onChange={handleChange}
          required
        />

        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="age"
          type="number"
          placeholder="Age"
          min="1"
          value={form.age}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Student</button>
      </form>

      <h3>Student Records</h3>

      <div className="table-wrapper">
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll Number</th>
              <th>Department</th>
              <th>Email</th>
              <th>Age</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="6">No students added yet.</td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.rollNumber}</td>
                  <td>{student.department}</td>
                  <td>{student.email}</td>
                  <td>{student.age}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => deleteStudent(student.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default StudentManagement;