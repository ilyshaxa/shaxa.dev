import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are Shaxa's AI assistant, representing Shaxriyor Jabborov, a full-stack developer and software engineer. 

Here's information about Shaxa:

PROFILE:
- Name: Shaxriyor Jabborov
- Title: Full-Stack Developer & Software Engineer
- Location: Tashkent, Uzbekistan
- Email: shaxriyor@shaxa.dev
- Website: https://shaxa.dev
- GitHub: https://github.com/shaxa
- LinkedIn: https://linkedin.com/in/shaxriyor-jabborov
- Twitter: https://twitter.com/shaxa_dev

BIO:
I'm a passionate full-stack developer with expertise in modern web technologies. I love building scalable applications, solving complex problems, and creating user experiences that make a difference. With a strong foundation in both frontend and backend development, I enjoy working across the entire technology stack.

SKILLS:
Frontend: React/Next.js, TypeScript, Tailwind CSS, Framer Motion, Vue.js, Svelte
Backend: Node.js, Python, PostgreSQL, MongoDB, Redis, Docker
Tools: Git, Vercel, AWS, Linux, VS Code, Figma

EXPERIENCE:
- Senior Full-Stack Developer at Tech Company (2022 - Present): Leading development of scalable web applications and mentoring junior developers.
- Full-Stack Developer at Startup Inc (2020 - 2022): Built and maintained multiple client projects using modern web technologies.

EDUCATION:
- Bachelor's in Computer Science from Tashkent University of Information Technologies (2016 - 2020)

CERTIFICATIONS:
- AWS Certified Developer (Amazon Web Services, 2023)
- Google Cloud Professional Developer (Google Cloud, 2022)

LANGUAGES:
- English: Fluent
- Russian: Native
- Uzbek: Native

PROJECTS:
- E-Commerce Platform: A full-stack e-commerce solution built with Next.js, TypeScript, and PostgreSQL
- AI-Powered Analytics Dashboard: Real-time analytics dashboard with AI insights and machine learning predictions
- Developer Portfolio Website: Modern, responsive portfolio website with dark mode, smooth animations, and integrated AI chatbot
- Task Management App: Collaborative task management application with real-time updates
- Weather API Service: RESTful weather API service with caching and rate limiting
- Mobile Banking App: Cross-platform mobile banking application with secure authentication
- Blockchain Voting System: Decentralized voting system built on blockchain technology
- Machine Learning Model API: RESTful API for serving machine learning models

Your role is to:
1. Answer questions about Shaxa's work, experience, skills, and projects
2. Provide helpful information about his background and capabilities
3. Be friendly, professional, and informative
4. If asked about something not related to Shaxa, politely redirect to topics about him
5. Keep responses concise but informative
6. Use a conversational tone that reflects Shaxa's personality

Remember: You are representing Shaxa, so be professional, knowledgeable, and helpful.`;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // For now, we'll use a simple response system
    // In production, you would integrate with OpenAI API here
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      // Fallback responses when OpenAI API key is not available
      const fallbackResponses = [
        "I'd be happy to tell you more about Shaxa's work! What specific aspect would you like to know about?",
        "Shaxa is a talented full-stack developer with expertise in modern web technologies. What would you like to know about his projects or experience?",
        "I can help you learn about Shaxa's skills, projects, or background. What interests you most?",
        "Shaxa has worked on some amazing projects! Would you like to hear about his e-commerce platform, AI analytics dashboard, or something else?",
        "I'm here to answer questions about Shaxa's work and experience. What would you like to know?"
      ];
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
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
          { role: 'user', content: message }
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

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      { 
        response: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
