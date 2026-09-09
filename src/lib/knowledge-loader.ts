import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { log } from './logger.js';

const KNOWLEDGE_DIR = resolve(process.cwd(), 'src', 'knowledge');

/**
 * Load a single knowledge file by name (without extension).
 * Returns the file content as a string.
 */
export function loadKnowledgeFile(name: string): string {
  const filePath = join(KNOWLEDGE_DIR, `${name}.md`);

  if (!existsSync(filePath)) {
    log.warn(`Knowledge file not found: ${filePath}`);
    return `[Knowledge file "${name}.md" not found]`;
  }

  return readFileSync(filePath, 'utf-8');
}

/**
 * Load multiple knowledge files and combine them into a single context string.
 * Each file is wrapped with a header for clarity.
 */
export function loadKnowledge(fileNames: string[]): string {
  const sections = fileNames.map((name) => {
    const content = loadKnowledgeFile(name);
    return `\n--- KNOWLEDGE: ${name}.md ---\n${content}\n--- END: ${name}.md ---\n`;
  });

  return sections.join('\n');
}

/**
 * Load all available knowledge files.
 */
export function loadAllKnowledge(): string {
  const allFiles = [
    'design',
    'spacing',
    'typography',
    'colors',
    'animations',
    'components',
    'responsive',
    'accessibility',
    'tailwind',
    'frontend-guidelines',
    'industry-blueprints',
  ];

  return loadKnowledge(allFiles);
}
