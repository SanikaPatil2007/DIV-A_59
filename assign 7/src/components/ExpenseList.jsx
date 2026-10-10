
function ExpenseList({ expenses, onDeleteExpense }) {
  return (
    <div className="expense-list card">
      <div className="section-heading">
        <div>
          <h2>Recent Expenses</h2>
          <p className="section-description">
            Keep track of your spending.
          </p>
        </div>

        <span className="expense-count">
          {expenses.length} records
        </span>
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">₹</div>
          <h3>No expenses yet</h3>
          <p>Add your first expense using the form.</p>
        </div>
      ) : (
        <div className="expense-items">
          {expenses.map((expense) => (
            <div className="expense-item" key={expense.id}>
              <div className="expense-info">
                <div className="category-icon">
                  {expense.category === "Food" && "🍔"}
                  {expense.category === "Travel" && "🚗"}
                  {expense.category === "Shopping" && "🛍️"}
                  {expense.category === "Education" && "📚"}
                  {expense.category === "Bills" && "🧾"}
                  {expense.category === "Entertainment" && "🎬"}
                  {expense.category === "Other" && "📌"}
                </div>

                <div>
                  <h3>{expense.title}</h3>
                  <p>
                    {expense.category} · {expense.date}
                  </p>
                </div>
              </div>

              <div className="expense-actions">
                <strong>
                  ₹{expense.amount.toLocaleString("en-IN")}
                </strong>

                <button
                  className="delete-button"
                  onClick={() => onDeleteExpense(expense.id)}
                  aria-label={`Delete ${expense.title}`}
                  title="Delete expense"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpenseList;

