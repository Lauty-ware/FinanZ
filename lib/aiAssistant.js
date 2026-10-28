import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateFinancialAdvice(transactions) {
  const prompt = `
    Analiza el siguiente historial financiero en JSON y genera un diagnóstico breve:
    1. Un resumen general de hábitos de gasto.
    2. Identificación de la mayor fuga de dinero.
    3. Dos consejos prácticos para optimizar el ahorro.

    Datos de movimientos:
    ${JSON.stringify(transactions)}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  return response.text;
}
