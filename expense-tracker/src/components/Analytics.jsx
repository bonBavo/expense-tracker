import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const COLORS = ['#007BFF', '#A4FF00', '#FF3B30', '#FFCC00', '#FF00FF', '#00FFFF', '#FFFFFF'];

const Analytics = ({ transactions }) => {
  const categoryData = useMemo(() => {
    return transactions.reduce((acc, t) => {
      if (t.type === 'expense') {
        const existing = acc.find(item => item.name === t.category);
        if (existing) {
          existing.value += Number(t.amount);
        } else {
          acc.push({ name: t.category, value: Number(t.amount) });
        }
      }
      return acc;
    }, []);
  }, [transactions]);

  const monthlyData = useMemo(() => {
    return transactions.reduce((acc, t) => {
      const month = t.date.substring(0, 7); // YYYY-MM
      const existing = acc.find(item => item.month === month);
      if (existing) {
        if (t.type === 'income') existing.income += Number(t.amount);
        else existing.expense += Number(t.amount);
      } else {
        acc.push({
          month,
          income: t.type === 'income' ? Number(t.amount) : 0,
          expense: t.type === 'expense' ? Number(t.amount) : 0
        });
      }
      return acc;
    }, []).sort((a, b) => a.month.localeCompare(b.month));
  }, [transactions]);

  return (
    <div className="analytics">
      <div className="grid">
        <div className="card">
          <h2>Expenses by Category</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2>Income vs Expenses</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#9AA4B2" />
                <YAxis stroke="#9AA4B2" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121A3A', borderColor: '#2A3A6A' }}
                  itemStyle={{ color: '#F5F7FA' }}
                />
                <Legend />
                <Bar dataKey="income" fill="#66FF00" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#FF3B30" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
