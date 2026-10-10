'use client';

import { useMessages, useTranslations } from 'next-intl';
import { getAllExperiences, getAllProjects, getProfile, localizeExperiences, localizeProjects, stackRows } from '@/lib/data';
import { useEffect } from 'react';

export function StructuredData() {
  const messages = useMessages();
  const tProfile = useTranslations('profile');
  const bio = tProfile('bio');

  useEffect(() => {
    // Wait for DOM to be ready
    if (typeof window === 'undefined') return;
    
    const profile = getProfile();
    const projects = localizeProjects(getAllProjects(), messages);
    const experiences = localizeExperiences(getAllExperiences(), messages);
    const skills = stackRows.flatMap((row) => profile.stack[row]);
    
    // Get current domain
    const currentDomain = window.location.origin;
    const primaryDomain = process.env.NEXT_PUBLIC_PRIMARY_DOMAIN || 'https://shaxa.dev';

    // Person Schema - Main profile information
    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": profile.name,
      "jobTitle": profile.title,
      "description": bio,
      "url": primaryDomain,
      "image": `${primaryDomain}/images/profile.jpg`,
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
        ...skills,
        "DevOps",
        "Cloud infrastructure",
        "CI/CD",
        "Observability"
      ],
      "alumniOf": profile.education.map(edu => ({
        "@type": "EducationalOrganization",
        "name": edu.institution,
        "description": edu.degree
      })),
      "hasCredential": profile.certifications.map(certification => ({
        "@type": "EducationalOccupationalCredential",
        "name": certification.title,
        "url": certification.url,
        "credentialCategory": "certificate",
        "recognizedBy": {
          "@type": "Organization",
          "name": certification.issuer
        }
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
        "skills": skills
      }
    };

    // ProfessionalService Schema - Portfolio/Service offering
    const professionalServiceSchema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": `${profile.name} - ${profile.title}`,
      "description": bio,
      "url": primaryDomain,
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
    const siteName = currentDomain.includes('shaxriyor.com') ? 'shaxriyor.com' : 'shaxa.dev';
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": siteName,
      "url": primaryDomain,
      "description": `Portfolio website of ${profile.name}, ${profile.title}`,
      "author": {
        "@type": "Person",
        "name": profile.name
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${primaryDomain}/?q={search_term_string}`
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
          "item": primaryDomain
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "About",
          "item": `${primaryDomain}/about`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Projects",
          "item": `${primaryDomain}/projects`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Contact",
          "item": `${primaryDomain}/contact`
        }
      ]
    };

    // PortfolioItem Schema for projects
    const portfolioItemsSchema = projects.map((project) => ({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": `${primaryDomain}/projects/${project.slug}`,
      "name": project.title,
      "description": project.summary,
      "url": `${primaryDomain}/projects/${project.slug}`,
      "creator": {
        "@type": "Person",
        "name": profile.name
      },
      "dateCreated": project.year,
      "keywords": project.technologies.join(", "),
      "image": project.coverImage ? `${primaryDomain}${project.coverImage}` : undefined
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
  }, [messages, bio]);

  return null;
}

