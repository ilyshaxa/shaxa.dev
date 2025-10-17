// import yaml from 'js-yaml'; // Not needed for static data

export interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
  website?: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
  logo?: string;
  slug: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  location?: string;
  skills: string[];
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  teamSize?: string;
  industry?: string;
}

export interface Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
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
  experience: Experience[];
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
  expandedVideo?: string;
  expandedVideoLight?: string;
  isVideo?: boolean;
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
  phone: "+998 93 766 50 10",
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
      description: "2+ years of experience in DevOps, automation, and cloud infrastructure at kpi.com",
      website: "https://kpi.com",
      employmentType: "Full-time",
      logo: "/images/companies/kpi-logo.png",
      slug: "kpi-com-devops-engineer",
      startDate: "2023-05-01",
      isCurrent: true,
      location: "Remote",
      skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform", "Linux", "Bash", "Python"],
      responsibilities: [
        "Design and implement cloud infrastructure solutions using AWS services",
        "Automate deployment processes and CI/CD pipelines with Jenkins",
        "Manage containerized applications using Docker and Kubernetes",
        "Implement Infrastructure as Code using Terraform",
        "Monitor system performance and troubleshoot infrastructure issues",
        "Collaborate with development teams to optimize deployment workflows"
      ],
      achievements: [
        "Reduced deployment time by 60% through automation",
        "Implemented monitoring solutions that improved system reliability",
        "Successfully migrated legacy applications to cloud infrastructure"
      ],
      technologies: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform", "Linux", "Bash", "Python", "Git", "YAML"],
      teamSize: "5-10",
      industry: "Technology"
    },
    {
      company: "PraaktisGo",
      position: "DevOps Engineer",
      duration: "January 2025 - Present",
      description: "DevOps, automation, and cloud infrastructure at PraaktisGo.",
      website: "https://praaktisgo.com",
      employmentType: "Freelance",
      logo: "/images/companies/praaktisgo-logo.png",
      slug: "praaktisgo-devops-engineer",
      startDate: "2025-01-01",
      isCurrent: true,
      location: "Remote",
      skills: ["Jenkins", "AWS", "Prometheus", "Docker", "Linux", "Bash", "Ant", "Git"],
      responsibilities: [
        "Design and implement comprehensive CI/CD pipelines using Jenkins",
        "Build and maintain custom AMIs for Jenkins agents with preinstalled tools",
        "Integrate AWS services (EC2, S3, CodeDeploy, IAM) for seamless deployments",
        "Implement monitoring solutions using Prometheus and Node Exporter",
        "Develop automation scripts for build processes and deployment workflows",
        "Set up Telegram notifications for build status and changelogs"
      ],
      achievements: [
        "Created a fully automated CI/CD pipeline reducing manual deployment effort by 80%",
        "Implemented monitoring that provides real-time visibility into system performance",
        "Built custom AMIs that significantly improved build agent efficiency"
      ],
      technologies: ["Jenkins", "AWS EC2", "AWS S3", "AWS CodeDeploy", "AWS IAM", "Prometheus", "Node Exporter", "Ant", "Git", "Bash", "Telegram API"],
      teamSize: "3-5",
      industry: "Technology"
    },
    {
      company: "zaytra.ai",
      position: "DevOps Engineer & Tech Lead",
      duration: "July 2025 - Present",
      description: "DevOps, automation, cloud infrastructure and leading the development team at zaytra.ai",
      website: "https://zaytra.ai",
      employmentType: "Freelance",
      logo: "/images/companies/zaytra-logo.png",
      slug: "zaytra-ai-devops-tech-lead",
      startDate: "2025-07-01",
      isCurrent: true,
      location: "Remote",
      skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Python", "AI/ML", "Leadership", "Architecture"],
      responsibilities: [
        "Lead technical strategy and architecture decisions for the company",
        "Design and implement scalable cloud infrastructure for AI/ML workloads",
        "Manage DevOps practices and establish best practices for the team",
        "Mentor junior developers and DevOps engineers",
        "Oversee infrastructure security and compliance requirements",
        "Collaborate with AI/ML teams to optimize model deployment pipelines"
      ],
      achievements: [
        "Established technical direction that improved system scalability by 200%",
        "Led successful migration to cloud-native architecture",
        "Built a team of skilled DevOps professionals"
      ],
      technologies: ["AWS", "Docker", "Kubernetes", "Terraform", "Python", "AI/ML Tools", "Git", "Linux", "Monitoring Tools"],
      teamSize: "10+",
      industry: "Artificial Intelligence"
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
      title: "Jenkins CI/CD Pipeline for Praaktisgo",
      shortDescription: "A fully automated CI/CD and monitoring pipeline using Jenkins, AWS, and Prometheus for seamless deployments across environments.",
      fullDescription: "Designed and implemented a production-grade CI/CD pipeline for Praaktisgo using Jenkins and AWS. The system automates builds, testing, and deployments across dev and prod environments with CodeDeploy integration. Custom AMIs were built for Jenkins agents with preinstalled tools (JDK, Ant, Git, AWS CLI), and the pipeline dynamically provisions build agents to compile and deploy applications. Build artifacts are uploaded to S3 and deployed via AWS CodeDeploy, while post-build scripts send changelogs and build status updates to a Telegram group. Prometheus monitors the Jenkins controller and agents through node_exporter, providing real-time visibility into resource usage and performance metrics.",
      technologies: ["Jenkins", "AWS EC2", "AWS S3", "AWS CodeDeploy", "AWS IAM", "Prometheus", "Node Exporter", "Ant", "Git", "Bash", "Telegram API"],
      coverImage: "/projects/praaktisgo-jenkins-ci-cd-dark.svg",
      coverImageLight: "/projects/praaktisgo-jenkins-ci-cd-light.svg",
      expandedImage: "/projects/praaktisgo-jenkins-ci-cd-dark.svg",
      expandedImageLight: "/projects/praaktisgo-jenkins-ci-cd-light.svg",
      liveUrl: "",
      githubUrl: "",
      featured: true,
      status: "Completed",
      year: "2025",
      companyName: "Praaktisgo",
      slug: "praaktisgo-jenkins-ci-cd"
    },
    {
      title: "SaveThis4Me Telegram Bot",
      shortDescription: "A Telegram bot that automatically saves Instagram content using secure account binding. No more swiching between apps and copying links.",
      fullDescription: "SaveThis4Me is a Telegram bot developed as a personal hobby project, initially created for my own use and later extended for public access. It allows users to receive Instagram content directly in their Telegram chats without manual link copying or app switching. The bot uses user binding tokens to securely connect each user's Instagram account ID with their Telegram account, enabling automatic forwarding of reels, posts and stories. Built with Python, FastAPI, and the Telegram Bot API, it includes both Free and Pro subscription plans, with Telethon handling payment processing and subscription validation. A PostgreSQL database is used to manage user information, payment data, and media statistics. The media retrieval API is containerized with Docker and deployed behind an Nginx reverse proxy, ensuring scalability, reliability, and secure content delivery.",
      technologies: ["Python", "Telegram Bot API", "Telethon", "FastAPI", "PostgreSQL", "Docker", "Linux", "Nginx", "Git"],
      coverImage: "/projects/ST4M-Transparent-Logo.svg",
      coverImageLight: "/projects/ST4M-Transparent-Logo.svg",
      expandedImage: "/projects/ST4M-Transparent-Logo.svg",
      expandedImageLight: "/projects/ST4M-Transparent-Logo.svg",
      expandedVideo: "/projects/savethis4me-demo.mp4",
      expandedVideoLight: "/projects/savethis4me-demo.mp4",
      isVideo: true,
      liveUrl: "https://t.me/SaveThis4Me_Bot",
      githubUrl: "",
      featured: true,
      status: "Completed",
      year: "2024",
      companyName: "Personal Project",
      slug: "save-this-4-me-telegram-bot"
    }
  ],
  all: []
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

export function getExperienceBySlug(slug: string): Experience | null {
  const profile = getProfile();
  return profile.experience.find(exp => exp.slug === slug) || null;
}

export function getAllExperiences(): Experience[] {
  const profile = getProfile();
  return profile.experience;
}

export function getExperienceSlugByCompany(companyName: string): string | null {
  const experiences = getAllExperiences();
  const experience = experiences.find(exp => 
    exp.company.toLowerCase() === companyName.toLowerCase() ||
    exp.company.toLowerCase().includes(companyName.toLowerCase()) ||
    companyName.toLowerCase().includes(exp.company.toLowerCase())
  );
  return experience?.slug || null;
}
