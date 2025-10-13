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
  instagram: string;
  bio: string;
  shortBio: string;
  skills: {
    cloud: string[];
    containers: string[];
    infrastructure: string[];
    cicd: string[];
    monitoring: string[];
    tools: string[];
  };
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
    website?: string;
    employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
    logo?: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
    logo?: string;
    logoLight?: string;
    logoDark?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    year: string;
    expired?: boolean;
    logo?: string;
    logoLight?: string;
    logoDark?: string;
  }>;
  languages: Array<{
    name: string;
    level: string;
    flag?: string;
    country?: string;
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
  title: "DevOps Engineer",
  location: "Tashkent, Uzbekistan",
  email: "shaxriyor@shaxa.dev",
  website: "https://shaxa.dev",
  github: "https://github.com/ilyshaxa",
  linkedin: "https://linkedin.com/in/shaxriyor",
  twitter: "https://twitter.com/ilyshaxa",
  instagram: "https://instagram.com/ilyshaxa",
  bio: "I'm a passionate DevOps engineer with expertise in cloud infrastructure and automation. I love building scalable systems, solving complex infrastructure problems, and creating reliable deployment pipelines that make a difference. With a strong foundation in both cloud platforms and containerization, I enjoy working across the entire DevOps technology stack.",
  shortBio: "DevOps engineer passionate about building scalable infrastructure and creating reliable automation solutions.",
  skills: {
    cloud: ["AWS", "Azure", "Google Cloud", "DigitalOcean", "Alibaba Cloud"],
    containers: ["Docker", "Kubernetes", "Podman", "Containerd", "Helm"],
    infrastructure: ["Terraform", "Ansible", "Pulumi", "CloudFormation", "ARM Templates", "CDK"],
    cicd: ["Jenkins", "GitLab CI", "GitHub Actions", "Azure DevOps", "CircleCI", "ArgoCD"],
    monitoring: ["Prometheus", "Grafana", "Loki", "Promtail", "ELK Stack", "Datadog"],
    tools: ["Git", "Linux", "Bash", "Python", "YAML", "JSON"]
  },
  experience: [
    {
      company: "kpi.com",
      position: "DevOps Engineer",
      duration: "2023 May - Present",
      description: "Responsible for DevOps, automation, and cloud infrastructure at kpi.com.",
      website: "https://kpi.com",
      employmentType: "Full-time",
      logo: "/images/companies/kpi-logo.png"
    },
    {
      company: "PraaktisGo",
      position: "DevOps Engineer",
      duration: "2025 January - Present",
      description: "Responsible for DevOps, automation, and cloud infrastructure at PraaktisGo.",
      website: "https://praaktisgo.com",
      employmentType: "Freelance",
      logo: "/images/companies/praaktisgo-logo.png"
    },
    {
      company: "zaytra.ai",
      position: "DevOps Engineer & Tech Lead",
      duration: "2025 July - Present",
      description: "Responsible for DevOps, automation, and cloud infrastructure at zaytra.ai. Also, responsible for the technical direction of the company.",
      website: "https://zaytra.ai",
      employmentType: "Freelance",
      logo: "/images/companies/zaytra-logo.png"
    },
    {
      company: "izish.uz",
      position: "DevOps Engineer",
      duration: "2024 November - 2025 July",
      description: "Responsible for DevOps, automation, and cloud infrastructure at izish.uz.",
      website: "https://izish.uz",
      employmentType: "Contract",
      logo: "/images/companies/izish-logo.png"
    },
    {
      company: "RetouchGarage",
      position: "DevOps Engineer & Tech Lead",
      duration: "2025 June - 2025 July",
      description: "Responsible for DevOps, automation, and cloud infrastructure at RetouchGarage. Also, responsible for the technical direction of the company.",
      website: "https://retouchgarage.com",
      employmentType: "Part-time",
      logo: "/images/companies/retouch-logo.png"
    }
  ],
  education: [
    {
      institution: "Tashkent State University of Economics",
      degree: "Bachelor's in Economics",
      year: "2022 - 2027",
      logo: "/images/education/tsue-light.png",
      logoLight: "/images/education/tsue-light.png",
      logoDark: "/images/education/tsue-dark.png"
    }
  ],
  certifications: [
    {
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      year: "2025",
      expired: false,
      logo: "/images/certifications/aws-dark.png",
      logoLight: "/images/certifications/aws-light.png",
      logoDark: "/images/certifications/aws-dark.png"
    },
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      year: "2025",
      expired: false,
      logo: "/images/certifications/aws-dark.png",
      logoLight: "/images/certifications/aws-light.png",
      logoDark: "/images/certifications/aws-dark.png"
    },
    {
      name: "AWS Certified DevOps Engineer",
      issuer: "Amazon Web Services",
      year: "2025",
      expired: false,
      logo: "/images/certifications/aws-dark.png",
      logoLight: "/images/certifications/aws-light.png",
      logoDark: "/images/certifications/aws-dark.png"
    },
    {
      name: "IELTS",
      issuer: "British Council",
      year: "2022",
      expired: true,
      logo: "/images/certifications/british-council.png",
      logoLight: "/images/certifications/british-council.png",
      logoDark: "/images/certifications/british-council.png "
    }
  ],
  languages: [
    { 
      name: "English", 
      level: "Fluent", 
      flag: "https://flagcdn.com/gb.svg",
      country: "United Kingdom"
    },
    { 
      name: "Russian", 
      level: "Basic", 
      flag: "https://flagcdn.com/ru.svg",
      country: "Russia"
    },
    { 
      name: "Uzbek", 
      level: "Native", 
      flag: "https://flagcdn.com/uz.svg",
      country: "Uzbekistan"
    }
  ],
  cvUrl: "/cv/shaxriyor-jabborov-cv.pdf",
  sshKeyUrl: "/keys/shaxa-dev.pub"
};

const projectsData: ProjectsData = {
  featured: [
    {
      title: "E-Commerce Platform",
      description: "A cloud-native e-commerce platform deployed on Kubernetes with CI/CD pipelines. Features include automated scaling, infrastructure as code, monitoring, and secure container orchestration.",
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
      technologies: ["React", "Python", "TensorFlow", "D3.js", "FastAPI", "Next.js"],
      image: "/projects/analytics.svg",
      liveUrl: "https://analytics-demo.shaxa.dev",
      githubUrl: "https://github.com/shaxa/ai-analytics",
      featured: true,
      status: "In Progress",
      year: "2024"
    },
    {
      title: "DevOps Infrastructure Portfolio",
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
