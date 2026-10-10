// Language-neutral facts. All copy (titles, summaries, bullet points, durations, personal-project labels) lives in
// messages/*.json under data.projects.<slug>, data.experiences.<slug> and data.education.<slug>;
// localizeProjects / localizeExperiences / localizeEducation merge it in.

export const stackRows = ['cloud', 'containers', 'cicd', 'observability', 'systems', 'data', 'scripting'] as const;
export type StackRow = (typeof stackRows)[number];

export interface ExperienceBase {
  slug: string;
  company: string;
  website?: string;
  logo?: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  technologies: string[];
}

/** Copy comes from messages; a locale missing the entry yields '' (data.test.ts fails on that). */
export interface Experience extends ExperienceBase {
  position: string;
  duration: string;
  summary: string;
  points: string[];
}

export interface Education {
  slug: string;
  institution: string;
  degree: string;
  year: string;
  logo?: string;
  logoLight?: string;
  logoDark?: string;
  website?: string;
}

export interface Language {
  name: 'Uzbek' | 'English' | 'Russian';
  level: 'native' | 'advanced' | 'basic';
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
  stack: Record<StackRow, string[]>;
  experience: ExperienceBase[];
  education: Education[];
  languages: Language[];
}

export interface ProjectBase {
  slug: string;
  technologies: string[];
  /** Four key technologies shown on the project tile. */
  highlights: string[];
  coverImage: string;
  coverImageLight?: string;
  expandedImage?: string;
  expandedImageLight?: string;
  expandedVideo?: string;
  expandedVideoLight?: string;
  isVideo?: boolean;
  liveUrl?: string;
  featured: boolean;
  /** Untranslated key ('Completed'); the label comes from projects.status.* in messages. */
  status: string;
  year: string;
}

/** Copy comes from messages; a locale missing the entry yields '' and [] (data.test.ts fails on that). */
export interface Project extends ProjectBase {
  title: string;
  summary: string;
  outcome?: string;
  points: string[];
  companyName?: string;
}

const profileData: Profile = {
  name: 'Shaxriyor Jabborov',
  title: 'DevOps Engineer',
  location: 'Tashkent, Uzbekistan',
  email: 'shaxriyor@shaxa.dev',
  phone: '+998 93 766 50 10',
  website: 'https://shaxa.dev',
  github: 'https://github.com/ilyshaxa',
  linkedin: 'https://linkedin.com/in/shaxriyor',
  twitter: 'https://x.com/ilyshaxa',
  instagram: 'https://instagram.com/ilyshaxa',
  stack: {
    cloud: ['AWS', 'GCP'],
    containers: ['Docker'],
    cicd: ['Jenkins', 'GitLab CI', 'GitHub Actions'],
    observability: ['Prometheus', 'Grafana', 'Loki', 'Alertmanager', 'ELK', 'Datadog', 'Sentry'],
    systems: ['Linux', 'Nginx', 'Tomcat', 'Vault', 'Networking', 'Load balancing', 'DNS'],
    data: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Kafka', 'RabbitMQ', 'Solr'],
    scripting: ['Python', 'Bash'],
  },
  experience: [
    {
      slug: 'kpi-com-devops-engineer',
      company: 'KPI',
      website: 'https://kpi.com',
      logo: '/images/companies/kpi-logo.png',
      employmentType: 'Full-time',
      startDate: '2023-05-01',
      isCurrent: true,
      technologies: [
        'AWS', 'GCP', 'Docker', 'Linux', 'Jenkins', 'GitLab CI', 'Git', 'Python', 'Bash', 'Sentry', 'Prometheus', 'Grafana',
        'Loki', 'Alertmanager', 'Tomcat', 'Nginx', 'Solr', 'Kafka', 'RabbitMQ', 'Redis', 'MongoDB', 'PostgreSQL',
      ],
    },
    {
      slug: 'praaktisgo-devops-engineer',
      company: 'PraaktisGo',
      website: 'https://praaktisgo.com',
      logo: '/images/companies/praaktisgo-logo.png',
      employmentType: 'Part-time',
      startDate: '2025-01-01',
      endDate: '2026-07-01',
      isCurrent: false,
      technologies: [
        'AWS', 'GCP', 'Docker', 'Linux', 'Jenkins', 'Git', 'Python', 'Bash', 'Prometheus', 'Grafana', 'Alertmanager', 'Tomcat',
        'Nginx', 'Solr', 'Kafka', 'RabbitMQ', 'Redis', 'MongoDB', 'PostgreSQL',
      ],
    },
    {
      slug: 'datasite-technology-frontend-developer',
      company: 'DataSite Technology',
      website: 'https://dst.uz/',
      logo: '/images/companies/datasite-logo.png',
      employmentType: 'Internship',
      startDate: '2022-09-01',
      endDate: '2023-05-01',
      isCurrent: false,
      technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Figma'],
    },
  ],
  education: [
    {
      slug: 'tsue-economics',
      institution: 'Tashkent State University of Economics',
      degree: "Bachelor's degree in economics",
      year: '2022 – 2027',
      logo: '/images/education/tsue-light.png',
      logoLight: '/images/education/tsue-light.png',
      logoDark: '/images/education/tsue-dark.png',
      website: 'https://tsue.uz',
    },
  ],
  languages: [
    { name: 'Uzbek', level: 'native' },
    { name: 'English', level: 'advanced' },
    { name: 'Russian', level: 'basic' },
  ],
};

