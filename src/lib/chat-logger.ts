export async function logChatInteraction(
  userMessage: string,
  aiResponse: string,
  userIP: string,
  isOffTopic: boolean = false,
  remainingAttempts?: number
) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) return;

    const offTopicStatus = isOffTopic
      ? `⚠️ *Off-Topic:* Yes${remainingAttempts !== undefined ? ` (${remainingAttempts}/5 attempts remaining)` : ''}`
      : `✅ *Off-Topic:* No`;

    const message = `
🤖 *Chatbot Interaction*

👤 *User Question:*
${userMessage}

🤖 *AI Response:*
${aiResponse}

${offTopicStatus}
🌐 *User IP:* ${userIP}

---
*From shaxa.dev chatbot*
    `.trim();

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (!response.ok) {
      console.error('Logging error:', await response.json());
    }
  } catch (error) {
    console.error('Logging error:', error);
  }
}
