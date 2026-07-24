import { spawn, ChildProcess } from 'child_process';
import { join } from 'path';
import { stat } from 'fs/promises';
import { log } from './logger.js';
import * as net from 'net';

export interface PreviewStatus {
  status: 'starting' | 'running' | 'stopped' | 'error';
  port?: number;
  error?: string;
}

const previews = new Map<string, {
  process?: ChildProcess;
  port?: number;
  status: PreviewStatus['status'];
}>();

async function getAvailablePort(startingPort: number = 3001): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        resolve(getAvailablePort(startingPort + 1));
      } else {
        reject(err);
      }
    });
    server.listen(startingPort, () => {
      const port = (server.address() as net.AddressInfo).port;
      server.close(() => resolve(port));
    });
  });
}

async function runNpmInstall(cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    log.info(`Running npm install in ${cwd}...`);
    // use npm.cmd on windows, npm on linux/mac
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const installProc = spawn(npmCmd, ['install'], { 
      cwd, 
      stdio: 'ignore',
      shell: process.platform === 'win32'
    });
    
    installProc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`npm install exited with code ${code}`));
    });
    installProc.on('error', reject);
  });
}

export async function startPreview(projectDir: string, projectName: string): Promise<number> {
  if (previews.has(projectName)) {
    const current = previews.get(projectName)!;
    if (current.status === 'running' && current.port) {
      return current.port;
    }
  }

  previews.set(projectName, { status: 'starting' });

  try {
    // Check for node_modules
    try {
      await stat(join(projectDir, 'node_modules'));
    } catch {
      // Doesn't exist, run npm install
      await runNpmInstall(projectDir);
    }

    const port = await getAvailablePort(3001);
    log.info(`Starting dev server for ${projectName} on port ${port}...`);
    
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const devProc = spawn(npmCmd, ['run', 'dev', '--', '-p', port.toString()], {
      cwd: projectDir,
      stdio: 'pipe',
      shell: process.platform === 'win32'
    });

    devProc.stdout?.on('data', (data) => {
      // Just log internally or ignore, we don't necessarily need to stream this to frontend for preview
    });
    
    devProc.stderr?.on('data', (data) => {
      log.debug(`[Preview ${projectName}] ${data.toString().trim()}`);
    });

    devProc.on('error', (err) => {
      log.error(`Preview process error for ${projectName}: ${err.message}`);
      previews.set(projectName, { status: 'error' });
    });

    devProc.on('close', () => {
      log.info(`Preview for ${projectName} stopped.`);
      previews.set(projectName, { status: 'stopped' });
    });

    previews.set(projectName, { process: devProc, port, status: 'running' });
    
    // Wait a little bit for the server to bind before returning
    await new Promise(r => setTimeout(r, 3000));
    
    return port;

  } catch (error) {
    console.error("Preview manager caught error:", error);
    previews.set(projectName, { status: 'error' });
    throw error;
  }
}

export function stopPreview(projectName: string) {
  const current = previews.get(projectName);
  if (current?.process) {
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', current.process.pid!.toString(), '/f', '/t']);
    } else {
      current.process.kill();
    }
  }
  previews.delete(projectName);
}

export function getPreviewStatus(projectName: string): PreviewStatus {
  const current = previews.get(projectName);
  if (!current) return { status: 'stopped' };
  return {
    status: current.status,
    port: current.port
  };
}
