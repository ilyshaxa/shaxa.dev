import { NextRequest, NextResponse } from 'next/server';
import { getClientIP, checkRateLimit, incrementRateLimit } from '@/lib/chat-rate-limit';
import { SYSTEM_PROMPT } from '@/lib/chat-system-prompt';
import { logChatInteraction } from '@/lib/chat-logger';

export const runtime = 'edge';

interface AIResponse {
  response: string;
  isOffTopic: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function parseAIResponse(rawResponse: string): AIResponse {
  try {
    const parsed = JSON.parse(rawResponse);
    if (typeof parsed.response === 'string' && typeof parsed.isOffTopic === 'boolean') {
      return parsed;
    }
  } catch {
    // Fall through to keyword detection
  }

  const refusalIndicators = [
    "I'm Shaxriyor's AI assistant, and I can only answer questions about Shaxriyor Jabborov",
    "can only answer questions about Shaxriyor",
    "only answer questions about Shaxriyor Jabborov",
    "I can only help with questions about Shaxriyor",
  ];

  const isOffTopic = refusalIndicators.some(indicator =>
    rawResponse.toLowerCase().includes(indicator.toLowerCase())
  );

  return { response: rawResponse, isOffTopic };
}

export async function POST(request: NextRequest) {
  let userMessage = '';
  let userIP = 'Unknown';

  try {
    const { message, history } = await request.json() as {
      message: string;
      history?: ChatMessage[];
    };
    userMessage = message;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    userIP = getClientIP(request);

    const rateLimit = checkRateLimit(userIP);
    if (!rateLimit.allowed) {
      const resetIn = Math.ceil((rateLimit.resetAt - Date.now()) / 1000 / 60);
      return NextResponse.json(
        {
          error: `You've asked too many off-topic questions. Please ask about Shaxriyor Jabborov. Try again in ${resetIn} minute(s).`,
          resetAt: rateLimit.resetAt,
          isRateLimited: true,
        },
        { status: 429 }
      );
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      const fallbackResponses = [
        "I'd be happy to tell you more about Shaxriyor's work! What specific aspect would you like to know about?",
        "Shaxriyor is a talented DevOps engineer with expertise in cloud infrastructure and automation. What would you like to know about his projects or experience?",
        "I can help you learn about Shaxriyor's skills, projects, or background. What interests you most?",
        "Shaxriyor has worked on some amazing projects! Would you like to hear about his e-commerce platform, AI analytics dashboard, or something else?",
        "I'm here to answer questions about Shaxriyor's work and experience. What would you like to know?"
      ];

      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      await logChatInteraction(userMessage, randomResponse, userIP, false);

      return NextResponse.json({
        response: randomResponse,
        timestamp: new Date().toISOString(),
        isFallback: true,
      });
    }

    const chatMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-10);
      for (const msg of recentHistory) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          chatMessages.push({ role: msg.role, content: msg.content });
        }
      }
    } else {
      chatMessages.push({ role: 'user', content: userMessage });
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: chatMessages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await openaiResponse.json();
    const rawResponse = data.choices[0]?.message?.content || '{"response": "Sorry, I encountered an error. Please try again.", "isOffTopic": false}';

    const parsedResponse = parseAIResponse(rawResponse);

    if (parsedResponse.isOffTopic) {
      incrementRateLimit(userIP);
      const updatedRateLimit = checkRateLimit(userIP);

      await logChatInteraction(
        userMessage,
        parsedResponse.response,
        userIP,
        true,
        updatedRateLimit.remaining
      );

      return NextResponse.json({
        response: parsedResponse.response,
        timestamp: new Date().toISOString(),
        remainingAttempts: updatedRateLimit.remaining,
        isOffTopic: true,
      });
    }

    await logChatInteraction(userMessage, parsedResponse.response, userIP, false);

    return NextResponse.json({
      response: parsedResponse.response,
      timestamp: new Date().toISOString(),
      isOffTopic: false,
    });

  } catch (error) {
    console.error('Chat API error:', error);

    const errorResponse = 'Sorry, I encountered an error. Please try again later.';
    await logChatInteraction(userMessage, errorResponse, userIP, false);

    return NextResponse.json(
      {
        response: errorResponse,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
