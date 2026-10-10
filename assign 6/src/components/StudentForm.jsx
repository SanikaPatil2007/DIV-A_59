
import { useState } from "react";

function StudentForm({ onAddStudent }) {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [marks, setMarks] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const student = {
      name,
      rollNumber,
      department,
      marks
    };

    onAddStudent(student);

    setName("");
    setRollNumber("");
    setDepartment("");
    setMarks("");
  };

  return (
    <div className="form-card">
      <h2>Student Form</h2>

      <form onSubmit={handleSubmit}>
        <label>Student Name</label>
        <input
          type="text"
          placeholder="Enter student name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Roll Number</label>
        <input
          type="text"
          placeholder="Enter roll number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          required
        />

        <label>Department</label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        >
          <option value="">Select Department</option>
          <option value="Information Technology">
            Information Technology
          </option>
          <option value="Computer Engineering">
            Computer Engineering
          </option>
          <option value="Mechanical Engineering">
            Mechanical Engineering
          </option>
          <option value="Civil Engineering">
            Civil Engineering
          </option>
          <option value="Electronics Engineering">
            Electronics Engineering
          </option>
        </select>

        <label>Marks (out of 100)</label>
        <input
          type="number"
          placeholder="Enter marks"
          min="0"
          max="100"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          required
        />

        <button type="submit">Add Student</button>
      </form>
    </div>
  );
}

export default StudentForm;
