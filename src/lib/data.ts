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
    database: string[];
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
    database: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "DynamoDB"],
    tools: ["Git", "Linux", "Bash", "Python", "YAML", "JSON"]
  },
  experience: [
    {
      company: "KPI",
      position: "DevOps Engineer",
      duration: "May 2023 - Present",
      description: "Design, automate, and optimize systems to ensure performance and reliability.",
      website: "https://kpi.com",
      employmentType: "Full-time",
      logo: "/images/companies/kpi-logo.png",
      slug: "kpi-com-devops-engineer",
      startDate: "2023-05-01",
      isCurrent: true,
      location: "On-site",
      responsibilities: [
        "Maintained, optimized, and secured cloud infrastructure on AWS to ensure scalability and high availability",
        "Managed and deployed containerized applications using Docker across multiple environments",
        "Automated CI/CD pipelines with Jenkins to streamline integration, testing, and deployment processes",
        "Monitored system performance, identified bottlenecks, and implemented solutions to improve reliability",
        "Collaborated closely with development teams to design efficient deployment workflows and improve release velocity",
        "Ensured infrastructure compliance with security and cost optimization best practices"
      ],
      achievements: [
        "Reduced monthly AWS costs by 20% through strategic adoption of Savings Plans and resource right-sizing",
        "Implemented a modern monitoring stack with Prometheus and Grafana, improving system visibility and reliability metrics by 40%",
        "Upgraded legacy GitLab Omnibus to the latest stable version, strengthening CI/CD security and improving performance by 30%",
        "Cut deployment times by 50% using parallelized Jenkins builds and optimized AWS instance configurations",
        "Developed a Python CLI tool to automate database schema synchronization across dev, staging, and production environments, reducing manual work and human error",
        "Developed a custom Prometheus exporter to surface key business metrics in Grafana dashboards for data-driven decision-making",
        "Improved incident response time by 60% through proactive alerting and centralized log aggregation"
      ],
      technologies: ["AWS", "GCP", "Docker", "Linux", "Jenkins", "Gitlab CI", "Git", "Python", "Bash", "Sentry", "Prometheus", "Grafana", "Loki", "Alertmanager", "Tomcat", "Nginx", "Solr", "Kafka", "RabbitMQ", "Redis", "MongoDB", "PostgreSQL"],
      teamSize: "50+",
      industry: "Software & IT Services"
    },
    {
      company: "PraaktisGo",
      position: "DevOps Engineer",
      duration: "January 2025 - Present",
      description: "Design, automate, and optimize cloud infrastructure and deployment workflows for scalable, reliable systems.",
      website: "https://praaktisgo.com",
      employmentType: "Freelance",
      logo: "/images/companies/praaktisgo-logo.png",
      slug: "praaktisgo-devops-engineer",
      startDate: "2025-01-01",
      isCurrent: true,
      location: "Remote",
      responsibilities: [
        "Led the migration of existing AWS cloud infrastructure to a new AWS account and region, ensuring scalability, security, and cost-efficiency",
        "Designed and maintained CI/CD pipelines with Jenkins to automate testing, integration, and deployment workflows",
        "Implemented end-to-end monitoring and alerting solutions to ensure system reliability, availability, and performance visibility",
        "Collaborated closely with development teams to streamline build, release, and automation processes",
        "Optimized cloud infrastructure costs and enforced security best practices across environments",
        "Documented architecture, deployment processes, and operational guidelines to improve team efficiency and continuity"
      ],      
      achievements: [
        "Completed AWS infrastructure migration with zero downtime and no data loss",
        "Secured $100K in Google Cloud credits through the 2024 GFS Cloud Program, expanding multi-cloud flexibility",
        "Received $10K in AWS Activate Portfolio credits to accelerate infrastructure growth and experimentation",
        "Awarded a 1-year free Google Workspace Business Plan, reducing operational costs by 15%",
        "Reduced deployment time by 50% through CI/CD pipeline automation and environment standardization",
        "Achieved 99.9% system uptime through proactive monitoring and incident prevention measures",
        "Implemented cross-cloud cost tracking and performance monitoring to guide future hybrid-cloud strategy"
      ],            
      technologies: ["AWS", "GCP", "Docker", "Linux", "Jenkins", "Git", "Python", "Bash", "Prometheus", "Grafana", "Alertmanager", "Tomcat", "Nginx", "Solr", "Kafka", "RabbitMQ", "Redis", "MongoDB", "PostgreSQL"],
      teamSize: "10+",
      industry: "Wellness & Fitness"
    },
    {
      company: "Zaytra",
      position: "DevOps Engineer & Tech Lead",
      duration: "July 2025 - Present",
      description: "Lead infrastructure design, automation, and team development to build and scale technical foundation.",
      website: "https://zaytra.ai",
      employmentType: "Freelance",
      logo: "/images/companies/zaytra-logo.png",
      slug: "zaytra-ai-devops-tech-lead",
      startDate: "2025-07-01",
      isCurrent: true,
      location: "Remote",
      responsibilities: [
        "Designed and implemented the entire technical infrastructure for a new startup from the ground up",
        "Set up and maintained production-ready cloud servers, CI/CD pipelines, and secure deployment workflows",
        "Built containerized environments using Docker for consistent development and production parity",
        "Configured domains, SSL certificates, and DNS to establish a professional and secure online presence",
        "Developed monitoring, logging, and alerting systems to ensure system reliability and uptime",
        "Established engineering best practices and technical documentation to support future scalability",
        "Mentored interns and junior developers, fostering a strong technical culture and guiding architectural decisions"
      ],      
      achievements: [
        "Built the startup's entire technical stack from zero to production within 8 weeks",
        "Achieved 99.9% uptime through proactive monitoring, automated alerts, and containerized deployments",
        "Optimized infrastructure to handle early user growth with minimal cost (~90% below leading cloud providers)",
        "Delivered secure, SSL-certified web services with zero downtime during key demos and investor pitches",
        "Established technical standards and documentation that enabled rapid onboarding of new engineers",
        "Led cross-functional collaboration between AI researchers, product, and operations to align technical and business goals"
      ],
      technologies: ["Linux", "Docker", "Grafana", "Prometheus", "MongoDB", "Github actions",  "PostgreSQL"],
      teamSize: "10+",
      industry: "Marketing & Advertising"
    },
    {
      company: "Retouch Garage",
      position: "DevOps Engineer",
      duration: "June 2025 - July 2025",
      description: "Deployed and implemented CI/CD for the landing page.",
      website: "https://retouchgarage.com/",
      employmentType: "Freelance",
      logo: "/images/companies/retouch-logo.png",
      slug: "retouchgarage-com-devops-engineer",
      startDate: "2025-06-01",
      endDate: "2025-07-01",
      isCurrent: false,
      location: "Remote",
      responsibilities: [
        "Mentored intern developers and promoted best practices",
        "Deployed and implemented a secure landing page to production",
        "Implemented a lead-capture workflow"
      ],    
      achievements: [
        "Successfully deployed and implemented a secure landing page to production",
        "Successfully implemented a lead-capture workflow"
      ],
      technologies: ["Git", "DNS", "SSL", "Vercel"],
      teamSize: "100-200",
      industry: "Image Editing & Retouching"
    },
    {
      company: "Izish",
      position: "DevOps Engineer",
      duration: "November 2024 - July 2025",
      description: "DevOps, automation, cloud infrastructure at izish.uz",
      website: "https://dev.izish.uz/",
      employmentType: "Contract",
      logo: "/images/companies/izish-logo.png",
      slug: "izish-uz-devops-engineer",
      startDate: "2024-11-01",
      endDate: "2025-07-01",
      isCurrent: false,
      location: "Remote",
      responsibilities: [
        "Deployed and managed production and development environments on AWS, ensuring scalable and secure infrastructure",
        "Implemented CI/CD pipelines using GitLab CI/CD to automate testing, integration, and deployment processes",
        "Migrated infrastructure from AWS to a local cloud provider to comply with national data residency and government regulations",
        "Collaborated with backend and frontend teams to streamline build and deployment workflows for faster, more reliable releases",
        "Set up comprehensive monitoring and alerting using Prometheus and Grafana to track system health and performance metrics",
        "Created detailed infrastructure and architecture documentation required for government API integration and compliance audits"
      ],    
      achievements: [
        "Successfully migrated infrastructure from AWS to a compliant local cloud provider with zero downtime",
        "Reduced deployment times and manual intervention through optimized GitLab CI/CD automation",
        "Improved system observability and response time by implementing Prometheus and Grafana monitoring dashboards",
        "Streamlined deployment workflows in collaboration with developers, improving release frequency and reducing rollback incidents",
        "Authored infrastructure documentation which was required for the approval process of government API access",
        "Established a secure, scalable deployment framework supporting continuous delivery across multiple environments"
      ],
      technologies: ["AWS", "Linux", "Docker", "GitLab CI/CD", "Prometheus", "Grafana", "PostgreSQL", "Redis", "Local Cloud Provider"],
      teamSize: "5+",
      industry: "Recruitment & HR"
    },
    {
      company: "DataSite Technology",
      position: "Frontend Developer",
      duration: "September 2022 - May 2023",
      description: "Frontend developer at DataSite Technology.",
      website: "https://dst.uz/",
      employmentType: "Internship",
      logo: "/images/companies/datasite-logo.png",
      slug: "datasite-technology-frontend-developer",
      startDate: "2022-09-01",
      endDate: "2023-05-01",
      isCurrent: false,
      location: "Remote",
      responsibilities: [
        "Learned and practiced core frontend technologies including HTML, CSS, and JavaScript",
        "Gained hands-on experience with React and Next.js by building components for internal projects",
        "Collaborated with senior developers to understand code structure, version control, and best practices using Git",
        "Assisted in styling and layout improvements using Tailwind CSS",
        "Participated in code reviews and team discussions to improve technical and collaboration skills"
      ],
      achievements: [
        "Successfully transitioned from academic learning to practical frontend development in a professional environment",
        "Built and deployed small-scale frontend features using React and JavaScript under mentorship",
        "Improved understanding of modern web development workflows, version control, and team collaboration",
        "Established a strong foundation in responsive design and clean, maintainable code practices"
      ],
      technologies: ["HTML", "CSS", "JavaScript", "React", "Git", "Figma"],
      teamSize: "100-200",
      industry: "IT services & digital marketing."
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
    // Temporarily hidden - Planned certifications (will be available in the future)
    // {
    //   name: "AWS Certified Cloud Practitioner",
    //   issuer: "Amazon Web Services",
    //   year: "2025",
    //   status: "Planned",
    //   logo: "/images/certifications/AWS-Certified-Cloud-Practitioner.png",
    //   logoLight: "/images/certifications/AWS-Certified-Cloud-Practitioner.png",
    //   logoDark: "/images/certifications/AWS-Certified-Cloud-Practitioner.png"
    // },
    // {
    //   name: "AWS Certified Solutions Architect Professional",
    //   issuer: "Amazon Web Services",
    //   year: "2026",
    //   status: "Planned",
    //   logo: "/images/certifications/AWS-Certified-Solutions-Architect-Professional.png",
    //   logoLight: "/images/certifications/AWS-Certified-Solutions-Architect-Professional.png",
    //   logoDark: "/images/certifications/AWS-Certified-Solutions-Architect-Professional.png"
    // },
    // {
    //   name: "AWS Certified DevOps Engineer Professional",
    //   issuer: "Amazon Web Services",
    //   year: "2026",
    //   status: "Planned",
    //   logo: "/images/certifications/AWS-Certified-DevOps-Engineer-Professional.png",
    //   logoLight: "/images/certifications/AWS-Certified-DevOps-Engineer-Professional.png",
    //   logoDark: "/images/certifications/AWS-Certified-DevOps-Engineer-Professional.png"
    // },
    // Temporarily hidden - Expired certification
    // {
    //   name: "English Language Certificate",
    //   issuer: "British Council",
    //   year: "2022",
    //   status: "Expired",
    //   logo: "/images/certifications/IELTS.png",
    //   logoLight: "/images/certifications/IELTS.png",
    //   logoDark: "/images/certifications/IELTS.png"
    // }
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
    },
    {
      title: "HikCentral Integration for KPI",
      shortDescription: "A secure cloud-based integration platform enabling remote connectivity between Hikvision face recognition devices and a centralized HikCentral Professional server using outbound ISUP communication.",
      fullDescription: "Developed a secure, scalable remote device integration platform allowing Hikvision face recognition devices to connect to cloud infrastructure through ISUP 5.x outbound communication. Each device establishes an encrypted connection to a HikCentral Professional instance hosted on a Google Cloud Windows Server VM, enabling reliable registration and data transfer without any inbound exposure at client sites. The architecture spans device firmware, network transport (ISUP over TCP with TLS), cloud infrastructure (GCP Compute Engine), and application services (HikCentral ISUP Gateway, Web Client, and OpenAPI). Security controls include TLS encryption, outbound-only device traffic, firewall allowlists, RBAC enforcement, and token-based API authentication. The system exposes a REST-based OpenAPI interface for seamless third-party integration over HTTPS, supporting external applications built with technologies such as Node.js, Python, and .NET.",
      technologies: [
        "Hikvision Devices",
        "ISUP 5.0 Protocol",
        "NAT",
        "NTP",
        "DNS",
        "HTTPS",
        "TCP/IP",
        "ISUP over TCP",
        "TLS/HTTPS",
        "Hikvision Firmware",
        "Firewall",
        "Google Cloud Platform (GCP)",
        "Compute Engine",
        "Windows Server VM",
        "SSL Certificates",
        "HikCentral Professional",
        "HikCentral ISUP Gateway",
        "HikCentral Web Client",
        "HikCentral Database",
        "HikCentral OpenAPI",
        "REST API",
        "JSON",
        "Node.js",
        "Python",
        ".NET",
        "TLS Encryption",
        "RBAC",
        "API Tokens & Authentication"
      ],
      coverImage: "/projects/hikcentral-remote-device-integration-dark.svg",
      coverImageLight: "/projects/hikcentral-remote-device-integration-light.svg",
      expandedImage: "/projects/hikcentral-remote-device-integration-dark.svg",
      expandedImageLight: "/projects/hikcentral-remote-device-integration-light.svg",
      liveUrl: "",
      githubUrl: "",
      featured: true,
      status: "Completed",
      year: "2025",
      companyName: "KPI",
      slug: "hikcentral-remote-device-integration-system-for-kpi"
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
