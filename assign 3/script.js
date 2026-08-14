let students = [];


// Get grade according to percentage
function calculateGrade(percentage) {

    if (percentage >= 90) {
        return "A+";
    }
    else if (percentage >= 80) {
        return "A";
    }
    else if (percentage >= 70) {
        return "B";
    }
    else if (percentage >= 60) {
        return "C";
    }
    else if (percentage >= 50) {
        return "D";
    }
    else if (percentage >= 40) {
        return "E";
    }
    else {
        return "F";
    }
}


// Form submit event
document.getElementById("studentForm").addEventListener("submit", function(event) {

    event.preventDefault();

    // Get student details
    let name = document.getElementById("name").value;
    let roll = document.getElementById("roll").value;

    // Get marks
    let marks = [
        Number(document.getElementById("sub1").value),
        Number(document.getElementById("sub2").value),
        Number(document.getElementById("sub3").value),
        Number(document.getElementById("sub4").value),
        Number(document.getElementById("sub5").value)
    ];


    // Check marks
    for (let mark of marks) {

        if (mark < 0 || mark > 100) {
            alert("Marks must be between 0 and 100.");
            return;
        }

    }


    // Calculate total
    let total = marks.reduce((sum, mark) => sum + mark, 0);


    // Calculate percentage
    let percentage = total / 5;


    // Check pass/fail
    // Student must score at least 40 in every subject
    let status = marks.every(mark => mark >= 40) ? "PASS" : "FAIL";


    // Calculate grade
    let grade;

    if (status === "FAIL") {
        grade = "F";
    }
    else {
        grade = calculateGrade(percentage);
    }


    // Create student object
    let student = {
        name: name,
        roll: roll,
        marks: marks,
        total: total,
        percentage: percentage,
        grade: grade,
        status: status
    };


    // Add student to array
    students.push(student);


    // Display result
    displayResult(student);


    // Display all students
    displayStudents();


    // Find topper
    findTopper();


    // Clear form
    document.getElementById("studentForm").reset();

});


// Display individual result
function displayResult(student) {

    let result = document.getElementById("result");

    result.style.display = "block";

    result.innerHTML = `
        <h2>Student Result</h2>

        <p><strong>Name:</strong> ${student.name}</p>

        <p><strong>Roll Number:</strong> ${student.roll}</p>

        <p><strong>Total Marks:</strong> ${student.total} / 500</p>

        <p><strong>Percentage:</strong> ${student.percentage.toFixed(2)}%</p>

        <p><strong>Grade:</strong> ${student.grade}</p>

        <p><strong>Status:</strong> ${student.status}</p>
    `;
}


// Display all students
function displayStudents() {

    let table = document.getElementById("studentTable");

    table.innerHTML = "";


    students.forEach(function(student) {

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.roll}</td>
            <td>${student.name}</td>
            <td>${student.total}/500</td>
            <td>${student.percentage.toFixed(2)}%</td>
            <td>${student.grade}</td>
            <td>${student.status}</td>
        `;

        table.appendChild(row);

    });

}


// Find topper
function findTopper() {

    if (students.length === 0) {
        return;
    }


    let topper = students[0];


    for (let i = 1; i < students.length; i++) {

        if (students[i].percentage > topper.percentage) {
            topper = students[i];
        }

    }


    document.getElementById("topper").innerHTML = `
        🏆 Topper: ${topper.name}
        | Roll No: ${topper.roll}
        | Percentage: ${topper.percentage.toFixed(2)}%
    `;

}