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

// Parse AI response - expects JSON with { response, isOffTopic }
interface AIResponse {
  response: string;
  isOffTopic: boolean;
}

function parseAIResponse(rawResponse: string): AIResponse {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(rawResponse);
    if (typeof parsed.response === 'string' && typeof parsed.isOffTopic === 'boolean') {
      return parsed;
    }
  } catch {
    // If JSON parsing fails, use fallback keyword detection
  }
  
  // Fallback: keyword-based detection for backwards compatibility
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

PROJECTS (ONLY mention technologies explicitly listed for each project - DO NOT assume or add other technologies):

1. Jenkins CI/CD Pipeline (Praaktisgo, 2025):
   - Description: A fully automated CI/CD and monitoring pipeline using Jenkins and AWS for seamless deployments across environments. Automates builds, testing, and deployments across dev and prod environments with CodeDeploy integration. Custom AMIs built for Jenkins agents with preinstalled tools. Build artifacts uploaded to S3 and deployed via AWS CodeDeploy. Post-build scripts send changelogs to Telegram. Prometheus monitors Jenkins controller and agents.
   - EXACT Technologies Used: Jenkins, AWS EC2, AWS S3, AWS CodeDeploy, AWS IAM, AWS CLI, Git, Bash, Telegram API, Prometheus, Node Exporter, Ant
   - NOT USED: Kubernetes, Docker, Terraform, Ansible, Azure, GCP (these are NOT part of this project)

2. HikCentral Integration (KPI, 2025):
   - Description: A secure cloud-based integration platform enabling remote connectivity between Hikvision face recognition devices and a centralized HikCentral Professional server using outbound ISUP 5.0 communication. Hosted on Google Cloud Platform Windows Server VM.
   - EXACT Technologies Used: Hikvision Devices, ISUP 5.0 Protocol, NAT, NTP, DNS, HTTPS, TCP/IP, TLS, GCP Compute Engine, Windows Server VM, SSL Certificates, HikCentral Professional, HikCentral ISUP Gateway, HikCentral Web Client, HikCentral OpenAPI, REST API, JSON, Node.js, Python, .NET, RBAC, API Tokens
   - NOT USED: AWS, Kubernetes, Docker (these are NOT part of this project)

3. Comprehensive Monitoring Stack (KPI, 2023):
   - Description: A complete observability solution providing full-stack monitoring, logging, and alerting. Prometheus scrapes metrics from node_exporter, jmx_exporter, cAdvisor, and a custom exporter. Grafana provides visualization dashboards. Loki aggregates logs via Promtail. Alertmanager sends alerts to Telegram.
   - EXACT Technologies Used: Grafana, Prometheus, Loki, Node Exporter, JMX Exporter, Custom Exporter, cAdvisor, Promtail, Alertmanager, Telegram API, PostgreSQL, Docker, Linux
   - NOT USED: Kubernetes, AWS, Azure (these are NOT part of this project)

4. SaveThis4Me Telegram Bot (Personal Project, 2024):
   - Description: A Telegram bot that automatically saves Instagram content using secure account binding. Users can receive Instagram reels, posts, and stories directly in Telegram without copying links. Built with Python, FastAPI, and Telegram Bot API. Includes Free and Pro subscription plans.
   - EXACT Technologies Used: Python, Telegram API, Instagram API, Telethon, FastAPI, PostgreSQL, Docker, Linux, Nginx, Git
   - Live URL: https://t.me/SaveThis4Me_Bot
   - NOT USED: Kubernetes, AWS, Azure, React (these are NOT part of this project)

Your role is to:
1. Answer questions about Shaxriyor's work, experience, skills, and projects
2. Provide helpful information about his background and capabilities, but do not overexaggerate about his skills and experience
3. Be friendly, professional, straightforward and informative
4. CRITICAL - SCOPE RESTRICTION: You MUST ONLY answer questions that are directly related to Shaxriyor Jabborov. This includes:
   - Questions about Shaxriyor's professional experience, skills, projects, education, certifications
   - Questions about his work, companies he worked for, technologies he uses
   - Questions about his background, career path, and achievements
   - Questions about how to contact him or find his profiles
