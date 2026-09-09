import mongoose, { Schema, Document } from 'mongoose';
import type { GeneratedFile } from '../schemas/builder.js';

export interface IProjectFile {
  path: string;
  content: string;
  type: string;
}

export interface IProject extends Document {
  name: string;
  prompt: string;
  brandName?: string;
  style?: string;
  websiteType?: string;
  status: 'generating' | 'completed' | 'failed' | 'edited';
  plan?: Record<string, any>;
  designTokens?: Record<string, any>;
  criticReport?: Record<string, any>;
  files: IProjectFile[];
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  previewPort?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectFileSchema = new Schema<IProjectFile>(
  {
    path: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, required: true },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, unique: true, index: true },
    prompt: { type: String, required: true },
    brandName: { type: String },
    style: { type: String },
    websiteType: { type: String },
    status: {
      type: String,
      enum: ['generating', 'completed', 'failed', 'edited'],
      default: 'completed',
    },
    plan: { type: Schema.Types.Mixed },
    designTokens: { type: Schema.Types.Mixed },
    criticReport: { type: Schema.Types.Mixed },
    files: [ProjectFileSchema],
    dependencies: { type: Schema.Types.Mixed },
    devDependencies: { type: Schema.Types.Mixed },
    previewPort: { type: Number },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
