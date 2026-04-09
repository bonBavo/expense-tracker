import Dexie from 'dexie';
import bcrypt from 'bcryptjs';

export const db = new Dexie('FinanceTrackerDB');
db.version(3).stores({
  transactions: '++id, userId, description, amount, type, category, date',
  users: '++id, &username, &email, password'
});

export const CATEGORIES = {
  INCOME: ["salary", "freelance", "investment", "other"],
  EXPENSE: ["food", "housing", "utilities", "transport", "entertainment", "other"]
};

export const ALL_CATEGORIES = [...new Set([...CATEGORIES.INCOME, ...CATEGORIES.EXPENSE])];

export const initialTransactions = [
  { description: "Salary", amount: 5000, type: "income", category: "salary", date: "2025-01-01" },
  { description: "Rent", amount: 1200, type: "expense", category: "housing", date: "2025-01-02" },
  { description: "Groceries", amount: 150, type: "expense", category: "food", date: "2025-01-03" },
  { description: "Freelance Work", amount: 800, type: "income", category: "salary", date: "2025-01-05" },
  { description: "Electric Bill", amount: 95, type: "expense", category: "utilities", date: "2025-01-06" },
  { description: "Dinner Out", amount: 65, type: "expense", category: "food", date: "2025-01-07" },
  { description: "Gas", amount: 45, type: "expense", category: "transport", date: "2025-01-08" },
  { description: "Netflix", amount: 15, type: "expense", category: "entertainment", date: "2025-01-10" },
];

export const seedDatabase = async () => {
  const userCount = await db.users.count();
  if (userCount === 0) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const userId = await db.users.add({ 
      username: "admin", 
      email: "admin@example.com", 
      password: hashedPassword 
    });
    const transactionsWithUser = initialTransactions.map(t => ({ ...t, userId }));
    await db.transactions.bulkAdd(transactionsWithUser);
  }
};
