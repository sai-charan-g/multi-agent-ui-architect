import { runEditorAgent } from '../agents/editor.js';
import { runCriticAgent } from '../agents/critic.js';
import { logEmitter, log } from '../lib/logger.js';
import { updateProjectFileInDb } from '../db/project-service.js';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import type { GeneratedFile } from '../schemas/builder.js';
import type { CriticReport } from '../schemas/critic.js';

export interface EditorPipelineOptions {
  projectName: string;
  outputDir: string;
  images?: { data: string; mimeType: string; name: string }[];
}

export async function runEditPipeline(
  prompt: string,
  currentFiles: GeneratedFile[],
  options: EditorPipelineOptions
): Promise<{ outputDir: string }> {
  const pipelineStart = Date.now();
  const { projectName, outputDir, images } = options;

  log.divider();
  log.info(`Starting Edit Pipeline for project: ${projectName}`);
  log.info(`Request: "${prompt}"`);
  if (images && images.length > 0) {
    log.info(`Included ${images.length} images: ${images.map(i => i.name).join(', ')}`);
  }
  log.divider();

  log.step(1, 2, '🤖 Editor Agent — analyzing and modifying files');
  
  try {
    let editResult = await runEditorAgent({ prompt, currentFiles, images });
    log.success(`Agent modified/created ${editResult.files.length} files.`);
    
    // --- CRITIC LOOP ---
    const maxCriticLoops = 2;
    let iterations = 0;
    
    for (let i = 0; i < maxCriticLoops; i++) {
      iterations = i + 1;
      log.step(2, 3, `🔍 Critic Agent — review iteration ${iterations}/${maxCriticLoops}`);
      
      // We pass the modified files as the "project" for the critic to review
      const criticReport = await runCriticAgent({ 
        files: editResult.files,
        dependencies: {},
        devDependencies: {}
      });
      
      log.info(`Critic score: ${criticReport.overallScore}/10`, {
        issues: criticReport.issues.length,
        critical: criticReport.issues.filter((i) => i.severity === 'critical').length,
        major: criticReport.issues.filter((i) => i.severity === 'major').length,
      });

      if (criticReport.passed) {
        log.success(`✅ Critic PASSED on iteration ${iterations} (score: ${criticReport.overallScore}/10)`);
        break;
      }

      if (i < maxCriticLoops - 1) {
        log.warn(`Critic found ${criticReport.issues.length} issues. Sending back to Editor for fixes...`);
        log.step(2, 3, `🔧 Fixing issues (iteration ${iterations})`);
        
        // Let the editor try again with the feedback
        editResult = await runEditorAgent({ 
          prompt, 
          currentFiles, 
          images,
          criticReport 
        });
        log.success(`Agent updated ${editResult.files.length} files.`);
      } else {
        log.warn(`Max iterations reached. Proceeding with current output (score: ${criticReport.overallScore}/10).`);
      }
    }
    
    log.step(3, 3, '📁 Saving changes to disk');
    
    for (const file of editResult.files) {
      if (file.path.includes('..')) {
        log.warn(`Skipping invalid file path (path traversal detected): ${file.path}`);
        continue;
      }
      const filePath = join(outputDir, file.path);
      mkdirSync(dirname(filePath), { recursive: true });
      writeFileSync(filePath, file.content, 'utf-8');
      await updateProjectFileInDb(projectName, file.path, file.content);
      log.debug(`  Updated: ${file.path}`);
    }
    
    log.divider();
    log.timing('Total edit pipeline', pipelineStart);
    log.success('🎉 Edit completed successfully');
    log.divider();
    
    return { outputDir };
  } catch (error) {
    log.error('Edit pipeline failed', { error: error instanceof Error ? error.message : String(error) });
    throw error;
  }
}
