import { useState } from "react";
import { transactions } from "./data/transactions";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

function App() {
  const [filter, setFilter] = useState("all");
  const [role, setRole] = useState("viewer");

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  // Pie chart data (only expenses)
  const categoryData = Object.values(
    transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, curr) => {
        acc[curr.category] = acc[curr.category] || {
          name: curr.category,
          value: 0,
        };
        acc[curr.category].value += curr.amount;
        return acc;
      }, {})
  );

  // Insight: highest spending category
  const highestCategory =
    categoryData.length > 0
      ? categoryData.reduce((max, curr) =>
          curr.value > max.value ? curr : max
        ).name
      : "N/A";

  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        My Finance Dashboard
      </h1>

      {/* Role */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Role:</label>
        <select
          className="p-2 border rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {role === "admin" && (
        <button className="mb-4 bg-blue-600 text-white px-4 py-2 rounded">
          Add New Transaction
        </button>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-gray-500">Balance</h2>
          <p className="text-xl font-bold">₹ {balance}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-gray-500">Income</h2>
          <p className="text-xl font-bold text-green-600">₹ {income}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-gray-500">Expenses</h2>
          <p className="text-xl font-bold text-red-600">₹ {expense}</p>
        </div>
      </div>

      {/* Chart + Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        
        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-xl shadow h-80">
          <h2 className="text-lg font-semibold mb-2">
            Spending Breakdown
          </h2>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Insights</h2>

          <p className="mb-2">
            💡 Highest spending category: <b>{highestCategory}</b>
          </p>

          <p className="mb-2">
            💡 Total expense: <b>₹ {expense}</b>
          </p>

          <p>
            💡 Balance remaining: <b>₹ {balance}</b>
          </p>
        </div>

      </div>

      {/* Transactions */}
      <div className="mt-8 bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>

        <select
          className="mb-4 p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Date</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {transactions
              .filter((t) => filter === "all" || t.type === filter)
              .map((t) => (
                <tr key={t.id} className="border-b">
                  <td className="py-2">{t.date}</td>
                  <td>{t.category}</td>
                  <td
                    className={
                      t.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {t.type}
                  </td>
                  <td>₹ {t.amount}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default App;