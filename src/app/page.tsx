'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Experience {
  company: string;
  position: string;
  duration: string;
  isCurrent: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
}

interface Project {
  title: string;
  shortDescription: string;
  technologies: string[];
  status: string;
  year: string;
  liveUrl?: string;
  githubUrl?: string;
}

const profile = {
  name: "SHAXRIYOR JABBOROV",
  title: "DevOps Engineer",
  location: "Tashkent, UZ",
  email: "shaxriyor@shaxa.dev",
  github: "https://github.com/ilyshaxa",
  linkedin: "https://linkedin.com/in/shaxriyor",
  twitter: "https://twitter.com/ilyshaxa",
  bio: "DevOps engineer specializing in cloud infrastructure, automation, and scalable system design. Expert in solving infrastructure challenges and building reliable deployment pipelines.",
  skills: {
    "cloud": ["AWS", "Azure", "GCP", "DigitalOcean"],
    "containers": ["Docker", "Kubernetes", "Helm", "Podman"],
    "iac": ["Terraform", "Ansible", "CloudFormation", "Pulumi"],
    "cicd": ["Jenkins", "GitLab CI", "GitHub Actions", "ArgoCD"],
    "monitoring": ["Prometheus", "Grafana", "Loki", "ELK"],
    "database": ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"],
    "tools": ["Linux", "Bash", "Python", "Git", "Nginx"],
  },
  experience: [
    {
      company: "KPI",
      position: "DevOps Engineer",
      duration: "May 2023 - Present",
      isCurrent: true,
      description: "Design, automate, and optimize systems to ensure performance and reliability.",
      achievements: [
        "Reduced AWS costs by 20% via Savings Plans and right-sizing",
        "Improved system visibility 40% with Prometheus/Grafana stack",
        "Cut deployment times 50% with parallelized Jenkins builds",
        "Improved incident response time by 60%",
      ],
      technologies: ["AWS", "Docker", "Jenkins", "Prometheus", "Grafana", "Python"],
    },
    {
      company: "PraaktisGo",
      position: "DevOps Engineer (Freelance)",
      duration: "Jan 2025 - Present",
      isCurrent: true,
      description: "Cloud infrastructure and deployment workflows for scalable systems.",
      achievements: [
        "Migrated AWS infra with zero downtime",
        "Secured $100K GCP + $10K AWS credits",
        "Achieved 99.9% system uptime",
        "Reduced deployment time by 50%",
      ],
      technologies: ["AWS", "GCP", "Jenkins", "Terraform", "Docker"],
    },
    {
      company: "DataSite Technology",
      position: "Frontend Developer",
      duration: "Sep 2022 - May 2023",
      isCurrent: false,
      description: "Frontend development with React and modern tooling.",
      achievements: [
        "Built React components for internal projects",
        "Improved page load performance by 30%",
      ],
      technologies: ["React", "JavaScript", "Tailwind CSS", "Git"],
    },
  ] as Experience[],
  projects: [
    {
      title: "Jenkins CI/CD Pipeline",
      shortDescription: "Automated CI/CD pipeline using Jenkins, AWS, and Prometheus for seamless deployments.",
      technologies: ["Jenkins", "AWS", "Prometheus", "CodeDeploy"],
      status: "Completed",
      year: "2024",
    },
    {
      title: "HikGateway Integration",
      shortDescription: "Secure remote device integration platform for Hikvision devices via HikGateway.",
      technologies: ["Python", "Docker", "Nginx", "HTTPS"],
      status: "Completed",
      year: "2024",
    },
    {
      title: "Monitoring Stack",
      shortDescription: "Full observability with Grafana, Prometheus, Loki, and Alertmanager.",
      technologies: ["Prometheus", "Grafana", "Loki", "Alertmanager"],
      status: "Completed",
      year: "2024",
    },
    {
      title: "SaveThis4Me Bot",
      shortDescription: "Telegram bot for saving Instagram content with secure account binding.",
      technologies: ["Python", "FastAPI", "PostgreSQL", "Docker"],
      status: "Discontinued",
      year: "2024",
      githubUrl: "https://github.com/ilyshaxa/savethis4me",
    },
  ] as Project[],
};

// Typing animation hook
function useTypedText(text: string, speed = 30, delay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      setDone(true);
    }
  }, [displayed, text, speed, started]);

  return { displayed, done };
}

// Blinking cursor component
function Cursor() {
  return <span className="inline-block w-[0.6em] h-[1.15em] bg-primary animate-blink align-middle" />;
}

