/**
 * Kill switch for the AI chatbot. While false outside `npm run dev`, the launcher is not
 * rendered and /api/chat answers 503 without calling OpenAI. Set to `true` to turn it back on.
 */
export const CHAT_ENABLED = process.env.NODE_ENV === 'development';
