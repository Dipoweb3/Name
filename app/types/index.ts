export interface Room {
  roomId: string;
  category: string;
  state: 'waiting' | 'submitting' | 'voting' | 'done';
  createdAt: Date;
}

export interface Participant {
  roomId: string;
  fid: string;
  username: string;
}

export interface Submission {
  roomId: string;
  fid: string;
  answer: string;
  timestamp: Date;
}

export interface Vote {
  roomId: string;
  answerId: string;
  voterFid: string;
  vote: 'correct' | 'incorrect';
}

export interface Score {
  fid: string;
  username: string;
  points: number;
} 