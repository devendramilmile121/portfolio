# 🚀 Professional Portfolio Template

A modern, feature-rich portfolio template built with React, TypeScript, and Tailwind CSS. Perfect for developers, designers, and tech professionals to showcase their work and create a strong online presence.

**Live Demo:** [https://devendramilmile.com](https://devendramilmile.com)  
**Repository:** [github.com/devendramilmile121/portfolio](https://github.com/devendramilmile121/portfolio)

---

## ✨ Features

- ⚡ **Lightning-Fast** - Built with Vite for instant dev server and optimized production builds
- 🎨 **Editorial Design** - Paper-and-ink layout on a 12-column grid, with Newsreader, Inter and IBM Plex Mono
- 🌙 **Light and Dark** - Follows the system setting, with a toggle that remembers the visitor's choice
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- 🔧 **Easy Customization** - Configure everything via simple JSON config file
- 📝 **Integrated Blog** - Write and publish blog posts in Markdown
- 💬 **Comments Section** - Built-in Giscus comments for user engagement
- 🚀 **Free Hosting** - Deploy to your custom domain using GitHub Pages
- 🧪 **Production-Ready** - 100% TypeScript, Jest testing, ESLint configured
- 📊 **Pre-rendered and SEO Ready** - Every page is rendered to static HTML at build time with its own meta tags, Open Graph and structured data; `sitemap.xml` is generated from the posts (`scripts/prerender.mjs`)
- 🖼️ **Image Optimization** - Automatic image optimization for better performance
- ✅ **Test Coverage** - Unit tests for all components

---

## 🎯 Perfect For

- Developers showcasing their projects and skills
- Freelancers building their professional brand
- Tech professionals managing their online presence
- Anyone wanting a modern portfolio without complexity

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn installed
- A GitHub account (for deployment)
- A custom domain (optional but recommended)

### 1. Fork or Clone the Repository

```bash
# Clone the repository
git clone https://github.com/devendramilmile121/portfolio.git

# Navigate to the project
cd portfolio

# Install dependencies
npm install
```

### 2. Customize Your Portfolio

Edit `public/config/portfolio.json` to personalize your portfolio:

```json
{
  "hero": {
    "name": "Your Name",
    "title": "Your Professional Title",
    "description": "Brief description about yourself",
    "contact": {
      "location": "Your Location",
      "phone": "Your Phone"
    },
    "social": [
      {
        "name": "github",
        "url": "https://github.com/yourusername"
      },
      {
        "name": "linkedin",
        "url": "https://linkedin.com/in/yourprofile"
      }
    ]
  },
  "skills": {
    "categories": [
      {
        "title": "Frontend",
        "skills": ["React", "TypeScript", "Tailwind CSS"]
      }
    ]
  },
  "experience": [
    {
      "company": "Company Name",
      "role": "Your Role",
      "duration": "Start - End",
      "description": "Description of your work"
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "Project description",
      "technologies": ["Tech1", "Tech2"],
      "url": "https://project-url.com",
      "github": "https://github.com/yourproject"
    }
  ]
}
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your portfolio.

### 4. Write Blog Posts (Optional)

Create markdown files in `src/blogs/`:

```markdown
---
title: Your Blog Post Title
description: Brief description
date: 2024-01-15
---

Your blog content here...
```

### 5. Deploy to Custom Domain

#### Option A: Deploy to GitHub Pages

```bash
# Update package.json with your repository URL
npm run deploy
```

Configure custom domain in GitHub Pages settings.

#### Option B: Deploy to Netlify

1. Connect your GitHub repository to [Netlify](https://netlify.com)
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add custom domain in Netlify settings

#### Option C: Deploy to Vercel

```bash
npm i -g vercel
vercel
```

---

## 📝 Configuration Details

### Hero Section (`hero`)
- `name`: Your name
- `title`: Professional title/headline
- `description`: About you
- `ctaPrimary`: Primary button text
- `ctaSecondary`: Secondary button text
- `contact`: Location and phone
- `social`: Social media links

### Skills (`skills`)
- Organize skills by category (Frontend, Backend, DevOps, etc.)
- Each category contains a list of skill names

### Experience (`experience`)
- `company`: Company name
- `role`: Your job title
- `duration`: Time period
- `description`: Your responsibilities and achievements
- `highlights`: Key accomplishments (optional)

### Projects (`projects`)
- `title`: Project name
- `description`: What the project does
- `technologies`: Array of technologies used
- `url`: Live project URL
- `github`: GitHub repository link
- `image`: Project screenshot/thumbnail
- `featured`: Mark important projects

### Education (`education`)
- `school`: Institution name
- `degree`: Degree obtained
- `field`: Field of study
- `year`: Graduation year
- `highlights`: Notable achievements

### SEO (`seo`)
- `title`: Page title
- `description`: Meta description
- `keywords`: SEO keywords

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run build:dev       # Development build

# Testing
npm run test            # Run tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting issues

# Optimization
npm run images:optimize # Optimize images
npm run analyze         # Analyze bundle size

# Deployment
npm run deploy          # Deploy to GitHub Pages
npm run preview         # Preview production build
```

---

## 🏗️ Project Structure

```
portfolio/
├── public/
│   ├── config/
│   │   └── portfolio.json          # Your portfolio config
│   ├── robots.txt                   # SEO
│   └── sitemap.xml                  # SEO
├── src/
│   ├── components/                  # React components
│   │   ├── Contact.tsx
│   │   ├── Navigation.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   └── ...
│   ├── pages/                       # Page layouts
│   ├── hooks/                       # Custom React hooks
│   ├── lib/                         # Utilities
│   ├── styles/                      # CSS files
│   ├── blogs/                       # Markdown blog posts
│   ├── App.tsx                      # Main app component
│   └── main.tsx                     # Entry point
├── package.json                     # Dependencies
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # TypeScript config
└── tailwind.config.ts               # Tailwind CSS config
```

---

## 🎨 Customization Guide

### Change Colors

Colors are HSL tokens in `src/index.css`: `:root` holds the light palette and `.dark` the dark one.
The accent is `--primary`; `--rule` is the hairline color between rows.

```css
:root {
  --background: 40 23% 95%;  /* paper */
  --foreground: 30 10% 9%;   /* ink */
  --primary: 356 78% 42%;    /* accent red */
}
```

Check any new pair against WCAG AA (4.5:1) in both themes.

### Add More Sections

1. Create a new component in `src/components/`
2. Wrap it in `<Section>` and add it to `src/pages/Index.tsx`
3. Add config to `portfolio.json`

### Customize Fonts

Fonts are self-hosted through Fontsource packages, imported in `src/main.tsx`, and mapped to
`font-serif`, `font-sans` and `font-mono` in `tailwind.config.ts`. To swap one, install its
`@fontsource` package, change the import, and update the family name in the Tailwind config.

---

## 📊 Performance Features

- ✅ Image optimization with lazy loading
- ✅ Code splitting and lazy routes
- ✅ CSS minification and purging
- ✅ Bundle analysis tools
- ✅ SEO optimization
- ✅ Meta tags and Open Graph support

Check bundle size:

```bash
npm run analyze
```

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Watch mode during development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## 🚀 Deployment Checklist

- [ ] Update `public/config/portfolio.json` with your info
- [ ] Update SEO metadata in config
- [ ] Add your social media links
- [ ] Write or remove blog posts
- [ ] Optimize and add project images
- [ ] Test locally with `npm run dev`
- [ ] Build with `npm run build`
- [ ] Test production build with `npm run preview`
- [ ] Deploy using your preferred platform
- [ ] Test on mobile and different browsers
- [ ] Set up custom domain
- [ ] Enable HTTPS

---

## 🤝 Contributing

Found a bug or have a feature idea? Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. Feel free to use it for personal or commercial projects.

---

## 🙋 Support

- 📧 **Questions?** Open an issue on GitHub
- 💡 **Have suggestions?** Create a discussion
- 🐛 **Found a bug?** Report it with details

---

## 🙌 Acknowledgments

Built with:
- [React](https://react.dev) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Fontsource](https://fontsource.org/) - Self-hosted fonts
- [Jest](https://jestjs.io/) - Testing

---

## ⭐ Show Your Support

If you find this template useful, please give it a star! It helps others discover it too.

**Happy building! 🚀**
