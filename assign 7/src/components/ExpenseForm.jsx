
import { useState } from "react";

function ExpenseForm({ onAddExpense }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const expense = {
      id: Date.now(),
      title,
      amount: Number(amount),
      category,
      date
    };

    onAddExpense(expense);

    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");
  };

  return (
    <div className="expense-form card">
      <h2>Add New Expense</h2>
      <p className="section-description">
        Record where your money goes.
      </p>

      <form onSubmit={handleSubmit}>
        <label>Expense Title</label>
        <input
          type="text"
          placeholder="e.g. Grocery shopping"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Amount (₹)</label>
        <input
          type="number"
          placeholder="Enter amount"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <label>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Education">Education</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <button type="submit" className="primary-button">
          + Add Expense
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
