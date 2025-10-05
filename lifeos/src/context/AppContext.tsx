
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useReducer, useMemo } from 'react';
import type { Task, Habit, Transaction, StudySession, Workout, Book, Quote, Subject, Lesson, Exam, StudyPlanEntry } from '@/lib/types';
import { sampleTasks, sampleHabits, sampleTransactions, sampleStudySessions, sampleWorkouts, sampleBooks, sampleQuotes, sampleSubjects, sampleLessons, sampleExams, sampleStudyPlan } from '@/lib/data';

type AppState = {
  tasks: Task[];
  habits: Habit[];
  transactions: Transaction[];
  studySessions: StudySession[];
  workouts: Workout[];
  books: Book[];
  quotes: Quote[];
  subjects: Subject[];
  lessons: Lesson[];
  exams: Exam[];
  studyPlan: StudyPlanEntry[];
};

type Action =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'UPDATE_HABIT'; payload: Habit }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_STUDY_SESSION'; payload: StudySession }
  | { type: 'DELETE_STUDY_SESSION'; payload: string }
  | { type: 'ADD_WORKOUT'; payload: Workout }
  | { type: 'DELETE_WORKOUT'; payload: string }
  | { type: 'ADD_BOOK'; payload: Book }
  | { type: 'UPDATE_BOOK'; payload: Book }
  | { type: 'DELETE_BOOK'; payload: string }
  | { type: 'ADD_QUOTE'; payload: Quote }
  | { type: 'DELETE_QUOTE'; payload: string }
  | { type: 'ADD_SUBJECT'; payload: Subject }
  | { type: 'UPDATE_SUBJECT'; payload: Subject }
  | { type: 'DELETE_SUBJECT'; payload: string }
  | { type: 'ADD_LESSON'; payload: Lesson }
  | { type: 'UPDATE_LESSON'; payload: Lesson }
  | { type: 'DELETE_LESSON'; payload: string }
  | { type: 'SET_EXAM'; payload: Exam }
  | { type: 'UPDATE_STUDY_PLAN'; payload: StudyPlanEntry[] };

const initialState: AppState = {
  tasks: sampleTasks,
  habits: sampleHabits,
  transactions: sampleTransactions,
  studySessions: sampleStudySessions,
  workouts: sampleWorkouts,
  books: sampleBooks,
  quotes: sampleQuotes,
  subjects: sampleSubjects,
  lessons: sampleLessons,
  exams: sampleExams,
  studyPlan: sampleStudyPlan,
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };
    case 'UPDATE_HABIT':
        return {
            ...state,
            habits: state.habits.map(habit => habit.id === action.payload.id ? action.payload : habit)
        };
    case 'DELETE_HABIT':
        return { ...state, habits: state.habits.filter(habit => habit.id !== action.payload) };
    case 'ADD_TRANSACTION':
        return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION':
        return {
            ...state,
            transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t)
        };
    case 'DELETE_TRANSACTION':
        return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case 'ADD_STUDY_SESSION':
        return { ...state, studySessions: [action.payload, ...state.studySessions] };
    case 'DELETE_STUDY_SESSION':
        return { ...state, studySessions: state.studySessions.filter(s => s.id !== action.payload) };
    case 'ADD_WORKOUT':
        return { ...state, workouts: [action.payload, ...state.workouts] };
    case 'DELETE_WORKOUT':
        return { ...state, workouts: state.workouts.filter(w => w.id !== action.payload) };
    case 'ADD_BOOK':
        return { ...state, books: [action.payload, ...state.books] };
    case 'UPDATE_BOOK': {
        const updatedBook = action.payload;
        if (updatedBook.status === 'completed' && !updatedBook.completedAt) {
            updatedBook.completedAt = new Date().toISOString();
        } else if (updatedBook.status !== 'completed') {
            updatedBook.completedAt = null;
        }
        return {
            ...state,
            books: state.books.map(book => book.id === updatedBook.id ? updatedBook : book),
        };
    }
    case 'DELETE_BOOK':
        return { 
            ...state, 
            books: state.books.filter(book => book.id !== action.payload),
            quotes: state.quotes.filter(quote => quote.bookId !== action.payload)
        };
    case 'ADD_QUOTE':
        return { ...state, quotes: [action.payload, ...state.quotes] };
    case 'DELETE_QUOTE':
        return { ...state, quotes: state.quotes.filter(quote => quote.id !== action.payload) };
    
    // New Study Actions
    case 'ADD_SUBJECT':
        return { ...state, subjects: [...state.subjects, action.payload] };
    case 'UPDATE_SUBJECT':
        return {
            ...state,
            subjects: state.subjects.map(s => s.id === action.payload.id ? action.payload : s)
        };
    case 'DELETE_SUBJECT': {
        const deletedSubjectId = action.payload;
        const remainingLessons = state.lessons.filter(l => l.subjectId !== deletedSubjectId);
        const remainingPlanEntries = state.studyPlan.filter(p => p.subjectId !== deletedSubjectId);

        return {
            ...state,
            subjects: state.subjects.filter(s => s.id !== deletedSubjectId),
            lessons: remainingLessons,
            studyPlan: remainingPlanEntries
        };
    }
    case 'ADD_LESSON':
        return { ...state, lessons: [...state.lessons, action.payload] };
    case 'UPDATE_LESSON':
        return {
            ...state,
            lessons: state.lessons.map(l => l.id === action.payload.id ? action.payload : l)
        };
    case 'DELETE_LESSON': {
        const deletedLessonId = action.payload;
        // Also remove the deleted lesson from any study plan entries
        const updatedStudyPlan = state.studyPlan.map(entry => ({
            ...entry,
            lessons: entry.lessons.filter(scheduled => scheduled.lessonId !== deletedLessonId)
        }));
        return { 
            ...state, 
            lessons: state.lessons.filter(l => l.id !== deletedLessonId),
            studyPlan: updatedStudyPlan
        };
    }
    case 'SET_EXAM':
        // Only one exam for now
        return { ...state, exams: [action.payload] };
    case 'UPDATE_STUDY_PLAN':
        return { ...state, studyPlan: action.payload };

    default:
      return state;
  }
};

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
