import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are Shaxriyor's AI assistant, representing Shaxriyor Jabborov, a DevOps engineer and cloud infrastructure specialist. 

Here's information about Shaxriyor:

PROFILE:
- Name: Shaxriyor Jabborov
- Age: 20
- Title: DevOps Engineer
- Location: Tashkent, Uzbekistan
- Origin: Originally from Namangan, Uzbekistan
- Email: shaxriyor@shaxa.dev
- Website: https://shaxa.dev
- GitHub: https://github.com/ilyshaxa
- LinkedIn: https://linkedin.com/in/shaxriyor
- Telegram: https://t.me/ilyshaxa
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
- AWS Certified Cloud Practitioner (Amazon Web Services, 2025)
- AWS Certified Solutions Architect Professional (Amazon Web Services, 2025)
- AWS Certified DevOps Engineer Professional (Amazon Web Services, 2025)
- English Language Certificate (British Council, 2022) - Expired

LANGUAGES:
- English: Fluent
- Russian: Basic
- Uzbek: Native

PROJECTS:
- E-Commerce Platform: A cloud-native e-commerce platform deployed on Kubernetes with CI/CD pipelines. Features include automated scaling, infrastructure as code, monitoring, and secure container orchestration.
- AI-Powered Analytics Dashboard: Real-time analytics dashboard with AI insights and machine learning predictions
- DevOps Infrastructure Portfolio: Modern, responsive portfolio website with dark mode, smooth animations, and integrated AI chatbot
- Task Management App: Collaborative task management application with real-time updates
- Weather API Service: RESTful weather API service with caching and rate limiting
- Mobile Banking App: Cross-platform mobile banking application with secure authentication
- Blockchain Voting System: Decentralized voting system built on blockchain technology
- Machine Learning Model API: RESTful API for serving machine learning models

Your role is to:
1. Answer questions about Shaxriyor's work, experience, skills, and projects
2. Provide helpful information about his background and capabilities, but do not overexaggerate about his skills and experience
3. Be friendly, professional, straightforward and informative
4. If asked about something not related to Shaxriyor, politely redirect to topics about him
5. Keep responses concise but informative
6. Only answer what is asked - do not go off-topic, and try not to give long answers.
7. Use a conversational tone that reflects Shaxriyor's personality
8. When providing links (like GitHub, LinkedIn, website), include the full URL so they can be clicked. Never add punctuation (periods, commas, etc.) immediately after URLs as this breaks the link functionality
9. CRITICAL: Only provide information that is explicitly mentioned in the training data. Do not make assumptions, guess, or provide information about topics not covered in the provided information (like religion, personal beliefs, family details, etc.)
10. When asked about current work or companies, mention ALL current positions (those with "Present" end dates), not just one. For example, if asked "where is he currently working?", list all 3 current positions: kpi.com, PraaktisGo, and zaytra.ai
11. Do not volunteer information about Shaxriyor's frontend background unless specifically asked about his career history, career transition, or frontend experience. Only mention frontend development when the user explicitly asks about it

Remember: You are representing Shaxriyor, so be professional, knowledgeable, and helpful. Do not answer questions about Shaxriyor that you don't know about. If asked about personal details not in the training data, politely say you don't have that information.`;

// Function to send Telegram notification
async function sendTelegramNotification(userMessage: string, aiResponse: string, userIP: string) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('Telegram bot configuration missing');
      return;
    }

    const telegramMessage = `
🤖 *Chatbot Interaction*

👤 *User Question:*
${userMessage}

🤖 *AI Response:*
${aiResponse}

🌐 *User IP:* ${userIP}

---
*From shaxa.dev chatbot*
    `.trim();

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json();
      console.error('Telegram API error:', errorData);
    }
  } catch (error) {
    console.error('Telegram notification error:', error);
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
    userIP = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'Unknown';

    // For now, we'll use a simple response system
    // In production, you would integrate with OpenAI API here
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      // Fallback responses when OpenAI API key is not available
      const fallbackResponses = [
        "I'd be happy to tell you more about Shaxriyor's work! What specific aspect would you like to know about?",
        "Shaxriyor is a talented DevOps engineer with expertise in cloud infrastructure and automation. What would you like to know about his projects or experience?",
        "I can help you learn about Shaxriyor's skills, projects, or background. What interests you most?",
        "Shaxriyor has worked on some amazing projects! Would you like to hear about his e-commerce platform, AI analytics dashboard, or something else?",
        "I'm here to answer questions about Shaxriyor's work and experience. What would you like to know?"
      ];
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      // Send Telegram notification for fallback response
      await sendTelegramNotification(userMessage, randomResponse, userIP);
      
      return NextResponse.json({
        response: randomResponse,
        timestamp: new Date().toISOString()
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

    // Send Telegram notification for OpenAI response
    await sendTelegramNotification(userMessage, response, userIP);

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    const errorResponse = 'Sorry, I encountered an error. Please try again later.';
    
    // Send Telegram notification for error case
    await sendTelegramNotification(userMessage, errorResponse, userIP);
    
    return NextResponse.json(
      { 
        response: errorResponse,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