const projectList: ProjectBase[] = [
  {
    slug: 'jenkins-cicd-pipeline',
    technologies: [
      'Jenkins', 'AWS EC2', 'AWS S3', 'AWS CodeDeploy', 'AWS IAM', 'AWS CLI', 'Git', 'Bash', 'Telegram API', 'Prometheus',
      'Node Exporter', 'Ant',
    ],
    highlights: ['Jenkins', 'AWS CodeDeploy', 'S3', 'Prometheus'],
    coverImage: '/projects/praaktisgo-jenkins-ci-cd-dark.svg',
    coverImageLight: '/projects/praaktisgo-jenkins-ci-cd-light.svg',
    expandedImage: '/projects/praaktisgo-jenkins-ci-cd-dark.svg',
    expandedImageLight: '/projects/praaktisgo-jenkins-ci-cd-light.svg',
    featured: true,
    status: 'Completed',
    year: '2025',
  },
  {
    slug: 'hikcentral-remote-device-integration',
    technologies: [
      'Hikvision Devices', 'ISUP 5.0 Protocol', 'ISUP over TCP', 'TCP/IP', 'TLS', 'HTTPS', 'NAT', 'Firewall', 'NTP', 'DNS',
      'Hikvision Firmware', 'HikGateway (Device Gateway)', 'HikGateway ISUP Service', 'HikGateway ISAPI API', 'REST API', 'JSON',
      'API Tokens & Authentication', 'Google Cloud Platform (GCP)', 'Compute Engine', 'Linux Server',
    ],
    highlights: ['ISUP 5.0', 'HikGateway', 'ISAPI', 'TLS'],
    coverImage: '/projects/hikcentral-remote-device-integration.svg',
    coverImageLight: '/projects/hikcentral-remote-device-integration.svg',
    expandedImage: '/projects/hikcentral-remote-device-integration.svg',
    expandedImageLight: '/projects/hikcentral-remote-device-integration.svg',
    featured: true,
    status: 'Completed',
    year: '2025',
  },
  {
    slug: 'comprehensive-monitoring-stack',
    technologies: [
      'Grafana', 'Prometheus', 'Loki', 'Node Exporter', 'JMX Exporter', 'Custom Exporter', 'cAdvisor', 'Promtail',
      'Alertmanager', 'Telegram API', 'PostgreSQL', 'Docker', 'Linux',
    ],
    highlights: ['Prometheus', 'Grafana', 'Loki', 'Alertmanager'],
    coverImage: '/projects/kpi-monitoring-stack-dark.svg',
    coverImageLight: '/projects/kpi-monitoring-stack-light.svg',
    expandedImage: '/projects/kpi-monitoring-stack-dark.svg',
    expandedImageLight: '/projects/kpi-monitoring-stack-light.svg',
    featured: true,
    status: 'Completed',
    year: '2023',
  },
  {
    slug: 'savethis4me-telegram-bot',
    technologies: [
      'Python', 'python-telegram-bot', 'FastAPI', 'PostgreSQL', 'yt-dlp', 'gallery-dl', 'FFmpeg', 'Meta Webhooks', 'Docker',
      'Linux', 'Git',
    ],
    highlights: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    coverImage: '/projects/ST4M-Transparent-Logo.svg',
    coverImageLight: '/projects/ST4M-Transparent-Logo.svg',
    expandedImage: '/projects/ST4M-Transparent-Logo.svg',
    expandedImageLight: '/projects/ST4M-Transparent-Logo.svg',
    expandedVideo: '/projects/savethis4me-demo.mp4',
    expandedVideoLight: '/projects/savethis4me-demo.mp4',
    isVideo: true,
    liveUrl: 'https://t.me/SaveThis4Me_Bot',
    featured: false,
    status: 'Completed',
    year: '2024',
  },
];

export function getProfile(): Profile {
  return profileData;
}

export function getAllProjects(): ProjectBase[] {
  return projectList;
}

export function getAllExperiences(): ExperienceBase[] {
  return profileData.experience;
}

export function getExperienceSlugByCompany(companyName: string): string | null {
  const name = companyName.toLowerCase();
  const match = getAllExperiences().find((exp) => {
    const company = exp.company.toLowerCase();
    return company === name || company.includes(name) || name.includes(company);
  });
  return match?.slug ?? null;
}

type MessageTree = Record<string, unknown>;

const text = (value: unknown): string => (typeof value === 'string' ? value : '');
const list = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.length > 0) : [];

function dataSection(translations: MessageTree, section: 'projects' | 'experiences' | 'education'): Record<string, MessageTree> {
  const data = translations?.data as Record<string, Record<string, MessageTree>> | undefined;
  return data?.[section] ?? {};
}

export function localizeProjects(projects: ProjectBase[], translations: MessageTree): Project[] {
  const copy = dataSection(translations, 'projects');
  return projects.map((project) => {
    const entry = copy[project.slug] ?? {};
    return {
      ...project,
      title: text(entry.title),
      summary: text(entry.summary),
      outcome: text(entry.outcome) || undefined,
      points: list(entry.points),
      companyName: text(entry.companyName) || undefined,
    };
  });
}

export function localizeExperiences(experiences: ExperienceBase[], translations: MessageTree): Experience[] {
  const copy = dataSection(translations, 'experiences');
  return experiences.map((experience) => {
    const entry = copy[experience.slug] ?? {};
    return {
      ...experience,
      position: text(entry.position),
      duration: text(entry.duration),
      summary: text(entry.summary),
      points: list(entry.points),
    };
  });
}

export function localizeEducation(education: Education[], translations: MessageTree): Education[] {
  const copy = dataSection(translations, 'education');
  return education.map((edu) => {
    const entry = copy[edu.slug] ?? {};
    return { ...edu, institution: text(entry.institution) || edu.institution, degree: text(entry.degree) || edu.degree };
  });
}
