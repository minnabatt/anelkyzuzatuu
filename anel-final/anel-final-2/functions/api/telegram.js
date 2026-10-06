// ВСТАВЬТЕ СЮДА BOT TOKEN И CHAT ID перед публикацией.
// Эти данные находятся внутри server-side функции и не выводятся посетителям сайта.
const TELEGRAM_BOT_TOKEN = 'ВСТАВЬ_СЮДА_BOT_TOKEN';
const TELEGRAM_CHAT_ID = 'ВСТАВЬ_СЮДА_CHAT_ID';

export async function onRequestPost(context) {
  try {
    if (TELEGRAM_BOT_TOKEN.includes('ВСТАВЬ') || TELEGRAM_CHAT_ID.includes('ВСТАВЬ')) {
      return new Response(JSON.stringify({ ok: false, error: 'Telegram не настроен' }), {
        status: 500,
        headers: { 'content-type': 'application/json; charset=utf-8' }
      });
    }

    const body = await context.request.json();
    const name = String(body?.name || '').trim();
    const attendance = String(body?.attendance || '').trim();
    if (!name || !attendance) {
      return new Response(JSON.stringify({ ok: false, error: 'Заполните форму' }), {
        status: 400,
        headers: { 'content-type': 'application/json; charset=utf-8' }
      });
    }

    const text = `💌 Новое подтверждение присутствия\n\nИмя: ${name}\nПрисутствие: ${attendance}`;
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text })
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      return new Response(JSON.stringify({ ok: false }), {
        status: 502,
        headers: { 'content-type': 'application/json; charset=utf-8' }
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json; charset=utf-8' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false }), {
      status: 500,
      headers: { 'content-type': 'application/json; charset=utf-8' }
    });
  }
}
