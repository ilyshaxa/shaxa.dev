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
    status: string;
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
}

export interface Project {
  title: string;
  shortDescription: string;
  fullDescription: string;
  technologies: string[];
  coverImage: string;
  coverImageLight?: string;
  expandedImage?: string;
  expandedImageLight?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: string;
  year: string;
  companyName?: string;
  slug?: string;
}

export function generateProjectSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
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
  bio: "I'm a DevOps engineer with expertise in cloud infrastructure and automation. I build scalable systems, solve infrastructure problems, and create reliable deployment pipelines. With a strong foundation in cloud platforms and containerization, I work across the entire DevOps technology stack.",
  shortBio: "DevOps engineer focused on building scalable infrastructure and creating reliable automation solutions.",
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
      duration: "May 2023 - Present",
      description: "1+ years of experience in DevOps, automation, and cloud infrastructure at kpi.com.",
      website: "https://kpi.com",
      employmentType: "Full-time",
      logo: "/images/companies/kpi-logo.png"
    },
    {
      company: "PraaktisGo",
      position: "DevOps Engineer",
      duration: "January 2025 - Present",
      description: "DevOps, automation, and cloud infrastructure at PraaktisGo.",
      website: "https://praaktisgo.com",
      employmentType: "Freelance",
      logo: "/images/companies/praaktisgo-logo.png"
    },
    {
      company: "zaytra.ai",
      position: "DevOps Engineer & Tech Lead",
      duration: "July 2025 - Present",
      description: "DevOps, automation, and cloud infrastructure at zaytra.ai. Also responsible for the technical direction of the company.",
      website: "https://zaytra.ai",
      employmentType: "Freelance",
      logo: "/images/companies/zaytra-logo.png"
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
      status: "Planned",
      logo: "/images/certifications/AWS-Certified-Cloud-Practitioner.png",
      logoLight: "/images/certifications/AWS-Certified-Cloud-Practitioner.png",
      logoDark: "/images/certifications/AWS-Certified-Cloud-Practitioner.png"
    },
    {
      name: "AWS Certified Solutions Architect Professional",
      issuer: "Amazon Web Services",
      year: "2026",
      status: "Planned",
      logo: "/images/certifications/AWS-Certified-Solutions-Architect-Professional.png",
      logoLight: "/images/certifications/AWS-Certified-Solutions-Architect-Professional.png",
      logoDark: "/images/certifications/AWS-Certified-Solutions-Architect-Professional.png"
    },
    {
      name: "AWS Certified DevOps Engineer Professional",
      issuer: "Amazon Web Services",
      year: "2026",
      status: "Planned",
      logo: "/images/certifications/AWS-Certified-DevOps-Engineer-Professional.png",
      logoLight: "/images/certifications/AWS-Certified-DevOps-Engineer-Professional.png",
      logoDark: "/images/certifications/AWS-Certified-DevOps-Engineer-Professional.png"
    },
    {
      name: "English Language Certificate",
      issuer: "British Council",
      year: "2022",
      status: "Expired",
      logo: "/images/certifications/IELTS.png",
      logoLight: "/images/certifications/IELTS.png",
      logoDark: "/images/certifications/IELTS.png"
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
  cvUrl: "/cv/shaxriyor-jabborov-cv.pdf"
};

const projectsData: ProjectsData = {
  featured: [
    {
      "title": "Jenkins CI/CD Pipeline for Praaktisgo",
      "shortDescription": "A fully automated CI/CD and monitoring pipeline using Jenkins, AWS, and Prometheus for seamless deployments across environments.",
      "fullDescription": "Designed and implemented a production-grade CI/CD pipeline for Praaktisgo using Jenkins and AWS. The system automates builds, testing, and deployments across dev and prod environments with CodeDeploy integration. Custom AMIs were built for Jenkins agents with preinstalled tools (JDK, Ant, Git, AWS CLI), and the pipeline dynamically provisions build agents to compile and deploy applications. Build artifacts are uploaded to S3 and deployed via AWS CodeDeploy, while post-build scripts send changelogs and build status updates to a Telegram group. Prometheus monitors the Jenkins controller and agents through node_exporter, providing real-time visibility into resource usage and performance metrics.",
      "technologies": ["Jenkins", "AWS EC2", "AWS S3", "AWS CodeDeploy", "AWS IAM", "Prometheus", "Node Exporter", "Ant", "Git", "Bash", "Telegram API"],
      "coverImage": "/projects/praaktisgo-jenkins-ci-cd-dark.svg",
      "coverImageLight": "/projects/praaktisgo-jenkins-ci-cd-light.svg",
      "expandedImage": "/projects/praaktisgo-jenkins-ci-cd-dark.svg",
      "expandedImageLight": "/projects/praaktisgo-jenkins-ci-cd-light.svg",
      "liveUrl": "",
      "githubUrl": "",
      "featured": true,
      "status": "Completed",
      "year": "2025",
      "companyName": "Praaktisgo",
      "slug": "praaktisgo-jenkins-ci-cd"
    },
    {
      title: "AI-Powered Analytics Dashboard",
      shortDescription: "Real-time analytics dashboard with AI insights and machine learning predictions.",
      fullDescription: "An advanced real-time analytics dashboard powered by artificial intelligence and machine learning algorithms. This sophisticated platform processes large datasets to provide actionable business intelligence and predictive insights. Features include real-time data visualization, automated report generation, anomaly detection, and customizable dashboards for different stakeholders.",
      technologies: ["React", "Python", "TensorFlow", "D3.js", "FastAPI", "Next.js", "PostgreSQL", "Redis"],
      coverImage: "/projects/analytics.svg",
      coverImageLight: "/projects/analytics-light.svg",
      expandedImage: "/projects/analytics.svg",
      expandedImageLight: "/projects/analytics-light.svg",
      // No liveUrl - demonstrating optional links
      githubUrl: "https://github.com/shaxa/ai-analytics",
      featured: true,
      status: "In Progress",
      year: "2024",
      companyName: "zaytra.ai",
      slug: "ai-powered-analytics-dashboard"
    }
  ],
  all: [
    {
      title: "DevOps Infrastructure Portfolio",
      shortDescription: "Modern, responsive portfolio website with dark mode and integrated AI chatbot.",
      fullDescription: "A cutting-edge portfolio website built with Next.js 14, featuring modern design principles, dark mode support, smooth animations, and an integrated AI chatbot. The site showcases professional work, includes interactive elements, and provides a seamless user experience across all devices. Deployed on Vercel with optimized performance and SEO.",
      technologies: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "OpenAI API", "Vercel"],
      coverImage: "/projects/portfolio.svg",
      coverImageLight: "/projects/portfolio-light.svg",
      expandedImage: "/projects/portfolio.svg",
      expandedImageLight: "/projects/portfolio-light.svg",
      liveUrl: "https://shaxa.dev",
      // No githubUrl - demonstrating optional links
      featured: false,
      status: "Completed",
      year: "2024",
      slug: "devops-infrastructure-portfolio"
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
