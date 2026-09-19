import { useState } from "react";
import StudentInformation from "./studentinformation";
import StudentList from "./studentlist";

export default function App() {
    const [students, setStudents] = useState([]);

    function addStudent(student) {
        setStudents((currentStudents) => [
            ...currentStudents,
            { ...student, id: crypto.randomUUID() }
        ]);
    }

    return (
        <div className="app-shell">
            <header className="app-header">
                <div className="brand-mark">SI</div>
                <div>
                    <p className="eyebrow">Campus records</p>
                    <h1>Student information</h1>
                </div>
            </header>
            <div className="intro-row">
                <p>Capture the essentials. Keep every student record clear and easy to read.</p>
                <span className="record-count">{students.length ? `${students.length} record${students.length === 1 ? "" : "s"} saved` : "No records yet"}</span>
            </div>
            <div className="content-grid">
                <StudentInformation onAddStudent={addStudent} />
                <StudentList students={students} />
            </div>
        </div>
    );
}
