export interface QuizResponse {
  studentId: string;
  questionId: string;
  answer: string;
  timestamp: number;
}

export interface SyncStatus {
  lastSyncedTimestamp: number;
  status: 'syncing' | 'saved' | 'error';
}

