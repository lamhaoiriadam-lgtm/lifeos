
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory = 'study' | 'work' | 'personal' | 'health' | 'finance';
export type TaskStatus = 'todo' | 'inProgress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string | null;
}

export type HabitCategory = 'health' | 'productivity' | 'learning' | 'mindfulness' | 'other';

export interface HabitCompletion {
  date: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  createdAt: string;
  completions: HabitCompletion[];
}

export type TransactionType = 'income' | 'expense';
export type IncomeCategory = 'salary' | 'freelance' | 'investment' | 'other';
export type ExpenseCategory = 'food' | 'transport' | 'entertainment' | 'education' | 'health' | 'shopping' | 'bills' | 'other';
export type TransactionCategory = IncomeCategory | ExpenseCategory;

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  date: string;
  note?: string;
  createdAt: string;
}

export interface StudySession {
  id: string;
  subject: string;
  duration: number; // in minutes
  date: string;
  notes?: string;
  createdAt: string;
}

export type WorkoutType = 'cardio' | 'strength' | 'sports' | 'yoga' | 'other';

export interface Workout {
  id: string;
  type: WorkoutType;
  duration: number; // in minutes
  date: string;
  notes?: string;
  createdAt: string;
}

export type BookStatus = 'want-to-read' | 'currently-reading' | 'completed';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  coverImage: string; // URL or data URI
  status: BookStatus;
  createdAt: string;
  completedAt?: string | null;
}

export interface Quote {
  id: string;
  bookId: string;
  text: string;
  notes?: string;
  createdAt: string;
}

// New Types for Advanced Study Tracker
export type StudyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type StudyPriority = 'low' | 'medium' | 'high';
export type LessonState = 'learn' | 'exercise';

export interface Lesson {
  id: string;
  subjectId: string;
  title: string;
  level: StudyLevel;
  isCompleted: boolean;
  // notes?: string; // notes are now per-session in the study plan
  // state: LessonState; // state is now per-session in the study plan
}

export interface Subject {
  id: string;
  name: string;
  level: StudyLevel;
  priority: StudyPriority;
}

export interface Exam {
  id: string;
  name: string;
  date: string;
}

export interface ScheduledLesson {
    lessonId: string;
    state: LessonState;
    notes: string;
}

export interface StudyPlanEntry {
    id: string; // Unique ID for the scheduled item
    day: number; // 0 for Sunday, 1 for Monday, etc.
    subjectId: string;
    duration: number; // in hours
    lessons: ScheduledLesson[];
}
