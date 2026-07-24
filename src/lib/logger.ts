import chalk from 'chalk';
import { EventEmitter } from 'events';

type LogLevel = 'info' | 'success' | 'warn' | 'error' | 'debug' | 'agent';

export const logEmitter = new EventEmitter();

const ICONS: Record<LogLevel, string> = {
  info: 'ℹ',
  success: '✓',
  warn: '⚠',
  error: '✗',
  debug: '·',
  agent: '🤖',
};

const COLORS: Record<LogLevel, (text: string) => string> = {
  info: chalk.blue,
  success: chalk.green,
  warn: chalk.yellow,
  error: chalk.red,
  debug: chalk.gray,
  agent: chalk.magenta,
};

function formatTime(): string {
  return chalk.gray(new Date().toLocaleTimeString());
}

function logMessage(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  const icon = ICONS[level];
  const colorFn = COLORS[level];
  const prefix = colorFn(`${icon} ${level.toUpperCase().padEnd(7)}`);
  const time = formatTime();

  console.log(`${time} ${prefix} ${message}`);

  let metaStr = '';
  if (meta) {
    metaStr = Object.entries(meta)
      .map(([k, v]) => `  ${chalk.gray(k + ':')} ${typeof v === 'string' ? v : JSON.stringify(v)}`)
      .join('\n');
    console.log(metaStr);
  }

  // Emit event for SSE
  logEmitter.emit('log', {
    level,
    message,
    meta,
    timestamp: new Date().toISOString()
  });
}

export const log = {
  info: (msg: string, meta?: Record<string, unknown>) => logMessage('info', msg, meta),
  success: (msg: string, meta?: Record<string, unknown>) => logMessage('success', msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => logMessage('warn', msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => logMessage('error', msg, meta),
  debug: (msg: string, meta?: Record<string, unknown>) => logMessage('debug', msg, meta),
  agent: (msg: string, meta?: Record<string, unknown>) => logMessage('agent', msg, meta),

  step: (step: number, total: number, label: string) => {
    console.log(chalk.cyan(`\n[${'─'.repeat(40)}]`));
    console.log(chalk.cyan.bold(`  Step ${step}/${total}: ${label}`));
    console.log(chalk.cyan(`[${'─'.repeat(40)}]\n`));
  },

  divider: () => console.log(chalk.gray('─'.repeat(50))),

  timing: (label: string, startMs: number) => {
    const elapsed = Date.now() - startMs;
    const seconds = (elapsed / 1000).toFixed(1);
    logMessage('debug', `${label} completed in ${seconds}s`);
  },
};
