import type { IProject } from '../models/Project.js';

export interface VirtualFileMap {
  [path: string]: {
    code: string;
  };
}

export interface SandpackProjectBundle {
  name: string;
  brandName?: string;
  files: VirtualFileMap;
  dependencies: Record<string, string>;
  entryFile: string;
}

/**
 * Transforms MongoDB project files into an in-memory virtual filesystem bundle
 * configured for in-browser execution with Next.js shims and Tailwind CSS.
 */
export function buildSandpackBundle(project: IProject): SandpackProjectBundle {
  const virtualFiles: VirtualFileMap = {};

  // 1. Next.js shims so Next components run cleanly in browser
  virtualFiles['/next/link.tsx'] = {
    code: `import React from 'react';
export default function Link({ href, children, className, ...props }: any) {
  return (
    <a href={href || '#'} className={className} {...props}>
      {children}
    </a>
  );
}`,
  };

  virtualFiles['/next/image.tsx'] = {
    code: `import React from 'react';
export default function Image({ src, alt, width, height, className, ...props }: any) {
  return (
    <img
      src={src}
      alt={alt || ''}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      {...props}
    />
  );
}`,
  };

  virtualFiles['/next/font/google.ts'] = {
    code: `export function Outfit() { return { className: 'font-outfit', variable: '--font-heading' }; }
export function Inter() { return { className: 'font-inter', variable: '--font-body' }; }
export function Roboto() { return { className: 'font-roboto', variable: '--font-body' }; }
export function Poppins() { return { className: 'font-poppins', variable: '--font-heading' }; }
export function Plus_Jakarta_Sans() { return { className: 'font-plus-jakarta', variable: '--font-body' }; }
export function Playfair_Display() { return { className: 'font-playfair', variable: '--font-heading' }; }
export default function Font() { return { className: '', variable: '' }; }`,
  };

  // Find page file
  let pageFileContent = '';
  let foundPagePath = '';
  let globalsCss = '';

  for (const file of project.files) {
    let cleanPath = file.path.startsWith('/') ? file.path : `/${file.path}`;

    // Store globals.css
    if (cleanPath.endsWith('globals.css')) {
      globalsCss = file.content;
      virtualFiles['/styles.css'] = { code: file.content };
    }

    // Check for page file
    if (cleanPath.includes('page.tsx')) {
      pageFileContent = file.content;
      foundPagePath = cleanPath;
    }

    // Rewrite Next imports to local shims and aliases
    let processedCode = file.content
      .replace(/from\s+["']next\/link["']/g, 'from "/next/link"')
      .replace(/from\s+["']next\/image["']/g, 'from "/next/image"')
      .replace(/from\s+["']next\/font\/google["']/g, 'from "/next/font/google"')
      .replace(/from\s+["']@\//g, 'from "/src/');

    virtualFiles[cleanPath] = { code: processedCode };
  }

  // Fallback globals.css if not provided
  if (!virtualFiles['/styles.css']) {
    virtualFiles['/styles.css'] = {
      code: `
:root {
  --background: #ffffff;
  --foreground: #0f172a;
}
body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  background-color: var(--background);
  color: var(--foreground);
}
`,
    };
  }

  // 2. Main Entry Point: /App.tsx
  // If we found a page component, import and render it
  if (foundPagePath) {
    virtualFiles['/App.tsx'] = {
      code: `import React from 'react';
import './styles.css';
import PageComponent from '${foundPagePath.replace(/\.tsx$/, '')}';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      <PageComponent />
    </div>
  );
}
`,
    };
  } else {
    virtualFiles['/App.tsx'] = {
      code: `import React from 'react';
import './styles.css';

export default function App() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>${project.name}</h1>
      <p>Landing page preview generated directly from MongoDB Atlas.</p>
    </div>
  );
}
`,
    };
  }

  // 3. Mount file: /index.tsx
  virtualFiles['/index.tsx'] = {
    code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
`,
  };

  // 4. HTML Entry: /public/index.html with Tailwind CDN
  virtualFiles['/public/index.html'] = {
    code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${project.brandName || project.name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: {
              heading: ['Outfit', 'sans-serif'],
              body: ['Inter', 'sans-serif'],
            }
          }
        }
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
  };

  return {
    name: project.name,
    brandName: project.brandName,
    files: virtualFiles,
    dependencies: {
      react: '^18.3.1',
      'react-dom': '^18.3.1',
      'lucide-react': '^0.460.0',
      'framer-motion': '^11.0.0',
      clsx: '^2.1.0',
      'tailwind-merge': '^2.6.0',
      'class-variance-authority': '^0.7.0',
      ...project.dependencies,
    },
    entryFile: '/App.tsx',
  };
}
