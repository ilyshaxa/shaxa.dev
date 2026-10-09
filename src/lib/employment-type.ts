import type { Experience } from '@/lib/data';

/** Maps Experience.employmentType to its key under `about.employmentTypes` in messages/*.json. */
export const employmentTypeKeys = {
  'Full-time': 'fullTime',
  'Part-time': 'partTime',
  Contract: 'contract',
  Freelance: 'freelance',
  Internship: 'internship',
} as const satisfies Record<Experience['employmentType'], string>;
