export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  lastLogin: string;
}

export interface LoginAttempt {
  ip: string;
  timestamp: number;
  success: boolean;
}

export interface BlockedIP {
  ip: string;
  blockedUntil: number;
  attempts: number;
}