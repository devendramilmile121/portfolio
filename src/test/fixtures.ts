import type { PortfolioConfig } from '@/hooks/usePortfolioConfig';
import * as usePortfolioConfigModule from '@/hooks/usePortfolioConfig';

export const mockConfig: PortfolioConfig = {
  seo: { title: 'Jane Doe - Engineer', description: 'desc', keywords: 'k' },
  blogs: { enabled: true },
  hero: {
    name: 'Jane Doe',
    role: 'Full stack engineer',
    title: 'I build *fast* things.',
    description: 'Seven years of Angular and .NET.',
    now: [
      { label: 'Day job', text: 'Replatforming a monolith' },
      { label: 'Building', text: 'A side project', link: 'https://example.com' },
    ],
    contact: { location: 'Pune, India' },
    social: [
      { name: 'github', url: 'https://github.com/jane' },
      { name: 'email', url: 'mailto:jane@example.com' },
    ],
  },
  navigation: [
    { label: 'Work', id: 'work' },
    { label: 'Writing', id: '/blogs' },
    { label: 'Contact', id: 'contact' },
  ],
  about: { bio: ['First paragraph of the bio.', 'Second paragraph.'] },
  skills: {
    description: 'What I use',
    categories: [
      { title: 'Frontend', skills: ['Angular', 'TypeScript'] },
      { title: 'Backend', skills: ['.NET Core'] },
    ],
  },
  experience: {
    description: 'Four companies since 2019.',
    jobs: [
      {
        company: 'Acme',
        role: 'Senior Engineer',
        period: 'Jan 2026 - Present',
        location: 'Pune',
        description: ['Moved a monolith to micro frontends'],
        technologies: ['Angular', '.NET'],
      },
      {
        company: 'Globex',
        role: 'Engineer',
        period: 'Nov 2024 - Dec 2025',
        location: 'Pune',
        description: ['Built a shared library'],
        technologies: [],
      },
    ],
  },
  projects: [
    {
      title: 'Samyo',
      summary: 'Booking app for event businesses',
      role: 'Founder',
      period: 'Sep 2026 - Present',
      description: 'A SaaS for event businesses.',
      highlights: ['Works offline'],
      technologies: ['Angular', '.NET'],
      type: 'SaaS',
      links: { website: 'https://samyo.in' },
      image: { src: '/projects/samyo.webp', alt: 'Samyo dashboard', width: 1600, height: 1000 },
    },
    {
      title: 'CLARIO',
      client: 'Clario',
      summary: 'Public API platform',
      period: 'Dec 2024 - Dec 2025',
      description: 'A public API on .NET 8.',
      highlights: [],
      technologies: ['.NET 8', 'YARP'],
      type: 'Enterprise',
    },
  ],
  education: {
    degrees: [{ degree: 'MCA', institution: 'RCOEM', period: 'Jun 2016 - Jun 2019', type: 'Masters' }],
    certifications: [
      { title: 'Older Cert', provider: 'Udemy', date: 'Nov 2022' },
      { title: 'Azure Fundamentals', provider: 'Microsoft', date: 'Sep 2025', link: 'https://learn.microsoft.com', featured: true },
    ],
  },
  contact: {
    heading: 'Have something in mind?',
    description: 'Email is the best way to reach me.',
    info: [
      { label: 'Email', value: 'jane@example.com', link: 'mailto:jane@example.com', icon: 'mail' },
      { label: 'Phone', value: '+91 00000', link: 'tel:+9100000', icon: 'phone' },
      { label: 'Location', value: 'Pune', icon: 'mapPin' },
    ],
    social: [{ label: 'GitHub', username: 'jane', url: 'https://github.com/jane', icon: 'github' }],
  },
  footer: {
    name: 'Jane Doe',
    title: 'Engineer',
    copyright: 'All rights reserved.',
    builtWith: 'Set in Newsreader.',
    social: [],
  },
};

export function mockPortfolioConfig(config: PortfolioConfig | null = mockConfig) {
  return jest.spyOn(usePortfolioConfigModule, 'usePortfolioConfig').mockReturnValue({
    config,
    loading: config === null,
    error: null,
  });
}
