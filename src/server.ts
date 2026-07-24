import express from 'express';
import cors from 'cors';
// @ts-ignore: Archiver lacks default export in types but has one at runtime
import archiver from 'archiver';
import { resolve, join } from 'path';
import { readdir, readFile, writeFile, rm, stat } from 'fs/promises';
import { runPipeline } from './orchestrator/pipeline.js';
import { runEditPipeline } from './orchestrator/editor-pipeline.js';
import { startPreview, stopPreview, getPreviewStatus } from './lib/preview-manager.js';
import { logEmitter, log } from './lib/logger.js';
import { config } from 'dotenv';
import type { GeneratedFile } from './schemas/builder.js';

config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = resolve(import.meta.dirname, '..', 'public');
const OUTPUT_DIR = resolve(import.meta.dirname, '..', 'output');

// Serve static files
app.use(express.static(PUBLIC_DIR));

// SSE Endpoint for streaming logs
app.get('/api/events/:jobId', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const jobId = req.params.jobId;

  res.write(`data: ${JSON.stringify({ type: 'connected', jobId })}\n\n`);

  const logListener = (data: any) => {
    res.write(`data: ${JSON.stringify({ type: 'log', ...data })}\n\n`);
  };

  logEmitter.on('log', logListener);

  req.on('close', () => {
    logEmitter.off('log', logListener);
  });
});

// Trigger generation
app.post('/api/generate', async (req, res) => {
  const { prompt, loops, projectName } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const jobId = Math.random().toString(36).substring(7);
  
  setTimeout(() => {
    runPipeline(prompt, {
      maxCriticLoops: parseInt(loops ?? '3', 10),
      projectName: projectName,
    }).then(result => {
      logEmitter.emit('log', {
        level: 'success',
        message: `Project completed at ${result.outputDir}`,
        type: 'done',
        result
      });
    }).catch(error => {
      logEmitter.emit('log', {
        level: 'error',
        message: error instanceof Error ? error.message : String(error),
        type: 'error'
      });
    });
  }, 1500);

  res.json({ jobId, message: 'Generation started' });
});

// --- Project Management Endpoints ---

app.get('/api/projects', async (req, res) => {
  try {
    const entries = await readdir(OUTPUT_DIR, { withFileTypes: true });
    const projects = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
    res.json({ projects });
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      res.json({ projects: [] });
    } else {
      res.status(500).json({ error: 'Failed to read projects directory' });
    }
  }
});

app.delete('/api/projects/:projectName', async (req, res) => {
  try {
    const projectPath = join(OUTPUT_DIR, req.params.projectName);
    await rm(projectPath, { recursive: true, force: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

async function getFilesRecursively(dir: string, baseDir: string = dir): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const res = join(dir, entry.name);
    // Ignore node_modules and .next to avoid huge payloads and clutter
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') return [];
      return getFilesRecursively(res, baseDir);
    } else {
      return [res.substring(baseDir.length + 1).replace(/\\/g, '/')];
    }
  }));
  return Array.prototype.concat(...files);
}

app.get('/api/projects/:projectName/files', async (req, res) => {
  try {
    const projectPath = join(OUTPUT_DIR, req.params.projectName);
    const files = await getFilesRecursively(projectPath);
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read project files' });
  }
});

app.get('/api/projects/:projectName/file', async (req, res) => {
  try {
    const { projectName } = req.params;
    const { path } = req.query;
    if (!path || typeof path !== 'string') return res.status(400).json({ error: 'Path required' });
    
    // basic security against path traversal
    if (path.includes('..')) return res.status(400).json({ error: 'Invalid path' });
    
    const filePath = join(OUTPUT_DIR, projectName, path);
    const content = await readFile(filePath, 'utf-8');
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read file' });
  }
});

app.put('/api/projects/:projectName/file', async (req, res) => {
  try {
    const { projectName } = req.params;
    const { path, content } = req.body;
    if (!path || typeof content !== 'string') return res.status(400).json({ error: 'Path and content required' });
    
    if (path.includes('..')) return res.status(400).json({ error: 'Invalid path' });
    
    const filePath = join(OUTPUT_DIR, projectName, path);
    await writeFile(filePath, content, 'utf-8');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to write file' });
  }
});

