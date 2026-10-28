import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Obtener resumen del dashboard
export async function getDashboardSummary(userId) {
  const transactions = await prisma.transaction.findMany({
    where: { userId }
  });

  const totals = transactions.reduce(
    (acc, item) => {
      if (item.type === 'INCOME') acc.income += item.amount;
      if (item.type === 'EXPENSE') acc.expenses += item.amount;
      return acc;
    },
    { income: 0, expenses: 0 }
  );

  return {
    balance: totals.income - totals.expenses,
    income: totals.income,
    expenses: totals.expenses,
    savingsRate: totals.income > 0 ? ((totals.income - totals.expenses) / totals.income) * 100 : 0
  };
}

export async function getExpensesByCategory(userId) {
  const expenses = await prisma.transaction.groupBy({
    by: ['category'],
    where: { userId, type: 'EXPENSE' },
    _sum: { amount: true }
  });

  return expenses.map((e) => ({
    category: e.category,
    total: e._sum.amount || 0
  }));
}
