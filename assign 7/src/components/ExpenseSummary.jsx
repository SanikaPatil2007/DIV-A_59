
function ExpenseSummary({ expenses }) {
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const categoryTotals = expenses.reduce((totals, expense) => {
    totals[expense.category] =
      (totals[expense.category] || 0) + expense.amount;

    return totals;
  }, {});

  const highestCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <div className="summary-section">
      <div className="summary-card total-card">
        <span className="summary-icon">₹</span>
        <p>Total Expenses</p>
        <h2>₹{totalExpenses.toLocaleString("en-IN")}</h2>
      </div>

      <div className="summary-card count-card">
        <span className="summary-icon">📋</span>
        <p>Number of Expenses</p>
        <h2>{expenses.length}</h2>
      </div>

      <div className="summary-card category-card">
        <span className="summary-icon">📊</span>
        <p>Top Spending Category</p>
        <h2>{highestCategory ? highestCategory[0] : "None"}</h2>
        <small>
          {highestCategory
            ? `₹${highestCategory[1].toLocaleString("en-IN")}`
            : "No expenses recorded"}
        </small>
      </div>

      <div className="category-analysis card">
        <h2>Category-wise Analysis</h2>
        <p className="section-description">
          See how your expenses are distributed.
        </p>

        {Object.keys(categoryTotals).length === 0 ? (
          <p className="empty-analysis">
            Add expenses to see your spending analysis.
          </p>
        ) : (
          Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .map(([category, amount]) => {
              const percentage =
                totalExpenses > 0
                  ? (amount / totalExpenses) * 100
                  : 0;

              return (
                <div className="category-row" key={category}>
                  <div className="category-label">
                    <span>{category}</span>
                    <strong>
                      ₹{amount.toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <small>{percentage.toFixed(1)}% of total</small>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}

export default ExpenseSummary;
