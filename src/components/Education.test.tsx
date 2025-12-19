import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Education } from './Education';
import * as usePortfolioConfigModule from '@/hooks/usePortfolioConfig';

jest.mock('lucide-react', () => ({
  GraduationCap: () => <div data-testid="graduation-cap-icon">GraduationCap</div>,
  Award: () => <div data-testid="award-icon">Award</div>,
  ExternalLink: () => <div data-testid="external-link-icon">ExternalLink</div>,
}));

const mockConfig = {
  hero: { name: 'John Doe', title: 'Developer' },
  navigation: [],
  skills: [],
  experience: [],
  projects: [],
  education: {
    degrees: [
      {
        degree: 'Bachelor of Science in Computer Science',
        type: 'Bachelor',
        institution: 'University of California',
        period: '2015 - 2019',
      },
    ],
    certifications: [
      {
        title: 'AWS Solutions Architect',
        provider: 'Amazon Web Services',
        date: 'Dec 2023',
        link: 'https://aws.amazon.com/certification',
      },
    ],
  },
  blogs: { featured: [], all: [] },
  contact: { heading: 'Contact', description: '', info: [], social: [], ctaText: '', ctaLink: '' },
  footer: { copyrightYear: 2024, socialLinks: [] },
};

describe('Education', () => {
  beforeEach(() => {
    jest.spyOn(usePortfolioConfigModule, 'usePortfolioConfig').mockReturnValue({
      config: mockConfig,
      loading: false,
      error: '',
    } as unknown as ReturnType<typeof usePortfolioConfigModule.usePortfolioConfig>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render education section heading', () => {
    render(<Education />);
    expect(screen.getByText('Education & Certifications')).toBeInTheDocument();
  });

  it('should render education description', () => {
    render(<Education />);
    expect(screen.getByText(/Continuous learning/i)).toBeInTheDocument();
  });

  it('should render all degrees', () => {
    render(<Education />);
    expect(screen.getByText(/Bachelor of Science/i)).toBeInTheDocument();
  });

  it('should render degree types', () => {
    render(<Education />);
    expect(screen.getByText('Bachelor')).toBeInTheDocument();
  });

  it('should render degree institutions', () => {
    render(<Education />);
    expect(screen.getByText('University of California')).toBeInTheDocument();
  });

  it('should render all certifications', () => {
    render(<Education />);
    expect(screen.getByText('AWS Solutions Architect')).toBeInTheDocument();
  });

  it('should render certification providers', () => {
    render(<Education />);
    expect(screen.getByText(/Amazon Web Services/)).toBeInTheDocument();
  });

  it('should render graduation cap icon', () => {
    render(<Education />);
    expect(screen.getByTestId('graduation-cap-icon')).toBeInTheDocument();
  });

  it('should render award icon', () => {
    render(<Education />);
    expect(screen.getByTestId('award-icon')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    jest.spyOn(usePortfolioConfigModule, 'usePortfolioConfig').mockReturnValue({
      config: null,
      loading: true,
      error: '',
    } as unknown as ReturnType<typeof usePortfolioConfigModule.usePortfolioConfig>);
    const { container } = render(<Education />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('should render nothing when not loading', () => {
    jest.spyOn(usePortfolioConfigModule, 'usePortfolioConfig').mockReturnValue({
      config: null,
      loading: false,
      error: '',
    } as unknown as ReturnType<typeof usePortfolioConfigModule.usePortfolioConfig>);
    const { container } = render(<Education />);
    expect(container.querySelector('section')).not.toBeInTheDocument();
  });
});
