
import { z } from 'zod';

export const taskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  category: z.enum(['study', 'work', 'personal', 'health', 'finance']),
  dueDate: z.string().min(1, 'Due date is required'),
  status: z.enum(['todo', 'inProgress', 'done']),
});

export const habitSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Habit name is required'),
  category: z.enum(['health', 'productivity', 'learning', 'mindfulness', 'other']),
});

export const transactionSchema = z.object({
    id: z.string().optional(),
    type: z.enum(['income', 'expense']),
    amount: z.coerce.number().positive('Amount must be positive'),
    category: z.string().min(1, 'Category is required'),
    date: z.string().min(1, 'Date is required'),
    note: z.string().optional(),
});

export const studySessionSchema = z.object({
    id: z.string().optional(),
    subject: z.string().min(1, 'Subject is required'),
    duration: z.coerce.number().positive('Duration must be positive'),
    date: z.string().min(1, 'Date is required'),
    notes: z.string().optional(),
});

export const workoutSchema = z.object({
    id: z.string().optional(),
    type: z.enum(['cardio', 'strength', 'sports', 'yoga', 'other']),
    duration: z.coerce.number().positive('Duration must be positive'),
    date: z.string().min(1, 'Date is required'),
    notes: z.string().optional(),
});

export const bookSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author is required"),
    category: z.string().min(1, "Category is required"),
    coverImage: z.string().min(1, "A cover image is required."),
    status: z.enum(['want-to-read', 'currently-reading', 'completed']).default('want-to-read'),
  });
  
export const quoteSchema = z.object({
    id: z.string().optional(),
    bookId: z.string().min(1, "A book must be selected"),
    text: z.string().min(1, "Quote text cannot be empty"),
    notes: z.string().optional(),
});

// New Schemas for Advanced Study Tracker
export const examSchema = z.object({
    name: z.string().min(1, "Exam name is required"),
    date: z.string().min(1, "Exam date is required"),
});

export const subjectSchema = z.object({
    name: z.string().min(2, "Subject name must be at least 2 characters."),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    priority: z.enum(['low', 'medium', 'high']),
});

export const lessonSchema = z.object({
    subjectId: z.string(),
    title: z.string().min(2, "Lesson title must be at least 2 characters."),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
});
