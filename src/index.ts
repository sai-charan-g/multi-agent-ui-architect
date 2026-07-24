import { Command } from 'commander';
import { config } from 'dotenv';
import { runPipeline } from './orchestrator/pipeline.js';
import { log } from './lib/logger.js';

// Load environment variables
config();

const program = new Command();

program
  .name('ai-frontend-designer')
  .description('AI-powered Frontend Designer — generates production-quality websites')
  .version('1.0.0')
  .argument('<request>', 'Description of the website to generate')
  .option('-n, --name <name>', 'Project name for output directory')
  .option('-l, --loops <number>', 'Max critic review loops', '3')
  .action(async (request: string, options: { name?: string; loops?: string }) => {
    try {
      const result = await runPipeline(request, {
        projectName: options.name,
        maxCriticLoops: parseInt(options.loops ?? '3', 10),
      });

      // Print summary
      console.log('\n');
      log.divider();
      log.info('Pipeline Summary:');
      log.info(`  Website Type: ${result.plan.websiteType}`);
      log.info(`  Style: ${result.plan.style}`);
      log.info(`  Brand: ${result.plan.brandName}`);
      log.info(`  Pages: ${result.plan.pages.length}`);
      log.info(`  Files Generated: ${result.project.files.length}`);
      log.info(`  Critic Score: ${result.criticReport.overallScore}/10`);
      log.info(`  Iterations: ${result.iterations}`);
      log.info(`  Output: ${result.outputDir}`);
      log.divider();

      process.exit(0);
    } catch (error) {
      log.error(`Pipeline failed: ${error instanceof Error ? error.message : String(error)}`);
      if (error instanceof Error && error.stack) {
        log.debug(error.stack);
      }
      process.exit(1);
    }
  });

program
  .command('serve')
  .description('Start the Web UI server')
  .action(async () => {
    const { startServer } = await import('./server.js');
    startServer();
  });

program.parse();
