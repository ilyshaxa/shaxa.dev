// import yaml from 'js-yaml'; // Not needed for static data

export interface Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  bio: string;
  shortBio: string;
  skills: {
    frontend: string[];
    backend: string[];
    tools: string[];
  };
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
  languages: Array<{
    name: string;
    level: string;
  }>;
  cvUrl: string;
  sshKeyUrl: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: string;
  year: string;
}

export interface ProjectsData {
  featured: Project[];
  all: Project[];
}

// Static data - in production, you might want to load this from a CMS or API
const profileData: Profile = {
  name: "Shaxriyor Jabborov",
  title: "Full-Stack Developer & Software Engineer",
  location: "Tashkent, Uzbekistan",
  email: "shaxriyor@shaxa.dev",
  website: "https://shaxa.dev",
  github: "https://github.com/shaxa",
  linkedin: "https://linkedin.com/in/shaxriyor-jabborov",
  twitter: "https://twitter.com/shaxa_dev",
  bio: "I'm a passionate full-stack developer with expertise in modern web technologies. I love building scalable applications, solving complex problems, and creating user experiences that make a difference. With a strong foundation in both frontend and backend development, I enjoy working across the entire technology stack.",
  shortBio: "Full-stack developer passionate about building scalable applications and creating exceptional user experiences.",
  skills: {
    frontend: ["React/Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Vue.js", "Svelte"],
    backend: ["Node.js", "Python", "PostgreSQL", "MongoDB", "Redis", "Docker"],
    tools: ["Git", "Vercel", "AWS", "Linux", "VS Code", "Figma"]
  },
  experience: [
    {
      company: "Tech Company",
      position: "Senior Full-Stack Developer",
      duration: "2022 - Present",
      description: "Leading development of scalable web applications and mentoring junior developers."
    },
    {
      company: "Startup Inc",
      position: "Full-Stack Developer",
      duration: "2020 - 2022",
      description: "Built and maintained multiple client projects using modern web technologies."
    }
  ],
  education: [
    {
      institution: "Tashkent University of Information Technologies",
      degree: "Bachelor's in Computer Science",
      year: "2016 - 2020"
    }
  ],
  certifications: [
    {
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      year: "2023"
    },
    {
      name: "Google Cloud Professional Developer",
      issuer: "Google Cloud",
      year: "2022"
    }
  ],
  languages: [
    { name: "English", level: "Fluent" },
    { name: "Russian", level: "Native" },
    { name: "Uzbek", level: "Native" }
  ],
  cvUrl: "/cv/shaxriyor-jabborov-cv.pdf",
  sshKeyUrl: "/keys/shaxa-dev.pub"
};

const projectsData: ProjectsData = {
  featured: [
    {
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution built with Next.js, TypeScript, and PostgreSQL. Features include user authentication, payment processing, inventory management, and admin dashboard.",
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Tailwind CSS"],
      image: "/projects/ecommerce.svg",
      liveUrl: "https://ecommerce-demo.shaxa.dev",
      githubUrl: "https://github.com/shaxa/ecommerce-platform",
      featured: true,
      status: "Completed",
      year: "2024"
    },
    {
      title: "AI-Powered Analytics Dashboard",
      description: "Real-time analytics dashboard with AI insights and machine learning predictions. Built for processing large datasets and providing actionable business intelligence.",
      technologies: ["React", "Python", "TensorFlow", "D3.js", "FastAPI"],
      image: "/projects/analytics.svg",
      liveUrl: "https://analytics-demo.shaxa.dev",
      githubUrl: "https://github.com/shaxa/ai-analytics",
      featured: true,
      status: "In Progress",
      year: "2024"
    },
    {
      title: "Developer Portfolio Website",
      description: "Modern, responsive portfolio website with dark mode, smooth animations, and integrated AI chatbot. Built with Next.js 14 and deployed on Vercel.",
      technologies: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "OpenAI API"],
      image: "/projects/portfolio.svg",
      liveUrl: "https://shaxa.dev",
      githubUrl: "https://github.com/shaxa/shaxa.dev",
      featured: true,
      status: "Completed",
      year: "2024"
    }
  ],
  all: [
    {
      title: "Task Management App",
      description: "Collaborative task management application with real-time updates and team collaboration features.",
      technologies: ["Vue.js", "Node.js", "Socket.io", "MongoDB"],
      image: "/projects/taskmanager.jpg",
      liveUrl: "https://tasks-demo.shaxa.dev",
      githubUrl: "https://github.com/shaxa/task-manager",
      featured: false,
      status: "Completed",
      year: "2023"
    },
    {
      title: "Weather API Service",
      description: "RESTful weather API service with caching, rate limiting, and multiple data sources integration.",
      technologies: ["Node.js", "Express", "Redis", "Jest"],
      image: "/projects/weather-api.jpg",
      liveUrl: "https://weather-api.shaxa.dev",
      githubUrl: "https://github.com/shaxa/weather-api",
      featured: false,
      status: "Completed",
      year: "2023"
    },
    {
      title: "Mobile Banking App",
      description: "Cross-platform mobile banking application with secure authentication and transaction management.",
      technologies: ["React Native", "TypeScript", "Firebase", "Redux"],
      image: "/projects/banking.jpg",
      liveUrl: "https://banking-demo.shaxa.dev",
      githubUrl: "https://github.com/shaxa/mobile-banking",
      featured: false,
      status: "Completed",
      year: "2022"
    },
    {
      title: "Blockchain Voting System",
      description: "Decentralized voting system built on blockchain technology with smart contracts and transparent results.",
      technologies: ["Solidity", "Web3.js", "React", "Ethereum"],
      image: "/projects/voting.jpg",
      liveUrl: "https://voting-demo.shaxa.dev",
      githubUrl: "https://github.com/shaxa/blockchain-voting",
      featured: false,
      status: "Completed",
      year: "2022"
    },
    {
      title: "Machine Learning Model API",
      description: "RESTful API for serving machine learning models with automatic scaling and monitoring.",
      technologies: ["Python", "Flask", "Docker", "Kubernetes", "MLflow"],
      image: "/projects/ml-api.jpg",
      liveUrl: "https://ml-api.shaxa.dev",
      githubUrl: "https://github.com/shaxa/ml-model-api",
      featured: false,
      status: "Completed",
      year: "2021"
    }
  ]
};

export function getProfile(): Profile {
  return profileData;
}

export function getProjects(): ProjectsData {
  return projectsData;
}

export function getFeaturedProjects(): Project[] {
  return projectsData.featured;
}

export function getAllProjects(): Project[] {
  return [...projectsData.featured, ...projectsData.all];
}
