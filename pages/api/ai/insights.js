import { generateFinancialAdvice } from '../../../lib/aiAssistant';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const userId = req.headers['x-user-id'] || 'demo-user-id';

    // Obtener los últimos 30 movimientos del usuario
    const recentTransactions = await prisma.transaction.findMany({
      where: { userId },
      take: 30,
      orderBy: { date: 'desc' },
      select: {
        amount: true,
        type: true,
        category: true,
        description: true,
        date: true
      }
    });

    if (recentTransactions.length === 0) {
      return res.status(200).json({
        insight: 'Aún no registraste suficientes movimientos para generar un análisis detallado.'
      });
    }

    const advice = await generateFinancialAdvice(recentTransactions);
    return res.status(200).json({ success: true, insight: advice });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}