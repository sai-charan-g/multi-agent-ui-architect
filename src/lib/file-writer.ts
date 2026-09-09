import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import type { GeneratedProject } from '../schemas/index.js';
import { log } from './logger.js';

const OUTPUT_DIR = resolve(import.meta.dirname, '..', '..', 'output');

/**
 * Write a generated project to disk.
 * Creates the full folder structure and writes all files.
 */
export function writeProject(project: GeneratedProject, projectName: string): string {
  const projectDir = join(OUTPUT_DIR, projectName);

  log.info(`Writing project to: ${projectDir}`);

  // Write all source files
  for (const file of project.files) {
    const filePath = join(projectDir, file.path);
    const dir = dirname(filePath);

    mkdirSync(dir, { recursive: true });
    writeFileSync(filePath, file.content, 'utf-8');
    log.debug(`  Created: ${file.path}`);
  }

  // Write package.json
  const packageJson = {
    name: projectName,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: {
      'next': '^15.0.0',
      'react': '^19.0.0',
      'react-dom': '^19.0.0',
      'framer-motion': '^11.0.0',
      'lucide-react': '^0.460.0',
      'class-variance-authority': '^0.7.0',
      'clsx': '^2.1.0',
      'tailwind-merge': '^2.6.0',
      ...project.dependencies,
    },
    devDependencies: {
      '@types/node': '^22.0.0',
      '@types/react': '^19.0.0',
      '@types/react-dom': '^19.0.0',
      'typescript': '^5.7.0',
      'tailwindcss': '^4.0.0',
      '@tailwindcss/postcss': '^4.0.0',
      'postcss': '^8.4.0',
      ...project.devDependencies,
    },
  };

  const packageJsonPath = join(projectDir, 'package.json');
  mkdirSync(dirname(packageJsonPath), { recursive: true });
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');
  log.debug('  Created: package.json');

  // Write tsconfig.json
  const tsconfig = {
    compilerOptions: {
      target: 'ES2017',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [{ name: 'next' }],
      paths: { '@/*': ['./src/*'] },
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules'],
  };

  const tsconfigPath = join(projectDir, 'tsconfig.json');
  writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2), 'utf-8');
  log.debug('  Created: tsconfig.json');

  // Write next.config.ts
  const nextConfig = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.BASE_PATH || undefined,
};

export default nextConfig;
`;
  writeFileSync(join(projectDir, 'next.config.ts'), nextConfig, 'utf-8');
  log.debug('  Created: next.config.ts');

  // Write postcss.config.mjs (Tailwind v4)
  const postcssConfig = `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
`;
  writeFileSync(join(projectDir, 'postcss.config.mjs'), postcssConfig, 'utf-8');
  log.debug('  Created: postcss.config.mjs');

  log.success(`Project written: ${project.files.length} files + configs`);
  return projectDir;
}
