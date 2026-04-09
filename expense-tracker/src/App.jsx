import { useState, useEffect, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, seedDatabase, CATEGORIES, ALL_CATEGORIES } from './db'
import TransactionList from './components/TransactionList'
import Analytics from './components/Analytics'
import Auth from './components/Auth'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogOut } from 'lucide-react'
import './App.css'

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState(CATEGORIES.EXPENSE[0]);
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // Restore user session from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('bon_expense_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch transactions from Dexie for the logged-in user
  const transactions = useLiveQuery(
    () => user ? db.transactions.where('userId').equals(user.id).toArray() : [],
    [user]
  ) || [];

  // Seed database on first load if no users exist
  useEffect(() => {
    const checkAndSeed = async () => {
      const userCount = await db.users.count();
      if (userCount === 0) {
        seedDatabase();
      }
    };
    checkAndSeed();
  }, []);

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    transactions.forEach(t => {
      if (t.type === "income") income += Number(t.amount);
      else expenses += Number(t.amount);
    });
    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const typeMatch = filterType === "all" || t.type === filterType;
      const categoryMatch = filterCategory === "all" || t.category === filterCategory;
      return typeMatch && categoryMatch;
    });
  }, [transactions, filterType, filterCategory]);

  const handleLogin = (loggedUser) => {
    setUser(loggedUser);
    localStorage.setItem('bon_expense_user', JSON.stringify(loggedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bon_expense_user');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!description || !amount || isNaN(numAmount) || numAmount <= 0) return;

    await db.transactions.add({
      userId: user.id,
      description,
      amount: numAmount,
      type,
      category,
      date: new Date().toISOString().split('T')[0],
    });

    setDescription("");
    setAmount("");
    setType("expense");
    setCategory(CATEGORIES.EXPENSE[0]);
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'income' ? CATEGORIES.INCOME[0] : CATEGORIES.EXPENSE[0]);
  };

  const handleDelete = async (id) => {
    await db.transactions.delete(id);
  };

  if (!user) {
    return (
      <div className="app-container">
        <header>
          <h1>Bon Expense Tracker</h1>
          <p className="subtitle">Securely track your finances</p>
        </header>
        <Auth onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <div className="header-actions">
          <div>
            <h1>Bon Expense Tracker</h1>
            <p className="subtitle">Track your income and expenses with style</p>
          </div>
          <div className="user-info">
            <div className="user-profile">
              <User size={20} className="user-icon" />
              <span>Welcome, <strong>{user.username}</strong></span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={16} style={{ marginRight: '6px' }} /> Logout
            </button>
          </div>
        </div>
      </header>

      <nav>
        <button 
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button 
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </nav>

      <div className="summary">
        <AnimatePresence mode="popLayout">
          <motion.div 
            key="income"
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="summary-card"
          >
            <h3>Income</h3>
            <p className="income-amount">KSh {totalIncome.toLocaleString()}</p>
          </motion.div>
          <motion.div 
            key="expenses"
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="summary-card"
          >
            <h3>Expenses</h3>
            <p className="expense-amount">KSh {totalExpenses.toLocaleString()}</p>
          </motion.div>
          <motion.div 
            key="balance"
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="summary-card"
          >
            <h3>Balance</h3>
            <p className="balance-amount">KSh {balance.toLocaleString()}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {activeTab === 'dashboard' && (
        <motion.div 
          key="dashboard"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="dashboard-view"
        >
          <div className="card add-transaction">
            <h2>Add Transaction</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <select value={type} onChange={(e) => handleTypeChange(e.target.value)}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {(type === 'income' ? CATEGORIES.INCOME : CATEGORIES.EXPENSE).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="primary"
              >
                Add Transaction
              </motion.button>
            </form>
          </div>
          
          <TransactionList 
            transactions={filteredTransactions.slice(-5).reverse()} 
            onDelete={handleDelete}
            categories={ALL_CATEGORIES}
            filterType={filterType}
            setFilterType={setFilterType}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
          />
        </motion.div>
      )}

      {activeTab === 'transactions' && (
        <motion.div
          key="transactions"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <TransactionList 
            transactions={filteredTransactions} 
            onDelete={handleDelete}
            categories={ALL_CATEGORIES}
            filterType={filterType}
            setFilterType={setFilterType}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
          />
        </motion.div>
      )}

      {activeTab === 'analytics' && (
        <motion.div
          key="analytics"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Analytics transactions={transactions} />
        </motion.div>
      )}
    </div>
  );
}

export default App