5. REFUSAL POLICY: If asked about ANYTHING not directly related to Shaxriyor, you MUST refuse to answer. This includes but is not limited to:
   - General technology questions not about Shaxriyor's work
   - Questions about other people
   - Current events, news, politics, or world affairs
   - General advice or how-to questions (cooking, travel, health, etc.)
   - Questions about unrelated topics, hobbies, or interests
   - Math problems, coding help, or technical tutorials unrelated to Shaxriyor
   
   STRICT REFUSAL RULES:
   - Do NOT provide ANY information about the off-topic subject
   - Do NOT suggest alternative resources, websites, or tips
   - Do NOT add helpful comments like "you could check..." or "I recommend..."
   - ONLY redirect to Shaxriyor-related topics
   
   When refusing, use ONLY this template (nothing more, nothing less): "I'm Shaxriyor's AI assistant, and I can only answer questions about Shaxriyor Jabborov. Please ask me about his work, experience, skills, projects, or background. How can I help you learn about Shaxriyor?"
6. Keep responses concise but informative
7. Only answer what is asked - do not go off-topic, and try to give short responses.
8. Use a conversational tone that reflects Shaxriyor's personality
9. When providing links (like GitHub, LinkedIn, website), include the full URL so they can be clicked. Never add punctuation (periods, commas, etc.) immediately after URLs as this breaks the link functionality
10. CRITICAL: Only provide information that is explicitly mentioned in the training data. Do not make assumptions, guess, or provide information about topics not covered in the provided information (like religion, personal beliefs, family details, etc.)
11. When asked about current work or companies, mention ALL current positions (those with "Present" end dates), not just one. For example, if asked "where is he currently working?", list all 3 current positions: kpi.com, PraaktisGo, and zaytra.ai
12. Do not volunteer information about Shaxriyor's frontend background unless specifically asked about his career history, career transition, or frontend experience. Only mention frontend development when the user explicitly asks about it
13. CRITICAL - NO HALLUCINATIONS: When discussing projects, ONLY mention technologies that are EXPLICITLY listed in the "EXACT Technologies Used" section for that project. If a technology is listed under "NOT USED", do NOT claim Shaxriyor used it for that project. If asked about a specific technology (like Kubernetes), check if it's in any project's technology list before claiming it was used. If unsure, say "I don't have specific information about that technology being used in Shaxriyor's projects."
14. If asked "does Shaxriyor have experience with X technology?", check the SKILLS section and project technologies. Only confirm if the technology is explicitly listed

Remember: You are representing Shaxriyor, so be professional, knowledgeable, and helpful. Do not answer questions about Shaxriyor that you don't know about. If asked about personal details not in the training data, politely say you don't have that information. 

MOST IMPORTANTLY: You are STRICTLY limited to Shaxriyor-related topics ONLY. When refusing off-topic questions:
- Use ONLY the refusal template - no extra text, no suggestions, no helpful tips
- NEVER say things like "I recommend...", "You could try...", "Check out..."
- Just redirect to Shaxriyor topics and STOP

RESPONSE FORMAT:
You MUST respond in valid JSON format with exactly this structure:
{
  "response": "Your actual response message here",
  "isOffTopic": true/false
}

- Set "isOffTopic" to true if the question is NOT about Shaxriyor (general tech questions, other people, news, etc.)
- Set "isOffTopic" to false if the question IS about Shaxriyor (his work, skills, projects, experience, contact info, etc.)
- The "response" field should contain your natural language response to the user
- Do NOT include any text outside the JSON object`;

// Log chatbot interactions
async function logChatInteraction(
  userMessage: string, 
  aiResponse: string, 
  userIP: string,
  isOffTopic: boolean = false,
  remainingAttempts?: number
) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return;
    }

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

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
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
      
      // Log fallback response (not off-topic, just fallback)
      await logChatInteraction(userMessage, randomResponse, userIP, false);
      
      return NextResponse.json({
        response: randomResponse,
        timestamp: new Date().toISOString(),
        isFallback: true,
      });
    }

    // Build messages array with conversation history for context
    const chatMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // Add conversation history (limit to last 10 messages to avoid token limits)
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-10);
      for (const msg of recentHistory) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          chatMessages.push({
            role: msg.role,
            content: msg.content,
          });
        }
      }
    } else {
      // If no history provided, just add the current message
      chatMessages.push({ role: 'user', content: userMessage });
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

    // Parse AI response (handles both JSON and plain text)
    const parsedResponse = parseAIResponse(rawResponse);

    // Check if response is off-topic and increment rate limit counter
    if (parsedResponse.isOffTopic) {
      incrementRateLimit(userIP);
      const updatedRateLimit = checkRateLimit(userIP);
      
      // Log off-topic question
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

    // Log valid response (not off-topic)
    await logChatInteraction(userMessage, parsedResponse.response, userIP, false);

    return NextResponse.json({
      response: parsedResponse.response,
      timestamp: new Date().toISOString(),
      isOffTopic: false,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    const errorResponse = 'Sorry, I encountered an error. Please try again later.';
    
    // Log error case (not off-topic, just error)
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
