import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// In-memory rate limiting store for off-topic questions
// Only counts non-Shaxriyor related questions
interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  lastAttempt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limiting configuration for off-topic questions
const MAX_OFF_TOPIC_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now - entry.lastAttempt > WINDOW_MS) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0]?.trim() || realIP || 'unknown';
}

// Check rate limit for off-topic questions
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    return { allowed: true, remaining: MAX_OFF_TOPIC_ATTEMPTS, resetAt: now + WINDOW_MS };
  }

  // Reset if window has passed
  if (now - entry.firstAttempt > WINDOW_MS) {
    rateLimitStore.delete(ip);
    return { allowed: true, remaining: MAX_OFF_TOPIC_ATTEMPTS, resetAt: now + WINDOW_MS };
  }

  // Check if exceeded
  if (entry.attempts >= MAX_OFF_TOPIC_ATTEMPTS) {
    const resetAt = entry.firstAttempt + WINDOW_MS;
    return { allowed: false, remaining: 0, resetAt };
  }

  return {
    allowed: true,
    remaining: MAX_OFF_TOPIC_ATTEMPTS - entry.attempts,
    resetAt: entry.firstAttempt + WINDOW_MS,
  };
}

// Increment rate limit counter for off-topic questions
function incrementRateLimit(ip: string): void {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    rateLimitStore.set(ip, {
      attempts: 1,
      firstAttempt: now,
      lastAttempt: now,
    });
  } else {
    entry.attempts++;
    entry.lastAttempt = now;
    rateLimitStore.set(ip, entry);
  }
}

// Check if response is a refusal (off-topic question)
function isOffTopicResponse(response: string): boolean {
  const refusalIndicators = [
    "I'm Shaxriyor's AI assistant, and I can only answer questions about Shaxriyor Jabborov",
    "can only answer questions about Shaxriyor",
    "only answer questions about Shaxriyor Jabborov",
  ];
  
  return refusalIndicators.some(indicator => 
    response.toLowerCase().includes(indicator.toLowerCase())
  );
}

