import { useState } from "react";

const initialStudent = {
    name: "",
    rollNumber: "",
    department: "",
    marks: ""
};

export default function StudentInformation({ onAddStudent }) {
    const [student, setStudent] = useState(initialStudent);

    function handleChange(event) {
        const { name, value } = event.target;
        setStudent((currentStudent) => ({
            ...currentStudent,
            [name]: value
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        onAddStudent(student);
        setStudent(initialStudent);
    }

    return (
        <section className="panel form-panel">
            <div className="panel-heading">
                <div className="icon-badge">+</div>
                <div>
                    <p className="eyebrow">New record</p>
                    <h2>Add student</h2>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="field-group">
                    <label htmlFor="name">Student name</label>
                    <input id="name" name="name" type="text" placeholder="e.g. Aanya Sharma" value={student.name} onChange={handleChange} required />
                </div>
                <div className="field-group">
                    <label htmlFor="rollNumber">Roll number</label>
                    <input id="rollNumber" name="rollNumber" type="text" placeholder="e.g. CS-2041" value={student.rollNumber} onChange={handleChange} required />
                </div>
                <div className="field-group">
                    <label htmlFor="department">Department</label>
                    <select id="department" name="department" value={student.department} onChange={handleChange} required>
                        <option value="">Select a department</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Business Administration">Business Administration</option>
                    </select>
                </div>
                <div className="field-group">
                    <label htmlFor="marks">Marks <span>(out of 100)</span></label>
                    <input id="marks" name="marks" type="number" min="0" max="100" placeholder="e.g. 88" value={student.marks} onChange={handleChange} required />
                </div>
                <div className="form-actions">
                    <button className="primary-button" type="submit">Save student <span aria-hidden="true">→</span></button>
                    <button className="text-button" type="button" onClick={() => setStudent(initialStudent)}>Clear</button>
                </div>
            </form>
        </section>
    );
}
