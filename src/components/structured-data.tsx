'use client';

import { getProfile, getAllProjects, getAllExperiences } from '@/lib/data';
import { useEffect } from 'react';

export function StructuredData() {
  useEffect(() => {
    // Wait for DOM to be ready
    if (typeof window === 'undefined') return;
    
    const profile = getProfile();
    const projects = getAllProjects();
    const experiences = getAllExperiences();

    // Person Schema - Main profile information
    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": profile.name,
      "jobTitle": profile.title,
      "description": profile.bio,
      "url": profile.website,
      "image": `${profile.website}/images/profile.jpg`,
      "email": profile.email,
      "telephone": profile.phone,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": profile.location,
        "addressCountry": "UZ"
      },
      "sameAs": [
        profile.github,
        profile.linkedin,
        profile.twitter,
        profile.instagram
      ],
      "knowsAbout": [
        ...profile.skills.cloud,
        ...profile.skills.containers,
        ...profile.skills.infrastructure,
        ...profile.skills.cicd,
        ...profile.skills.monitoring,
        ...profile.skills.tools,
        "DevOps",
        "Cloud Infrastructure",
        "Automation",
        "CI/CD",
        "Container Orchestration"
      ],
      "alumniOf": profile.education.map(edu => ({
        "@type": "EducationalOrganization",
        "name": edu.institution,
        "description": edu.degree
      })),
      "worksFor": experiences
        .filter(exp => exp.isCurrent)
        .map(exp => ({
          "@type": "Organization",
          "name": exp.company,
          "url": exp.website,
          "jobTitle": exp.position
        })),
      "hasOccupation": {
        "@type": "Occupation",
        "occupationLocation": {
          "@type": "City",
          "name": profile.location
        },
        "skills": [
          ...profile.skills.cloud,
          ...profile.skills.containers,
          ...profile.skills.infrastructure,
          ...profile.skills.cicd,
          ...profile.skills.monitoring,
          ...profile.skills.tools
        ]
      }
    };

    // ProfessionalService Schema - Portfolio/Service offering
    const professionalServiceSchema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": `${profile.name} - ${profile.title}`,
      "description": profile.bio,
      "url": profile.website,
      "provider": {
        "@type": "Person",
        "name": profile.name,
        "email": profile.email,
        "telephone": profile.phone
      },
      "areaServed": {
        "@type": "Country",
        "name": "Worldwide"
      },
      "serviceType": [
        "DevOps Engineering",
        "Cloud Infrastructure",
        "CI/CD Pipeline Development",
        "Infrastructure Automation",
        "Container Orchestration",
        "Cloud Migration",
        "System Monitoring & Observability"
      ],
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "priceCurrency": "USD"
      }
    };

    // WebSite Schema - For the portfolio website
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "shaxa.dev",
      "url": profile.website,
      "description": `Portfolio website of ${profile.name}, ${profile.title}`,
      "author": {
        "@type": "Person",
        "name": profile.name
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${profile.website}/?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };

    // BreadcrumbList Schema for main pages
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": profile.website
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "About",
          "item": `${profile.website}/about`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Projects",
          "item": `${profile.website}/projects`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Contact",
          "item": `${profile.website}/contact`
        }
      ]
    };

    // PortfolioItem Schema for projects
    const portfolioItemsSchema = projects.map((project, index) => ({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": `${profile.website}/projects/${project.slug || project.title.toLowerCase().replace(/\s+/g, '-')}`,
      "name": project.title,
      "description": project.fullDescription || project.shortDescription,
      "url": `${profile.website}/projects/${project.slug || project.title.toLowerCase().replace(/\s+/g, '-')}`,
      "creator": {
        "@type": "Person",
        "name": profile.name
      },
      "dateCreated": project.year,
      "keywords": project.technologies.join(", "),
      "image": project.coverImage ? `${profile.website}${project.coverImage}` : undefined
    }));

    // Combine all schemas
    const allSchemas = [
      personSchema,
      professionalServiceSchema,
      websiteSchema,
      breadcrumbSchema,
      ...portfolioItemsSchema
    ];

    // Remove existing structured data scripts (only our own)
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"][id^="structured-data-"]');
    existingScripts.forEach(script => script.remove());

    // Add all schemas to the page
    allSchemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = `structured-data-${index}`;
      script.text = JSON.stringify(schema, null, 2);
      script.setAttribute('data-portfolio', 'true');
      document.head.appendChild(script);
    });

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"][data-portfolio="true"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return null;
}

