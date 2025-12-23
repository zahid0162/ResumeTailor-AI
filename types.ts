
export interface ResumeData {
  content: string;
  fileName?: string;
}

export interface JobDescription {
  text: string;
  companyName?: string;
  jobTitle?: string;
}

export interface TailoredResult {
  tailoredResume: string;
  keyChanges: string[];
  matchScore: number;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}
