export interface StructuredResponse {
  answer: string;
  explanation: string;
  sourceReason: string;
  confidence: 'High' | 'Medium' | 'Low';
  toolUsed?: string[];
  rawText?: string;
}

export interface ToolActionTrace {
  tool: string;
  input: any;
  output: any;
  timestamp: number;
}

export interface AgentStepTrace {
  understand?: string;
  plan?: string;
  toolsUsed?: ToolActionTrace[];
  checkResult?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  structured?: StructuredResponse;
  trace?: AgentStepTrace;
  timestamp: number;
}

export interface UniversityDocument {
  id: string;
  title: string;
  category: 'policy' | 'syllabus' | 'notes' | 'general';
  content: string;
  summary: string;
  uploadedAt: number;
  isSystemDefault?: boolean;
}

export interface StudentMemory {
  name?: string;
  preferredName?: string;
  studentId?: string;
  course?: string;
  year?: number | string;
  section?: string;
  attendanceStats?: {
    attended: number;
    total: number;
    percentage: number;
  };
  academicPreferences?: string[];
  studyPreferences?: string;
  customNotes?: Record<string, string>;
  lastUpdated: number;
}

export interface StudentRegistryRecord {
  id: string;
  name: string;
  year: number;
  course: string;
  section: string;
  attendance: string;
  gpa: number;
  enrolledSubjects: string[];
  advisor: string;
}
