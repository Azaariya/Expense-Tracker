
function TransactionForm({ addTransaction, updateTransaction, editingtransaction, finishEditing }) {
  const [description, setDescription] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [type, setType] = React.useState("income")
  React.useEffect(() => {
    if (editingtransaction) {
      setDescription(editingtransaction.description);
      setAmount(editingtransaction.amount);
      setType(editingtransaction.type);
    }
  }, [editingtransaction]);
  function handleAdd() {
    const transactionData = {
      description: description,
      amount: Number(amount),
      type: type
    };

    if (editingtransaction) {
      updateTransaction({
        id: editingtransaction.id,
        ...transactionData
      });
      finishEditing();
    } else {
      addTransaction({
        id: Date.now(),
        ...transactionData
      });
    }

    setDescription("");
    setAmount("");
    setType("income");
  }

  return (
    <div className="transaction-form">
      <h2>
        {editingtransaction ? "Edit Transaction" : "Add Transaction"}
      </h2>

      <div className="form-grid">

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={description}
            placeholder="e.g. Groceries"
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          />
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            placeholder="0"
            onChange={(event) => {
              setAmount(event.target.value);
            }}
          />
        </div>

        <div className="form-group">
          <label>Type</label>
          <select
            value={type}
            onChange={(event) => {
              setType(event.target.value);
            }}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <button
          className="primary-button"
          onClick={handleAdd}
        >
          {editingtransaction ? "Update" : "Add"}
        </button>

      </div>
    </div>
  )


}
function BalanceSummary({ transactions }) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)
  const balance = income - expense;
  return (
    <div className="balance-summary">

      <div className="summary-card">
        <span>Total Income</span>
        <strong className="income-value">
          ${income}
        </strong>
      </div>

      <div className="summary-card">
        <span>Total Expenses</span>
        <strong className="expense-value">
          ${expense}
        </strong>
      </div>

      <div className="summary-card">
        <span>Net Balance</span>
        <strong className="balance-value">
          ${balance}
        </strong>
      </div>

    </div>
  );
}

function TransactionItem({
  transaction,
  deleteTransaction,
  editTransaction
}) {
  return (
    <div className="transaction-item">

      <div className="transaction-info">
        <h3>{transaction.description}</h3>

        <span
          className={`transaction-type ${transaction.type === "income"
            ? "type-income"
            : "type-expense"
            }`}
        >
          {transaction.type}
        </span>
      </div>

      <div className="transaction-right">

        <span
          className={`transaction-amount ${transaction.type === "income"
            ? "amount-income"
            : "amount-expense"
            }`}
        >
          {transaction.type === "income" ? "+" : "-"}
          ${transaction.amount}
        </span>

        <div className="action-buttons">

          <button
            className="action-button edit-button"
            onClick={() => editTransaction(transaction)}
          >
            Edit
          </button>

          <button
            className="action-button delete-button"
            onClick={() => deleteTransaction(transaction.id)}
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}
function TransactionList({
  transactions,
  deleteTransaction,
  editTransaction
}) {
  return (
    <div className="transactions-section">

      <h2>Transactions</h2>

      {transactions.length === 0 ? (
        <p className="empty-state">
          No transactions yet.
        </p>
      ) : (
        transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            deleteTransaction={deleteTransaction}
            editTransaction={editTransaction}
          />
        ))
      )}

    </div>
  );
}
function App() {
  const [transactions, setTransactions] = React.useState([]);
  const [editingtransaction, setEditingTransaction] = React.useState(null);
  function addTransaction(newTransaction) {
    return (
      setTransactions((prevTransactions) => {
        return [
          ...prevTransactions,
          newTransaction
        ];
      })
    )
  };
  function deleteTransaction(id) {
    setTransactions((prevTransactions) =>
      prevTransactions.filter((t) => t.id !== id)
    )
  }
  function editTransaction(transaction) {
    setEditingTransaction(transaction);
  }
  function updateTransaction(updatedTransaction) {
    setTransactions((prevTransactions) => {
      return prevTransactions.map((transaction) => {
        if (transaction.id === updatedTransaction.id) {
          return updatedTransaction;
        }

        return transaction;
      });
    });
  }
  function finishEditing() {
    setEditingTransaction(null);
  }
  return (
    <div className="app">

      <div className="app-header">
        <h1>Expense Tracker</h1>
        <p>Manage your income and expenses</p>
      </div>

      <TransactionForm
        addTransaction={addTransaction}
        updateTransaction={updateTransaction}
        editingtransaction={editingtransaction}
        finishEditing={finishEditing}
      />

      <BalanceSummary transactions={transactions} />

      <TransactionList
        transactions={transactions}
        deleteTransaction={deleteTransaction}
        editTransaction={editTransaction}
      />

    </div>
  );
}
ReactDOM.createRoot(
  document.querySelector(".js-container")
).render(<App />);