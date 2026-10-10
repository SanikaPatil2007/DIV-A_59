
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Student = require("./models/Student");

const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error.message);
  });

// Home route
app.get("/", (req, res) => {
  res.send("Student Records REST API is running!");
});

// CREATE - Add a student
app.post("/students", async (req, res) => {
  try {
    const student = await Student.create(req.body);

    res.status(201).json({
      message: "Student added successfully",
      student
    });
  } catch (error) {
    res.status(400).json({
      message: "Could not add student",
      error: error.message
    });
  }
});

// READ - Get all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get one student by ID
app.get("/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({
      message: "Invalid student ID",
      error: error.message
    });
  }
});

// UPDATE - Update a student
app.put("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
      student
    });
  } catch (error) {
    res.status(400).json({
      message: "Could not update student",
      error: error.message
    });
  }
});

// DELETE - Delete a student
app.delete("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(
      req.params.id
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student deleted successfully",
      student
    });
  } catch (error) {
    res.status(400).json({
      message: "Could not delete student",
      error: error.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
