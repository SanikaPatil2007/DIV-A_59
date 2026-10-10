
function StudentDetails({ students }) {
  return (
    <div className="details-card">
      <h2>Student Details</h2>

      {students.length === 0 ? (
        <p>No student records available. Please add a student.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll Number</th>
              <th>Department</th>
              <th>Marks</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.name}</td>
                <td>{student.rollNumber}</td>
                <td>{student.department}</td>
                <td>{student.marks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentDetails;
