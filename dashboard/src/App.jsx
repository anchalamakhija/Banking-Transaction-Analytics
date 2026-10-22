
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");

  const rowsPerPage = 10;

  useEffect(() => {
    fetch("/dashboard_data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load dashboard data");
        }
        return response.json();
      })
      .then((data) => setDashboardData(data))
      .catch((err) => {
        console.error("Error loading dashboard data:", err);
        setError("Unable to load dashboard data. Please check your JSON file.");
      });
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!dashboardData) {
    return <p>Loading dashboard...</p>;
  }

  const transactions = dashboardData.transactions ?? [];

  // Apply the dashboard filters
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType =
      selectedType === "All" || transaction.type === selectedType;

    const matchesBranch =
      selectedBranch === "All" || transaction.branch === selectedBranch;

    return matchesType && matchesBranch;
  });

  // Calculate KPIs from filtered transactions
  const totalTransactions = filteredTransactions.length;

  const totalValue = filteredTransactions.reduce(
    (sum, transaction) => sum + Number(transaction.amount || 0),
    0
  );

  const averageTransaction =
    totalTransactions > 0 ? totalValue / totalTransactions : 0;

  // Group filtered transactions for charts
  const groupTotals = (key) => {
    const totals = {};

    filteredTransactions.forEach((transaction) => {
      const groupName = transaction[key];

      totals[groupName] =
        (totals[groupName] || 0) + Number(transaction.amount || 0);
    });

    return Object.entries(totals).map(([name, amount]) => ({
      name,
      amount,
    }));
  };

  const branchData = groupTotals("branch").map((item) => ({
    branch: item.name,
    amount: item.amount,
  }));

  const accountTypeData = groupTotals("account").map((item) => ({
    account: item.name,
    amount: item.amount,
  }));

  const transactionTypeData = groupTotals("type").map((item) => ({
    type: item.name,
    amount: item.amount,
  }));

  const monthlyData = groupTotals("month")
    .map((item) => ({
      month: Number(item.name),
      amount: item.amount,
    }))
    .sort((a, b) => a.month - b.month);

  const topCustomers = groupTotals("customer")
    .map((item) => ({
      customer: item.name,
      amount: item.amount,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  const branches = [
    ...new Set(transactions.map((transaction) => transaction.branch)),
  ].sort();

  const formatPKR = (value) =>
    `PKR ${Number(value).toLocaleString("en-PK", {
      maximumFractionDigits: 0,
    })}`;

  const formatMillions = (value) =>
    `${(value / 1000000).toFixed(1)}M`;

  const monthName = (month, style = "short") =>
    new Date(2025, Number(month) - 1).toLocaleString("en", {
      month: style,
    });

  // Dynamic business insights
  const highestValue = (key) =>
    groupTotals(key).sort((a, b) => b.amount - a.amount)[0] ?? null;

  const topBranch = highestValue("branch");
  const topTransactionType = highestValue("type");
  const topAccountType = highestValue("account");

  const highValueCount = filteredTransactions.filter(
    (transaction) => Number(transaction.amount) > 200000
  ).length;

  const highValuePercentage =
    totalTransactions > 0
      ? ((highValueCount / totalTransactions) * 100).toFixed(1)
      : "0.0";

  const insights = [
    {
      title: "Highest-Value Branch",
      value: topBranch ? topBranch.name : "N/A",
      description: topBranch
        ? `${formatPKR(topBranch.amount)} in transaction value`
        : "No matching transactions.",
    },
    {
      title: "Leading Transaction Type",
      value: topTransactionType ? topTransactionType.name : "N/A",
      description: topTransactionType
        ? `${formatPKR(topTransactionType.amount)} in transaction value`
        : "No matching transactions.",
    },
    {
      title: "Leading Account Type",
      value: topAccountType ? topAccountType.name : "N/A",
      description: topAccountType
        ? `${formatPKR(topAccountType.amount)} in transaction value`
        : "No matching transactions.",
    },
    {
      title: "High-Value Transactions",
      value: `${highValuePercentage}%`,
      description: `${highValueCount} of ${totalTransactions} transactions exceeded PKR 200,000`,
    },
  ];

  // Search within transactions that match the selected filters
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const searchedTransactions = filteredTransactions.filter((transaction) => {
    return (
      String(transaction.transaction_id ?? "")
        .toLowerCase()
        .includes(normalizedSearch) ||
      String(transaction.customer ?? "")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  });

  // Pagination: show 10 transactions per page
  const totalPages = Math.ceil(searchedTransactions.length / rowsPerPage);

  const paginatedTransactions = searchedTransactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const resetFilters = () => {
    setSelectedType("All");
    setSelectedBranch("All");
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div>
          <h1>🏦 Banking Transaction Analytics</h1>
          <p>Transaction insights and performance overview</p>
        </div>
        
      </header>

      <main>
        {/* Interactive Filters */}
        <section
          className="chart-card full-width"
          style={{ marginBottom: "24px" }}
        >
          <h2>Explore Transactions</h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              alignItems: "end",
            }}
          >
            <div style={{ minWidth: "200px", flex: "1" }}>
              <label
                htmlFor="transactionType"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Transaction Type
              </label>

              <select
                id="transactionType"
                value={selectedType}
                onChange={(event) => {
                  setSelectedType(event.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#1e293b",
                }}
              >
                <option value="All">All Transaction Types</option>
                <option value="Deposit">Deposit</option>
                <option value="Withdrawal">Withdrawal</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>

            <div style={{ minWidth: "200px", flex: "1" }}>
              <label
                htmlFor="branch"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Branch
              </label>

              <select
                id="branch"
                value={selectedBranch}
                onChange={(event) => {
                  setSelectedBranch(event.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#1e293b",
                }}
              >
                <option value="All">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={resetFilters}
              style={{
                padding: "12px 20px",
                border: "none",
                borderRadius: "8px",
                background: "#1e3a8a",
                color: "#ffffff",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Reset Filters
            </button>
          </div>

          <p style={{ marginTop: "16px", marginBottom: "0" }}>
            Showing <strong>{totalTransactions}</strong> of{" "}
            <strong>{transactions.length}</strong> transactions
          </p>
        </section>

        {/* KPI Cards */}
        <section className="kpi-grid">
          <div className="kpi-card">
            <p>Total Transactions</p>
            <h2>{totalTransactions.toLocaleString("en-PK")}</h2>
          </div>

          <div className="kpi-card">
            <p>Total Transaction Value</p>
            <h2>PKR {(totalValue / 1000000).toFixed(2)}M</h2>
          </div>

          <div className="kpi-card">
            <p>Average Transaction</p>
            <h2>PKR {(averageTransaction / 1000).toFixed(1)}K</h2>
          </div>
        </section>

        {/* Branch and Transaction Type Charts */}
        <section className="chart-grid">
          <div className="chart-card">
            <h2>Transaction Value by Branch</h2>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={branchData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="branch" />
                <YAxis tickFormatter={formatMillions} />
                <Tooltip
                  formatter={(value) => [
                    formatPKR(value),
                    "Transaction Value",
                  ]}
                />
                <Bar
                  dataKey="amount"
                  name="Transaction Value"
                  fill="#2563eb"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h2>Transaction Type</h2>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={transactionTypeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="type" />
                <YAxis tickFormatter={formatMillions} />
                <Tooltip
                  formatter={(value) => [
                    formatPKR(value),
                    "Transaction Value",
                  ]}
                />
                <Bar
                  dataKey="amount"
                  name="Transaction Value"
                  fill="#0d9488"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Account Type Chart */}
        <section className="chart-card full-width">
          <h2>Transaction Value by Account Type</h2>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={accountTypeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="account" />
              <YAxis tickFormatter={formatMillions} />
              <Tooltip
                formatter={(value) => [
                  formatPKR(value),
                  "Transaction Value",
                ]}
              />
              <Bar
                dataKey="amount"
                name="Transaction Value"
                fill="#7c3aed"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Monthly Transaction Trend */}
        <section className="chart-card full-width">
          <h2>Monthly Transaction Trend</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickFormatter={(month) => monthName(month)}
              />
              <YAxis tickFormatter={formatMillions} />
              <Tooltip
                labelFormatter={(month) => monthName(month, "long")}
                formatter={(value) => [
                  formatPKR(value),
                  "Transaction Value",
                ]}
              />
              <Bar
                dataKey="amount"
                name="Transaction Value"
                fill="#ea580c"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Top 10 Customers */}
        <section className="chart-card full-width">
          <h2>Top 10 Customers by Transaction Value</h2>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={topCustomers}
              layout="vertical"
              margin={{ left: 20, right: 30, top: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <YAxis type="category" dataKey="customer" width={70} />
              <Tooltip
                formatter={(value) => [
                  formatPKR(value),
                  "Transaction Value",
                ]}
              />
              <Bar
                dataKey="amount"
                name="Transaction Value"
                fill="#0891b2"
                radius={[0, 5, 5, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Key Business Insights */}
        <section className="chart-card full-width">
          <h2>Key Business Insights</h2>

          <div className="insights-grid">
            {insights.map((insight) => (
              <div className="insight-item" key={insight.title}>
                <h3>{insight.title}</h3>
                <h2>{insight.value}</h2>
                <p>{insight.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Transaction Details Table */}
        <section className="chart-card full-width">
          <h2>Transaction Details</h2>

          <input
            type="text"
            value={searchTerm}
            placeholder="Search by transaction ID or customer ID..."
            aria-label="Search transactions"
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
            }}
            style={{
              width: "100%",
              maxWidth: "420px",
              padding: "12px",
              marginBottom: "16px",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
          />

          <p>
            Found <strong>{searchedTransactions.length}</strong> matching
            transactions
          </p>

          <div style={{ width: "100%", overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "850px",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ background: "#1e3a8a", color: "#ffffff" }}>
                  {[
                    "Transaction ID",
                    "Customer ID",
                    "Month",
                    "Branch",
                    "Account Type",
                    "Transaction Type",
                    "Amount (PKR)",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: "14px 12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {paginatedTransactions.map((transaction, index) => (
                  <tr
                    key={`${transaction.transaction_id}-${index}`}
                    style={{
                      background: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <td style={{ padding: "12px" }}>
                      {transaction.transaction_id}
                    </td>
                    <td style={{ padding: "12px" }}>
                      {transaction.customer}
                    </td>
                    <td style={{ padding: "12px" }}>
                      {monthName(transaction.month, "long")}
                    </td>
                    <td style={{ padding: "12px" }}>
                      {transaction.branch}
                    </td>
                    <td style={{ padding: "12px" }}>
                      {transaction.account}
                    </td>
                    <td style={{ padding: "12px" }}>
                      {transaction.type}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        whiteSpace: "nowrap",
                        fontWeight: "600",
                      }}
                    >
                      {formatPKR(transaction.amount)}
                    </td>
                  </tr>
                ))}

                {paginatedTransactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        padding: "24px",
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      No matching transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "20px",
            }}
          >
            <p style={{ margin: 0 }}>
              Page <strong>{searchedTransactions.length === 0 ? 0 : currentPage}</strong>{" "}
              of <strong>{totalPages}</strong>
            </p>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                disabled={currentPage <= 1}
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                style={{
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "8px",
                  background: currentPage <= 1 ? "#cbd5e1" : "#1e3a8a",
                  color: "#ffffff",
                  cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                }}
              >
                Previous
              </button>

              <button
                disabled={
                  totalPages === 0 || currentPage >= totalPages
                }
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                style={{
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "8px",
                  background:
                    totalPages === 0 || currentPage >= totalPages
                      ? "#cbd5e1"
                      : "#1e3a8a",
                  color: "#ffffff",
                  cursor:
                    totalPages === 0 || currentPage >= totalPages
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
