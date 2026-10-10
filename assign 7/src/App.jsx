
import { useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseSummary from "./components/ExpenseSummary";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([]);

  const addExpense = (newExpense) => {
    setExpenses((previousExpenses) => [
      ...previousExpenses,
      newExpense
    ]);
  };

  const deleteExpense = (id) => {
    setExpenses((previousExpenses) =>
      previousExpenses.filter((expense) => expense.id !== id)
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <span className="brand-icon">₹</span>
            <span>SpendWise</span>
          </div>

          <span className="header-label">PERSONAL FINANCE</span>
        </div>

        <div className="welcome-section">
          <p className="welcome-label">YOUR MONEY, YOUR CONTROL</p>
          <h1>Personal Expense Tracker</h1>
          <p>
            Track your spending, understand your habits,
            and manage your money smarter.
          </p>
        </div>
      </header>

      <main className="dashboard">
        <ExpenseSummary expenses={expenses} />

        <div className="main-grid">
          <ExpenseForm onAddExpense={addExpense} />

          <ExpenseList
            expenses={expenses}
            onDeleteExpense={deleteExpense}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>SpendWise · Personal Expense Tracker · React Assignment 7</p>
      </footer>
    </div>
  );
}

export default App;