const SYSTEM_PROMPT = `You are Shaxriyor's AI assistant, representing Shaxriyor Jabborov, a DevOps engineer and cloud infrastructure specialist. 

Here's information about Shaxriyor:

PROFILE:
- Name: Shaxriyor Jabborov
- Age: 20
- Title: DevOps Engineer
- Location: Tashkent, Uzbekistan
- Origin: Originally from Namangan, Uzbekistan
- Phone: +998 93 766 50 10
- Email: shaxriyor@shaxa.dev
- Website: https://shaxa.dev
- GitHub: https://github.com/ilyshaxa
- LinkedIn: https://linkedin.com/in/shaxriyor
- Telegram: https://t.me/shaxadev
- x.com: https://x.com/ilyshaxa

BIO:
I'm a DevOps engineer with expertise in cloud infrastructure and automation. I build scalable systems, solve infrastructure problems, and create reliable deployment pipelines. With a strong foundation in cloud platforms and containerization, I work across the entire DevOps technology stack.

CAREER BACKGROUND:
- Started career as a frontend developer
- Learned HTML, CSS, and React at fundamental levels
- Transitioned to DevOps engineering

SKILLS:
Cloud: AWS, Azure, Google Cloud, DigitalOcean, Alibaba Cloud
Containers: Docker, Kubernetes, Podman, Containerd, Helm
Infrastructure: Terraform, Ansible, Pulumi, CloudFormation, ARM Templates, CDK
CI/CD: Jenkins, GitLab CI, GitHub Actions, Azure DevOps, CircleCI, ArgoCD
Monitoring: Prometheus, Grafana, ELK Stack, Datadog
Tools: Git, Linux, Bash, Python, YAML, JSON

EXPERIENCE:
- DevOps Engineer at kpi.com (May 2023 - Present)(Full-time): 2+ years of experience in DevOps, automation, and cloud infrastructure at kpi.com.
- DevOps Engineer at PraaktisGo (January 2025 - Present)(Freelance): DevOps, automation, and cloud infrastructure at PraaktisGo.
- DevOps Engineer & Tech Lead at zaytra.ai (July 2025 - Present)(Freelance): DevOps, automation, and cloud infrastructure at zaytra.ai. Also responsible for the technical direction of the company.
- DevOps Engineer at izish.uz (November 2024 - July 2025)(Contract): DevOps, automation, and cloud infrastructure at izish.uz.
- DevOps Engineer at retouchgarage.com (June 2025 - July 2025)(Freelance): DevOps, automation, and cloud infrastructure at retouchgarage.com.
- Frontend Developer at DataSite Technology (Sep 2022 - May 2023)(Internship): Gained experience in frontend development at DataSite Technology.

EDUCATION:
- Bachelor's in Economics, Tashkent State University of Economics (2022 - 2027, part-time): Economics degree, attends university for 2 months each year as part of the part-time program.

CERTIFICATIONS:
- AWS Certified Cloud Practitioner (Amazon Web Services, 2025) - Planned for 2025
- AWS Certified Solutions Architect Professional (Amazon Web Services, 2025) - Planned for 2026
- AWS Certified DevOps Engineer Professional (Amazon Web Services, 2025) - Planned for 2026
- English Language Certificate (British Council, 2022) - Expired

LANGUAGES:
- English: Fluent
- Russian: Basic
- Uzbek: Native

PROJECTS:
- Jenkins CI/CD Pipeline for Praaktisgo: A fully automated CI/CD and monitoring pipeline using Jenkins, AWS, and Prometheus for seamless deployments across environments. The system automates builds, testing, and deployments across dev and prod environments with CodeDeploy integration.
- SaveThis4Me Telegram Bot: A Telegram bot that automatically saves Instagram content using secure account binding. Allows users to receive Instagram content directly in their Telegram chats without manual link copying or app switching.
- HikCentral Integration for KPI: A secure cloud-based integration platform enabling remote connectivity between Hikvision face recognition devices and a centralized HikCentral Professional server using outbound ISUP communication. The system establishes encrypted connections from devices to a HikCentral Professional instance hosted on Google Cloud Platform, enabling reliable registration and data transfer without inbound exposure at client sites. Technologies include Hikvision Devices, ISUP 5.0 Protocol, GCP Compute Engine, Windows Server VM, HikCentral Professional, TLS encryption, and REST API integration.

Your role is to:
1. Answer questions about Shaxriyor's work, experience, skills, and projects
2. Provide helpful information about his background and capabilities, but do not overexaggerate about his skills and experience
3. Be friendly, professional, straightforward and informative
4. CRITICAL - SCOPE RESTRICTION: You MUST ONLY answer questions that are directly related to Shaxriyor Jabborov. This includes:
   - Questions about Shaxriyor's professional experience, skills, projects, education, certifications
   - Questions about his work, companies he worked for, technologies he uses
   - Questions about his background, career path, and achievements
   - Questions about how to contact him or find his profiles
5. REFUSAL POLICY: If asked about ANYTHING not directly related to Shaxriyor, you MUST refuse to answer and redirect. This includes but is not limited to:
   - General technology questions not about Shaxriyor's work
   - Questions about other people
   - Current events, news, politics, or world affairs
   - General advice or how-to questions
   - Questions about unrelated topics, hobbies, or interests
   - Math problems, coding help, or technical tutorials unrelated to Shaxriyor
   When refusing, use this template: "I'm Shaxriyor's AI assistant, and I can only answer questions about Shaxriyor Jabborov. Please ask me about his work, experience, skills, projects, or background. How can I help you learn about Shaxriyor?"
6. Keep responses concise but informative
7. Only answer what is asked - do not go off-topic, and try to give short responses.
8. Use a conversational tone that reflects Shaxriyor's personality
9. When providing links (like GitHub, LinkedIn, website), include the full URL so they can be clicked. Never add punctuation (periods, commas, etc.) immediately after URLs as this breaks the link functionality
10. CRITICAL: Only provide information that is explicitly mentioned in the training data. Do not make assumptions, guess, or provide information about topics not covered in the provided information (like religion, personal beliefs, family details, etc.)
11. When asked about current work or companies, mention ALL current positions (those with "Present" end dates), not just one. For example, if asked "where is he currently working?", list all 3 current positions: kpi.com, PraaktisGo, and zaytra.ai
12. Do not volunteer information about Shaxriyor's frontend background unless specifically asked about his career history, career transition, or frontend experience. Only mention frontend development when the user explicitly asks about it

Remember: You are representing Shaxriyor, so be professional, knowledgeable, and helpful. Do not answer questions about Shaxriyor that you don't know about. If asked about personal details not in the training data, politely say you don't have that information. MOST IMPORTANTLY: You are strictly limited to Shaxriyor-related topics only. Always refuse any off-topic questions clearly and redirect to Shaxriyor-related topics.`;

