export default function StudentList({ students }) {
    if (students.length === 0) {
        return (
            <section className="panel details-panel empty-state">
                <div className="empty-mark">◎</div>
                <p className="eyebrow">Student details</p>
                <h2>Your records will appear here</h2>
                <p>Complete the form to create a neatly formatted student profile.</p>
            </section>
        );
    }

    return (
        <section className="panel details-panel student-list-panel">
            <div className="details-topline">
                <div>
                    <p className="eyebrow">Student details</p>
                    <h2>Saved students</h2>
                </div>
                <span className="status status-pass">{students.length} saved</span>
            </div>
            <div className="student-list">
                {students.map((student) => {
                    const marks = Number(student.marks);
                    const passed = marks >= 40;

                    return (
                        <article className="student-item" key={student.id}>
                            <div className="student-summary">
                                <div className="avatar">{student.name.charAt(0).toUpperCase()}</div>
                                <div>
                                    <h3>{student.name}</h3>
                                    <p className="summary-label">Roll number</p>
                                    <strong>{student.rollNumber}</strong>
                                </div>
                                <span className={`status ${passed ? "status-pass" : "status-review"}`}>{passed ? "Pass" : "Needs improvement"}</span>
                            </div>
                            <dl className="details-list">
                                <div><dt>Department</dt><dd>{student.department}</dd></div>
                                <div><dt>Marks scored</dt><dd>{student.marks}<span>/100</span></dd></div>
                            </dl>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
