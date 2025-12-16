
export interface ProcessedImage {
  id: string;
  dataUri: string; // The full base64 string including prefix
  mimeType: string;
  timestamp: number;
}

export interface EditHistoryItem {
  id: string;
  originalImageId: string;
  prompt: string;
  resultImage: ProcessedImage | null;
  status: 'pending' | 'success' | 'error';
  error?: string;
  timestamp: number;
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  EDITING = 'EDITING', // User entering prompt
  PROCESSING = 'PROCESSING', // AI generating
  VIEWING = 'VIEWING', // Result displayed
}

export const SUGGESTED_PROMPTS = [
  "Isolate subject on a clean white studio background",
  "Enhance lighting with dramatic cinematic contrast",
  "Convert to high-contrast monochrome editorial style",
  "Apply professional color grading with warm tones",
  "Replace background with a blurred modern office",
  "Transform into a flat vector art illustration",
  "Add soft volumetric fog and mood lighting",
  "Remove all text and distractive elements"
];