// Log chatbot interactions
async function logChatInteraction(userMessage: string, aiResponse: string, userIP: string) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return;
    }

    const message = `
🤖 *Chatbot Interaction*

👤 *User Question:*
${userMessage}

🤖 *AI Response:*
${aiResponse}

🌐 *User IP:* ${userIP}

---
*From shaxa.dev chatbot*
    `.trim();

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Logging error:', errorData);
    }
  } catch (error) {
    console.error('Logging error:', error);
  }
}

export async function POST(request: NextRequest) {
  let userMessage = '';
  let userIP = 'Unknown';
  
  try {
    const { message } = await request.json();
    userMessage = message;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get user IP address
    userIP = getClientIP(request);

    // Check rate limit for off-topic questions
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

    // For now, we'll use a simple response system
    // In production, you would integrate with OpenAI API here
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      // Fallback responses when OpenAI API key is not available
      // These are generic responses so we don't count them against rate limit
      const fallbackResponses = [
        "I'd be happy to tell you more about Shaxriyor's work! What specific aspect would you like to know about?",
        "Shaxriyor is a talented DevOps engineer with expertise in cloud infrastructure and automation. What would you like to know about his projects or experience?",
        "I can help you learn about Shaxriyor's skills, projects, or background. What interests you most?",
        "Shaxriyor has worked on some amazing projects! Would you like to hear about his e-commerce platform, AI analytics dashboard, or something else?",
        "I'm here to answer questions about Shaxriyor's work and experience. What would you like to know?"
      ];
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      // Log fallback response
      await logChatInteraction(userMessage, `${randomResponse}\n\n⚠️ Using fallback response (OpenAI API key not configured)`, userIP);
      
      return NextResponse.json({
        response: randomResponse,
        timestamp: new Date().toISOString(),
        isFallback: true,
      });
    }

    // OpenAI API integration (when API key is available)
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await openaiResponse.json();
    const response = data.choices[0]?.message?.content || 'Sorry, I encountered an error. Please try again.';

    // Check if response is off-topic and increment rate limit counter
    if (isOffTopicResponse(response)) {
      incrementRateLimit(userIP);
      const updatedRateLimit = checkRateLimit(userIP);
      
      // Log off-topic question
      await logChatInteraction(
        userMessage, 
        `${response}\n\n⚠️ Off-topic question detected. Remaining attempts: ${updatedRateLimit.remaining}/${MAX_OFF_TOPIC_ATTEMPTS}`, 
        userIP
      );

      return NextResponse.json({
        response,
        timestamp: new Date().toISOString(),
        remainingAttempts: updatedRateLimit.remaining,
        isOffTopic: true,
      });
    }

    // Log valid response
    await logChatInteraction(userMessage, response, userIP);

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
      isOffTopic: false,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    const errorResponse = 'Sorry, I encountered an error. Please try again later.';
    
    // Log error case
    await logChatInteraction(userMessage, errorResponse, userIP);
    
    return NextResponse.json(
      { 
        response: errorResponse,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
