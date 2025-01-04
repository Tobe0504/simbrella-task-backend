const express = require("express");
const cors = require("cors");
const transactions = require("./data/transactions");
const loans = require("./data/loans");
const accountBalance = require("./data/accountBalance");

const app = express();
const PORT = 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://simbrella-task-backend.vercel.app/",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Routes
app.get("/api/transactions", (req, res) => {
  res.json(transactions);
});

app.get("/api/loans", (req, res) => {
  res.json(loans);
});

app.get("/api/calculate-balance", (req, res) => {
  if (!Array.isArray(transactions)) {
    return res.status(400).json({ error: "Invalid transactions format" });
  }

  const remainingBalance = transactions.reduce((acc, transaction) => {
    if (transaction.isCredit) {
      return accountBalance + (acc + transaction.amount);
    } else {
      return accountBalance + (acc - transaction.amount);
    }
  }, 0);

  const remainingLoan = loans.reduce((acc, loan) => {
    if (loan?.status === "redeemed") {
      console.log(loan?.amount, acc, "Check");
      return acc + loan?.amount;
    } else {
      return acc;
    }
  }, 0);

  res.json({ accountBalance: remainingBalance, loanToPay: remainingLoan });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
