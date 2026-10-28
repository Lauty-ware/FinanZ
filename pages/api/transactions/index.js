import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;
  // Supongamos que recibimos el userId por sesión o headers en el MVP
  const userId = req.headers['x-user-id'] || 'demo-user-id';

  switch (method) {
    case 'GET':
      try {
        const { category, type } = req.query;
        const where = { userId };
        
        if (category) where.category = category;
        if (type) where.type = type;

        const transactions = await prisma.transaction.findMany({
          where,
          orderBy: { date: 'desc' }
        });
        return res.status(200).json({ success: true, data: transactions });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    case 'POST':
      try {
        const { amount, type, category, description, date } = req.body;

        if (!amount || !type || !category) {
          return res.status(400).json({ success: false, error: 'Campos requeridos faltantes' });
        }

        const newTransaction = await prisma.transaction.create({
          data: {
            amount: parseFloat(amount),
            type, // "INCOME" | "EXPENSE"
            category,
            description,
            date: date ? new Date(date) : new Date(),
            userId
          }
        });
        return res.status(201).json({ success: true, data: newTransaction });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}