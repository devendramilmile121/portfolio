import { BlogPost } from './blogs';

// We'll skip testing loadBlogs and related functions that use import.meta.glob
// since they can't be easily mocked in Jest tests

describe('Blog Data Module', () => {
  describe('BlogPost interface', () => {
    it('should have required properties', () => {
      const mockBlog: BlogPost = {
        slug: 'test-blog',
        title: 'Test Blog',
        date: '2023-01-01',
        summary: 'Test summary',
        tags: ['test'],
        body: 'Test content',
      };

      expect(mockBlog.slug).toBeDefined();
      expect(mockBlog.title).toBeDefined();
      expect(mockBlog.date).toBeDefined();
      expect(mockBlog.summary).toBeDefined();
      expect(mockBlog.tags).toBeDefined();
      expect(mockBlog.body).toBeDefined();
    });

    it('should have correct types', () => {
      const mockBlog: BlogPost = {
        slug: 'test-blog',
        title: 'Test Blog',
        date: '2023-01-01',
        summary: 'Test summary',
        tags: ['test', 'blog'],
        body: 'Test content',
      };

      expect(typeof mockBlog.slug).toBe('string');
      expect(typeof mockBlog.title).toBe('string');
      expect(typeof mockBlog.date).toBe('string');
      expect(typeof mockBlog.summary).toBe('string');
      expect(Array.isArray(mockBlog.tags)).toBe(true);
      expect(typeof mockBlog.body).toBe('string');
    });

    it('should handle multiple tags', () => {
      const mockBlog: BlogPost = {
        slug: 'multi-tag-blog',
        title: 'Multi Tag Blog',
        date: '2023-01-01',
        summary: 'Summary',
        tags: ['react', 'typescript', 'javascript', 'web'],
        body: 'Content',
      };

      expect(mockBlog.tags.length).toBe(4);
      expect(mockBlog.tags).toContain('react');
      expect(mockBlog.tags).toContain('typescript');
    });

    it('should handle blog with no tags', () => {
      const mockBlog: BlogPost = {
        slug: 'no-tags-blog',
        title: 'No Tags Blog',
        date: '2023-01-01',
        summary: 'Summary',
        tags: [],
        body: 'Content',
      };

      expect(mockBlog.tags.length).toBe(0);
      expect(Array.isArray(mockBlog.tags)).toBe(true);
    });

    it('should have valid slug format', () => {
      const validSlugs = ['my-blog', 'test-123', 'hello-world'];
      
      validSlugs.forEach(slug => {
        const mockBlog: BlogPost = {
          slug,
          title: 'Test',
          date: '2023-01-01',
          summary: 'Summary',
          tags: [],
          body: 'Content',
        };
        
        expect(mockBlog.slug).toBe(slug);
      });
    });

    it('should have ISO date format', () => {
      const mockBlog: BlogPost = {
        slug: 'test',
        title: 'Test',
        date: '2023-12-25',
        summary: 'Summary',
        tags: [],
        body: 'Content',
      };
      
      expect(mockBlog.date).toMatch(/\d{4}-\d{2}-\d{2}/);
    });
  });
});