// Helper for agent to read current project context
async function getProjectContext(projectName: string): Promise<GeneratedFile[]> {
  const projectPath = join(OUTPUT_DIR, projectName);
  const filesPaths = await getFilesRecursively(projectPath);
  
  const files: GeneratedFile[] = [];
  for (const p of filesPaths) {
    // Only pass source files to agent to save context window
    if (p.endsWith('.tsx') || p.endsWith('.ts') || p.endsWith('.css') || p.endsWith('.json') || p.endsWith('.mjs')) {
      // Don't pass package-lock.json
      if (p === 'package-lock.json') continue;
      
      const content = await readFile(join(projectPath, p), 'utf-8');
      
      let type: GeneratedFile['type'] = 'utility';
      if (p.includes('page.tsx')) type = 'page';
      else if (p.includes('layout.tsx')) type = 'layout';
      else if (p.includes('components/')) type = 'component';
      else if (p.endsWith('.css')) type = 'style';
      else if (p.endsWith('.json') || p.endsWith('.mjs') || p.includes('config')) type = 'config';
      
      files.push({
        path: p,
        content,
        type
      });
    }
  }
  return files;
}

app.get('/api/projects/:projectName/download', async (req, res) => {
  const { projectName } = req.params;
  const projectPath = join(OUTPUT_DIR, projectName);

  try {
    const projectStat = await stat(projectPath);
    if (!projectStat.isDirectory()) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.attachment(`${projectName}.zip`);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    archive.on('error', (err: Error) => {
      res.status(500).send({ error: err.message });
    });

    archive.pipe(res);
    archive.directory(projectPath, false);
    archive.finalize();

  } catch (error) {
    res.status(404).json({ error: 'Project not found' });
  }
});

app.post('/api/projects/:projectName/agent-edit', async (req, res) => {
  const { projectName } = req.params;
  const { prompt, images } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const jobId = Math.random().toString(36).substring(7);
  
  try {
    const projectDir = join(OUTPUT_DIR, projectName);
    // Ensure project exists
    await stat(projectDir);

    // Save images to public folder if provided
    const processedImages: { data: string; mimeType: string; name: string }[] = [];
    if (images && Array.isArray(images) && images.length > 0) {
      const publicImagesDir = join(projectDir, 'public', 'images');
      // Create images dir if it doesn't exist
      await import('fs/promises').then(fs => fs.mkdir(publicImagesDir, { recursive: true }));
      
      for (const img of images) {
        if (img && img.data && img.name) {
          // The data might have a data URI prefix (e.g., data:image/png;base64,...), strip it if so
          let base64Data = img.data;
          if (base64Data.includes('base64,')) {
            base64Data = base64Data.split('base64,')[1];
          }
          
          const imagePath = join(publicImagesDir, img.name);
          await import('fs/promises').then(fs => fs.writeFile(imagePath, Buffer.from(base64Data, 'base64')));
          log.info(`Saved uploaded image to public/images/${img.name}`);
          
          processedImages.push({
            data: base64Data,
            mimeType: img.mimeType,
            name: img.name
          });
        }
      }
    }
    
    const currentFiles = await getProjectContext(projectName);
    
    setTimeout(() => {
      runEditPipeline(prompt, currentFiles, {
        projectName,
        outputDir: projectDir,
        images: processedImages.length > 0 ? processedImages : undefined,
      }).then(result => {
        logEmitter.emit('log', {
          level: 'success',
          message: `Edit completed at ${result.outputDir}`,
          type: 'done',
          result
        });
      }).catch(error => {
        logEmitter.emit('log', {
          level: 'error',
          message: error instanceof Error ? error.message : String(error),
          type: 'error'
        });
      });
    }, 1500);

    res.json({ jobId, message: 'Agent edit started' });
  } catch (error) {
    res.status(404).json({ error: 'Project not found' });
  }
});

app.post('/api/projects/:projectName/preview/start', async (req, res) => {
  const { projectName } = req.params;
  try {
    const projectDir = join(OUTPUT_DIR, projectName);
    await stat(projectDir);
    const port = await startPreview(projectDir, projectName);
    res.json({ success: true, port });
  } catch (error) {
    console.error("Preview start error:", error);
    require('fs').writeFileSync('error.log', String(error) + '\n' + ((error as Error).stack || ''));
    res.status(500).json({ error: 'Failed to start preview' });
  }
});

app.post('/api/projects/:projectName/preview/stop', (req, res) => {
  const { projectName } = req.params;
  stopPreview(projectName);
  res.json({ success: true });
});

app.get('/api/projects/:projectName/preview/status', (req, res) => {
  const { projectName } = req.params;
  const status = getPreviewStatus(projectName);
  res.json(status);
});

export function startServer() {
  app.listen(PORT, () => {
    log.info(`Web UI is running at http://localhost:${PORT}`);
  });
}
