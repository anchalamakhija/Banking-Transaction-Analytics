# 🏦 Banking Transaction Analytics Dashboard

An interactive banking analytics dashboard built with **Python, Pandas, and React** to explore transaction activity, compare branch performance, and identify business insights from banking transaction data.

## 📊 Project Overview

This project analyzes 250 banking transactions across five branches in Pakistan. It combines Python-based data analysis with an interactive React dashboard to make transaction patterns easier to explore.

## ✨ Features

- **KPI Cards:** Total transactions, total transaction value, and average transaction value.
- **Interactive Filters:** Filter transactions by transaction type and branch.
- **Branch Performance:** Compare transaction values across branches.
- **Transaction Analysis:** Analyze deposits, withdrawals, and transfers.
- **Account Analysis:** Compare Savings and Current account transaction values.
- **Monthly Trends:** Explore transaction values throughout the year.
- **Top Customers:** Identify customers with the highest transaction values.
- **Business Insights:** Highlight leading branches, transaction types, account types, and high-value transactions.
- **Transaction Details:** Search by transaction ID or customer ID, with pagination.
- **Responsive Interface:** Designed to work across different screen sizes.

## 🛠️ Technologies Used

**Data Analysis**
- Python
- Pandas
- NumPy
- Matplotlib

**Frontend**
- React
- Vite
- JavaScript
- Recharts

## 📁 Project Structure

```text
Banking-Transaction-Analytics/
├── data/
│   └── banking_transactions.csv
├── notebooks/
│   └── banking_transaction_analysis.ipynb
├── dashboard/
│   ├── public/
│   │   └── dashboard_data.json
│   ├── src/
│   ├── package.json
│   └── README.md
└── README.md
```

*Adjust the notebook filename above if yours is different.*

## 📈 Key Findings

- **Total Transactions:** 250
- **Total Transaction Value:** PKR 32,127,370
- **Average Transaction Value:** PKR 128,509.48
- **Highest-Value Branch:** Hyderabad
- **Leading Transaction Type by Value:** Withdrawal
- **Leading Account Type by Value:** Savings
- **High-Value Transactions:** 51 transactions exceeded PKR 200,000 (20.4%)

## 🚀 Getting Started

### Prerequisites

- Python installed
- Node.js and npm installed

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Banking-Transaction-Analytics
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL after creating the repository.

### 2. Run the React dashboard

```bash
cd dashboard
npm install
npm run dev
```

Open the local URL shown in your terminal.

### 3. Run the Python analysis

From the project root, install the required Python packages if needed:

```bash
python -m pip install pandas numpy matplotlib notebook
python -m notebook
```

Open the analysis notebook from the `notebooks` folder and run its cells to reproduce the analysis and regenerate dashboard data, if your notebook is configured to export it.

## 🎯 Project Objective

To demonstrate practical skills in data analysis, data visualization, interactive dashboard development, and communicating business insights using banking transaction data.

## ⚠️ Dataset Note

This project uses a dataset of 250 transactions for demonstration and portfolio purposes. Treat the figures as sample analytical results, not as actual financial data from a bank.

## 👩‍💻 Author

**Aanchal kumari**

 GitHub profile https://github.com/anchalamakhija
 LinkedIn profile  https://www.linkedin.com/in/aanchal-makhija-0445052a8 

## 📸 Dashboard Screenshots

### Dashboard Overview
![Dashboard Overview](Screenshots/dashboard-overview.png)

### Branch Performance and Charts
![Branch Performance](Screenshots/branch-performance.png)

### Key Business Insights
![Business Insights](Screenshots/business-insights.png)

### Transaction Details
![Transaction Details](Screenshots/transaction-details.png)