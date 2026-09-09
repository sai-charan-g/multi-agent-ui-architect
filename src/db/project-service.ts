import { Project, IProject } from '../models/Project.js';
import { connectDB, isDbConnected } from './connection.js';
import { log } from '../lib/logger.js';
import type { GeneratedProject, GeneratedFile } from '../schemas/builder.js';
import type { PlannerOutput } from '../schemas/planner.js';
import type { DesignTokens } from '../schemas/design-system.js';
import type { CriticReport } from '../schemas/critic.js';

export async function saveOrUpdateProjectInDb(params: {
  name: string;
  prompt: string;
  plan?: PlannerOutput;
  designTokens?: DesignTokens;
  project: GeneratedProject;
  criticReport?: CriticReport;
  status?: 'generating' | 'completed' | 'failed' | 'edited';
}): Promise<IProject | null> {
  if (!isDbConnected()) {
    await connectDB();
  }
  if (!isDbConnected()) {
    log.debug('MongoDB not connected; skipping DB save.');
    return null;
  }

  try {
    const updateData = {
      name: params.name,
      prompt: params.prompt,
      brandName: params.plan?.brandName,
      style: params.plan?.style,
      websiteType: params.plan?.websiteType,
      status: params.status || 'completed',
      plan: params.plan,
      designTokens: params.designTokens,
      criticReport: params.criticReport,
      files: params.project.files,
      dependencies: params.project.dependencies,
      devDependencies: params.project.devDependencies,
    };

    const doc = await Project.findOneAndUpdate(
      { name: params.name },
      { $set: updateData },
      { upsert: true, new: true }
    );

    log.success(`Project "${params.name}" persisted to MongoDB Atlas!`);
    return doc;
  } catch (err) {
    log.error(`Failed to save project to MongoDB: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

export async function updateProjectFileInDb(
  projectName: string,
  filePath: string,
  content: string
): Promise<boolean> {
  if (!isDbConnected()) return false;

  try {
    const project = await Project.findOne({ name: projectName });
    if (!project) return false;

    const fileIndex = project.files.findIndex((f) => f.path === filePath);
    if (fileIndex >= 0) {
      project.files[fileIndex].content = content;
    } else {
      let type: GeneratedFile['type'] = 'utility';
      if (filePath.includes('page.tsx')) type = 'page';
      else if (filePath.includes('layout.tsx')) type = 'layout';
      else if (filePath.includes('components/')) type = 'component';
      else if (filePath.endsWith('.css')) type = 'style';
      else if (filePath.endsWith('.json') || filePath.endsWith('.mjs') || filePath.includes('config')) type = 'config';

      project.files.push({ path: filePath, content, type });
    }

    project.status = 'edited';
    await project.save();
    log.info(`Updated "${filePath}" in MongoDB for project "${projectName}"`);
    return true;
  } catch (err) {
    log.error(`Failed to update file in MongoDB: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
}

export async function getProjectFromDb(projectName: string): Promise<IProject | null> {
  if (!isDbConnected()) return null;
  try {
    return await Project.findOne({ name: projectName }).lean();
  } catch (err) {
    log.error(`Failed to fetch project "${projectName}" from MongoDB: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

export async function getAllProjectNamesFromDb(): Promise<string[]> {
  if (!isDbConnected()) return [];
  try {
    const projects = await Project.find({}, { name: 1, _id: 0 }).lean();
    return projects.map((p) => p.name);
  } catch (err) {
    log.error(`Failed to fetch projects list from MongoDB: ${err instanceof Error ? err.message : String(err)}`);
    return [];
  }
}

export async function deleteProjectFromDb(projectName: string): Promise<boolean> {
  if (!isDbConnected()) return false;
  try {
    await Project.deleteOne({ name: projectName });
    log.info(`Deleted project "${projectName}" from MongoDB`);
    return true;
  } catch (err) {
    log.error(`Failed to delete project "${projectName}" from MongoDB: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
}
