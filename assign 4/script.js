// Select the form
const form = document.querySelector("form");

// Form submit event
form.addEventListener("submit", function (event) {

    // Prevent actual form submission
    event.preventDefault();

    // Get values
    const empId = document.getElementById("empId").value.trim();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;
    const department = document.getElementById("department").value;
    const designation = document.getElementById("designation").value.trim();
    const salary = document.getElementById("salary").value;
    const joiningDate = document.getElementById("joiningDate").value;
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();

    // Get selected gender
    const gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    // Regular Expressions

    // Employee ID: letters followed by numbers
    // Examples: EMP101, EMP001
    const empIdPattern = /^EMP[0-9]{3,6}$/;

    // Name: only letters and spaces
    const namePattern = /^[A-Za-z ]{2,50}$/;

    // Email
    const emailPattern =
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    // Indian phone number: exactly 10 digits starting from 6-9
    const phonePattern = /^[6-9][0-9]{9}$/;

    // Designation: letters, spaces and some common characters
    const designationPattern =
        /^[A-Za-z ]{2,50}$/;

    // City: only letters and spaces
    const cityPattern =
        /^[A-Za-z ]{2,40}$/;


    // ---------------- VALIDATION ----------------

    // Employee ID
    if (!empIdPattern.test(empId)) {

        alert(
            "Invalid Employee ID!\n\n" +
            "Format should be EMP followed by 3 to 6 digits.\n" +
            "Example: EMP101"
        );

        return;
    }


    // Name
    if (!namePattern.test(name)) {

        alert(
            "Invalid Name!\n\n" +
            "Name should contain only letters and spaces."
        );

        return;
    }


    // Email
    if (!emailPattern.test(email)) {

        alert(
            "Invalid Email!\n\n" +
            "Please enter a valid email address.\n" +
            "Example: abc@gmail.com"
        );

        return;
    }


    // Phone
    if (!phonePattern.test(phone)) {

        alert(
            "Invalid Phone Number!\n\n" +
            "Phone number must contain exactly 10 digits " +
            "and start with 6, 7, 8 or 9."
        );

        return;
    }


    // Date of Birth
    if (dob === "") {

        alert("Please select Date of Birth.");

        return;
    }


    // Gender
    if (!gender) {

        alert("Please select Gender.");

        return;
    }


    // Department
    if (department === "") {

        alert("Please select a Department.");

        return;
    }


    // Designation
    if (!designationPattern.test(designation)) {

        alert(
            "Invalid Designation!\n\n" +
            "Designation should contain only letters and spaces."
        );

        return;
    }


    // Salary
    if (salary === "" || Number(salary) <= 0) {

        alert(
            "Invalid Salary!\n\n" +
            "Salary must be greater than 0."
        );

        return;
    }


    // Joining Date
    if (joiningDate === "") {

        alert("Please select Joining Date.");

        return;
    }


    // Address
    if (address.length < 10) {

        alert(
            "Invalid Address!\n\n" +
            "Address should contain at least 10 characters."
        );

        return;
    }


    // City
    if (!cityPattern.test(city)) {

        alert(
            "Invalid City!\n\n" +
            "City should contain only letters and spaces."
        );

        return;
    }


    // Photo
    const photo = document.getElementById("photo").files[0];

    if (!photo) {

        alert("Please select an employee photo.");

        return;
    }


    // ---------------- SUCCESS ----------------

    alert(
        "Employee Registered Successfully! 🎉\n\n" +
        "Employee ID: " + empId + "\n" +
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Phone: " + phone + "\n" +
        "Department: " + department
    );

    // Clear form
    form.reset();

});