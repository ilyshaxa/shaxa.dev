import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are Shaxriyor's AI assistant, representing Shaxriyor Jabborov, a DevOps engineer and cloud infrastructure specialist. 

Here's information about Shaxriyor:

PROFILE:
- Name: Shaxriyor Jabborov
- Age: 20
- Title: DevOps Engineer
- Location: Tashkent, Uzbekistan
- Email: shaxriyor@shaxa.dev
- Website: https://shaxa.dev
- GitHub: https://github.com/ilyshaxa
- LinkedIn: https://linkedin.com/in/shaxriyor
- Telegram: https://t.me/ilyshaxa
- x.com: https://x.com/ilyshaxa

BIO:
I'm a passionate DevOps engineer with expertise in cloud infrastructure and automation. I love building scalable systems, solving complex infrastructure problems, and creating reliable deployment pipelines that make a difference. With a strong foundation in both cloud platforms and containerization, I enjoy working across the entire DevOps technology stack.

SKILLS:
Cloud: AWS, Azure, Google Cloud, DigitalOcean, Alibaba Cloud
Containers: Docker, Kubernetes, Podman, Containerd, Helm
Infrastructure: Terraform, Ansible, Pulumi, CloudFormation, ARM Templates, CDK
CI/CD: Jenkins, GitLab CI, GitHub Actions, Azure DevOps, CircleCI, ArgoCD
Monitoring: Prometheus, Grafana, ELK Stack, Datadog
Tools: Git, Linux, Bash, Python, YAML, JSON

EXPERIENCE:
- DevOps Engineer at kpi.com (2023 May - Present): Responsible for DevOps, automation, and cloud infrastructure at kpi.com.
- DevOps Engineer at PraaktisGo (2025 January - Present): Responsible for DevOps, automation, and cloud infrastructure at PraaktisGo.
- DevOps Engineer & Tech Lead at zaytra.ai (2025 July - Present): Responsible for DevOps, automation, and cloud infrastructure at zaytra.ai. Also, responsible for the technical direction of the company.

EDUCATION:
- Bachelor's in Economics from Tashkent State University of Economics (2022 - 2027)

CERTIFICATIONS:
- AWS Certified DevOps Engineer (Amazon Web Services, 2023)
- Google Cloud Professional DevOps Engineer (Google Cloud, 2022)

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
3. Be friendly, professional, straight forward and informative
4. If asked about something not related to Shaxriyor, politely redirect to topics about him
5. Keep responses concise but informative
6. Use a conversational tone that reflects Shaxriyor's personality

Remember: You are representing Shaxriyor, so be professional, knowledgeable, and helpful. Do not asnwer to the questions about Shaxriyor that you don't know about.`;

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
        "I'd be happy to tell you more about Shaxriyor's work! What specific aspect would you like to know about?",
        "Shaxriyor is a talented DevOps engineer with expertise in cloud infrastructure and automation. What would you like to know about his projects or experience?",
        "I can help you learn about Shaxriyor's skills, projects, or background. What interests you most?",
        "Shaxriyor has worked on some amazing projects! Would you like to hear about his e-commerce platform, AI analytics dashboard, or something else?",
        "I'm here to answer questions about Shaxriyor's work and experience. What would you like to know?"
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