// Section with prompt
function Section({ command, children, delay = 0, id }: { command: string; children: React.ReactNode; delay?: number; id?: string }) {
  const { displayed, done } = useTypedText(command, 25, delay);

  return (
    <div className="mb-8" id={id}>
      <div className="text-sm mb-3">
        <span className="text-secondary">user</span>
        <span className="text-muted-foreground">@</span>
        <span className="text-secondary">shaxa.dev</span>
        <span className="text-muted-foreground">:</span>
        <span className="text-primary">~</span>
        <span className="text-muted-foreground">$ </span>
        <span>{displayed}</span>
        {!done && <Cursor />}
      </div>
      {done && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="pl-2 border-l-2 border-border ml-1"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

// Status badge
function Status({ type }: { type: 'active' | 'completed' | 'discontinued' }) {
  const config = {
    active: { text: 'ACTIVE', className: 'text-primary' },
    completed: { text: 'DONE', className: 'text-secondary' },
    discontinued: { text: 'END', className: 'text-muted-foreground' },
  };
  const c = config[type];
  return <span className={`text-xs font-bold ${c.className}`}>[{c.text}]</span>;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      {/* Main terminal content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-20">

        {/* neofetch */}
        <Section command="neofetch" delay={200} id="about">
          <div className="space-y-1 text-sm">
            <div className="text-xl sm:text-2xl font-bold terminal-glow mb-3">{profile.name}</div>
            <div className="text-muted-foreground">{profile.title}</div>
            <div className="text-muted-foreground">{profile.location}</div>
            <div className="mt-3">
              <span className="text-muted-foreground">Uptime: </span>
              <span>4+ years in DevOps</span>
            </div>
            <div>
              <span className="text-muted-foreground">Shell: </span>
              <span>bash/zsh</span>
            </div>
            <div>
              <span className="text-muted-foreground">Packages: </span>
              <span className="text-primary">{Object.values(profile.skills).flat().length} tools installed</span>
            </div>
            <div className="mt-2 text-muted-foreground max-w-lg leading-relaxed">
              {profile.bio}
            </div>
          </div>
        </Section>

        {/* skills */}
        <Section command="cat skills.txt" delay={100} id="skills">
          <div className="space-y-3 text-sm">
            {Object.entries(profile.skills).map(([category, skills]) => (
              <div key={category} className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span className="text-secondary w-28 shrink-0 uppercase text-xs tracking-wider">[{category}]</span>
                <span className="text-muted-foreground">{skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* experience */}
        <Section command="history --experience" delay={100} id="experience">
          <div className="space-y-4 text-sm">
            {profile.experience.map((exp, i) => (
              <div key={i} className="border border-border p-3">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-bold">{exp.position}</span>
                  <span className="text-muted-foreground">@</span>
                  <span className="text-secondary">{exp.company}</span>
                  <Status type={exp.isCurrent ? 'active' : 'completed'} />
                </div>
                <div className="text-xs text-muted-foreground mb-2">{exp.duration}</div>
                <p className="text-muted-foreground text-xs mb-2">{exp.description}</p>
                {exp.achievements.length > 0 && (
                  <div className="space-y-1 mb-2">
                    {exp.achievements.map((a, j) => (
                      <div key={j} className="flex gap-2 text-xs">
                        <span className="text-primary shrink-0">*</span>
                        <span className="text-muted-foreground">{a}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.map((t, j) => (
                    <span key={j} className="text-xs px-1.5 py-0.5 border border-border text-muted-foreground">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* projects */}
        <Section command="ls -la ~/projects/" delay={100} id="projects">
          <div className="space-y-3 text-sm">
            {profile.projects.map((project, i) => (
              <div key={i} className="border border-border p-3">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-bold">{project.title}</span>
                  <Status type={
                    project.status === 'Completed' ? 'completed' :
                    project.status === 'Discontinued' ? 'discontinued' : 'active'
                  } />
                  <span className="text-xs text-muted-foreground">{project.year}</span>
                </div>
                <p className="text-muted-foreground text-xs mb-2">{project.shortDescription}</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((t, j) => (
                    <span key={j} className="text-xs px-1.5 py-0.5 border border-border text-muted-foreground">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* contact */}
        <Section command="cat contact.txt" delay={100} id="contact">
          <div className="space-y-1.5 text-sm">
            <div className="flex gap-2">
              <span className="text-secondary w-20 shrink-0">Email:</span>
              <a href={`mailto:${profile.email}`} className="text-primary hover:underline">{profile.email}</a>
            </div>
            <div className="flex gap-2">
              <span className="text-secondary w-20 shrink-0">GitHub:</span>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{profile.github.replace('https://', '')}</a>
            </div>
            <div className="flex gap-2">
              <span className="text-secondary w-20 shrink-0">LinkedIn:</span>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{profile.linkedin.replace('https://', '')}</a>
            </div>
            <div className="flex gap-2">
              <span className="text-secondary w-20 shrink-0">Twitter:</span>
              <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{profile.twitter.replace('https://', '')}</a>
            </div>
          </div>
        </Section>

        {/* CV download */}
        <Section command="cat cv.pdf --output=download" delay={100}>
          <div className="text-sm">
            <a
              href="/cv/shaxriyor-jabborov-cv-en.pdf"
              download
              className="inline-block border border-border px-4 py-2 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              [ DOWNLOAD CV ]
            </a>
          </div>
        </Section>

        {/* Final blinking prompt */}
        <div className="text-sm mt-12">
          <span className="text-secondary">user</span>
          <span className="text-muted-foreground">@</span>
          <span className="text-secondary">shaxa.dev</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-primary">~</span>
          <span className="text-muted-foreground">$ </span>
          <Cursor />
        </div>

      </div>

      {/* tmux-style bottom status bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground text-xs font-mono z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between h-7">
          <div className="flex items-center gap-1">
            <span className="font-bold">shaxa.dev</span>
            <span className="opacity-50">|</span>
            <a href="#about" className="hover:underline px-1 opacity-70 hover:opacity-100">about</a>
            <a href="#skills" className="hover:underline px-1 opacity-70 hover:opacity-100">skills</a>
            <a href="#experience" className="hover:underline px-1 opacity-70 hover:opacity-100">exp</a>
            <a href="#projects" className="hover:underline px-1 opacity-70 hover:opacity-100">projects</a>
            <a href="#contact" className="hover:underline px-1 opacity-70 hover:opacity-100">contact</a>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal theme toggle
function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    if (next === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    }
  };

  return (
    <button
      onClick={toggle}
      className="opacity-70 hover:opacity-100 transition-opacity"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      [{theme === 'dark' ? 'DARK' : 'LIGHT'}]
    </button>
  );
}
