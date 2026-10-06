import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from './config.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, attendance } = req.body || {};
  if (!name || !attendance) return res.status(400).json({ error: 'Missing fields' });
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN.startsWith('ВСТАВЬ_') || !TELEGRAM_CHAT_ID || TELEGRAM_CHAT_ID.startsWith('ВСТАВЬ_')) {
    return res.status(500).json({ error: 'Telegram is not configured' });
  }

  const text = `💌 Новое подтверждение присутствия\n\nИмя: ${name}\nПрисутствие: ${attendance}`;
  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text })
  });

  if (!response.ok) return res.status(502).json({ error: 'Telegram error' });
  return res.status(200).json({ ok: true });
}
