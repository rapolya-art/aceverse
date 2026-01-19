export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const { name, company, phone, email } = await request.json();

        // Validate required fields
        if (!name || !phone || !email) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const botToken = env.TELEGRAM_BOT_TOKEN;
        const chatId = env.TELEGRAM_CHAT_ID;

        if (!botToken || !chatId) {
            return new Response(JSON.stringify({ error: "Server misconfiguration (missing secrets)" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        const text = `
📩 *Нова заявка з сайту (Aceverse)*

👤 *Ім'я:* ${name}
🏢 *Компанія:* ${company || "Не вказано"}
📞 *Телефон:* ${phone}
📧 *Email:* ${email}
        `;

        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

        const response = await fetch(telegramUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: "Markdown"
            })
        });

        const data = await response.json();

        if (!data.ok) {
            throw new Error(`Telegram API Error: ${data.description}`);
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
