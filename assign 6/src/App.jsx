
import { useState } from "react";
import StudentForm from "./components/StudentForm";
import StudentDetails from "./components/StudentDetails";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);

  const addStudent = (newStudent) => {
    setStudents((previousStudents) => [
      ...previousStudents,
      newStudent
    ]);
  };

  return (
    <div className="app">
      <h1>Student Information System</h1>

      <StudentForm onAddStudent={addStudent} />

      <StudentDetails students={students} />
    </div>
  );
}

export default App;
