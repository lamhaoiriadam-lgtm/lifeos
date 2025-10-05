
import { Task, Habit, Transaction, StudySession, Workout, Book, Quote, Subject, Lesson, Exam, StudyPlanEntry } from './types';
import { v4 as uuidv4 } from 'uuid';
import { format, subDays, addDays, addMonths } from 'date-fns';

const today = new Date();
const dateFormat = 'yyyy-MM-dd';

export const sampleTasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Complete LifeOS project',
    description: 'Finish the LifeOS MVP, focusing on the dashboard and task manager.',
    priority: 'high',
    category: 'work',
    dueDate: format(addDays(today, 3), dateFormat),
    status: 'inProgress',
    createdAt: format(subDays(today, 2), dateFormat),
  },
  {
    id: uuidv4(),
    title: 'Weekly grocery shopping',
    priority: 'medium',
    category: 'personal',
    dueDate: format(addDays(today, 1), dateFormat),
    status: 'todo',
    createdAt: format(subDays(today, 1), dateFormat),
  },
  {
    id: uuidv4(),
    title: 'Read a chapter of "Clean Code"',
    priority: 'low',
    category: 'study',
    dueDate: format(today, dateFormat),
    status: 'todo',
    createdAt: format(subDays(today, 3), dateFormat),
  },
  {
    id: uuidv4(),
    title: 'Pay electricity bill',
    description: 'Due by the end of the week.',
    priority: 'high',
    category: 'finance',
    dueDate: format(addDays(today, 5), dateFormat),
    status: 'todo',
    createdAt: format(today, dateFormat),
  },
  {
    id: uuidv4(),
    title: 'Morning run',
    priority: 'medium',
    category: 'health',
    dueDate: format(subDays(today, 1), dateFormat),
    status: 'done',
    createdAt: format(subDays(today, 1), dateFormat),
    completedAt: format(subDays(today, 1), dateFormat),
  },
    {
    id: uuidv4(),
    title: 'Prepare presentation for Monday',
    priority: 'high',
    category: 'work',
    dueDate: format(addDays(today, 4), dateFormat),
    status: 'todo',
    createdAt: format(today, dateFormat),
  },
  {
    id: uuidv4(),
    title: 'Plan weekend trip',
    priority: 'low',
    category: 'personal',
    dueDate: format(addDays(today, 10), dateFormat),
    status: 'inProgress',
    createdAt: format(subDays(today, 5), dateFormat),
  },
];

export const sampleHabits: Habit[] = [
  {
    id: uuidv4(),
    name: 'Morning workout',
    category: 'health',
    createdAt: format(subDays(today, 30), dateFormat),
    completions: [
      { date: format(subDays(today, 1), dateFormat), completed: true },
      { date: format(subDays(today, 2), dateFormat), completed: true },
      { date: format(subDays(today, 3), dateFormat), completed: false },
      { date: format(subDays(today, 4), dateFormat), completed: true },
      { date: format(subDays(today, 5), dateFormat), completed: true },
      { date: format(subDays(today, 6), dateFormat), completed: true },
      { date: format(subDays(today, 7), dateFormat), completed: false },
    ],
  },
  {
    id: uuidv4(),
    name: 'Read 20 pages',
    category: 'learning',
    createdAt: format(subDays(today, 60), dateFormat),
    completions: [
      { date: format(subDays(today, 1), dateFormat), completed: true },
      { date: format(subDays(today, 2), dateFormat), completed: true },
      { date: format(subDays(today, 3), dateFormat), completed: true },
    ],
  },
  {
    id: uuidv4(),
    name: 'Meditate for 10 minutes',
    category: 'mindfulness',
    createdAt: format(subDays(today, 10), dateFormat),
    completions: [],
  },
  {
    id: uuidv4(),
    name: 'Drink 8 glasses of water',
    category: 'health',
    createdAt: format(subDays(today, 5), dateFormat),
    completions: [
        { date: format(subDays(today, 0), dateFormat), completed: true },
        { date: format(subDays(today, 1), dateFormat), completed: true },
        { date: format(subDays(today, 2), dateFormat), completed: true },
    ],
  },
];

export const sampleTransactions: Transaction[] = [
    { id: uuidv4(), type: 'income', amount: 2500, category: 'salary', date: format(subDays(today, 15), dateFormat), note: 'Monthly salary', createdAt: new Date().toISOString() },
    { id: uuidv4(), type: 'expense', amount: 55.40, category: 'food', date: format(subDays(today, 4), dateFormat), note: 'Groceries', createdAt: new Date().toISOString() },
    { id: uuidv4(), type: 'expense', amount: 12.00, category: 'transport', date: format(subDays(today, 3), dateFormat), note: 'Subway pass', createdAt: new Date().toISOString() },
    { id: uuidv4(), type: 'expense', amount: 40.00, category: 'entertainment', date: format(subDays(today, 2), dateFormat), note: 'Movie tickets', createdAt: new Date().toISOString() },
    { id: uuidv4(), type: 'expense', amount: 80.00, category: 'shopping', date: format(subDays(today, 2), dateFormat), note: 'New shoes', createdAt: new Date().toISOString() },
    { id: uuidv4(), type: 'income', amount: 300, category: 'freelance', date: format(subDays(today, 1), dateFormat), note: 'Web design gig', createdAt: new Date().toISOString() },
    { id: uuidv4(), type: 'expense', amount: 25.50, category: 'food', date: format(subDays(today, 1), dateFormat), note: 'Lunch with friends', createdAt: new Date().toISOString() },
    { id: uuidv4(), type: 'expense', amount: 150.00, category: 'bills', date: format(subDays(today, 0), dateFormat), note: 'Internet bill', createdAt: new Date().toISOString() },
];

export const sampleStudySessions: StudySession[] = [
  { id: uuidv4(), subject: 'React Hooks', duration: 50, date: format(subDays(today, 3), dateFormat), notes: 'Studied useState and useEffect.', createdAt: new Date().toISOString() },
  { id: uuidv4(), subject: 'Tailwind CSS', duration: 90, date: format(subDays(today, 2), dateFormat), notes: 'Practiced responsive design grids.', createdAt: new Date().toISOString() },
  { id: uuidv4(), subject: 'Next.js App Router', duration: 60, date: format(subDays(today, 1), dateFormat), notes: 'Learning about server components.', createdAt: new Date().toISOString() },
  { id: uuidv4(), subject: 'TypeScript', duration: 45, date: format(subDays(today, 1), dateFormat), notes: 'Generics and advanced types.', createdAt: new Date().toISOString() },
  { id: uuidv4(), subject: 'React Hooks', duration: 25, date: format(today, dateFormat), notes: 'Pomodoro session on useReducer.', createdAt: new Date().toISOString() },
];

export const sampleWorkouts: Workout[] = [
  { id: uuidv4(), type: 'strength', duration: 45, date: format(subDays(today, 4), dateFormat), notes: 'Upper body day: Bench press, rows, shoulder press.', createdAt: new Date().toISOString() },
  { id: uuidv4(), type: 'cardio', duration: 30, date: format(subDays(today, 2), dateFormat), notes: '5k run on the treadmill.', createdAt: new Date().toISOString() },
  { id: uuidv4(), type: 'yoga', duration: 60, date: format(subDays(today, 1), dateFormat), notes: 'Vinyasa flow session.', createdAt: new Date().toISOString() },
];

const book1Id = uuidv4();
const book2Id = uuidv4();

export const sampleBooks: Book[] = [
  {
    id: book1Id,
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    category: "Self-Help",
    coverImage: "https://picsum.photos/seed/book1/300/400",
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: book2Id,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Productivity",
    coverImage: "https://picsum.photos/seed/book2/300/400",
    status: 'currently-reading',
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "History",
    coverImage: "https://picsum.photos/seed/book3/300/400",
    status: 'want-to-read',
    createdAt: new Date().toISOString(),
  },
];

export const sampleQuotes: Quote[] = [
  {
    id: uuidv4(),
    bookId: book1Id,
    text: "The desire for more positive experience is itself a negative experience. And, paradoxically, the acceptance of one’s negative experience is itself a positive experience.",
    notes: "This is a core concept of the book. Very impactful.",
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    bookId: book2Id,
    text: "You do not rise to the level of your goals. You fall to the level of your systems.",
    notes: "Focus on systems, not just goals.",
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    bookId: book2Id,
    text: "Every action you take is a vote for the type of person you wish to become.",
    createdAt: new Date().toISOString(),
  },
];


// New Data for Advanced Study Tracker
const physicsId = uuidv4();
const mathId = uuidv4();
const chemistryId = uuidv4();

export const sampleSubjects: Subject[] = [
    { id: physicsId, name: "Physics", level: 'intermediate', priority: 'high' },
    { id: mathId, name: "Mathematics", level: 'advanced', priority: 'high' },
    { id: chemistryId, name: "Chemistry", level: 'beginner', priority: 'medium' },
];

const physicsLesson1 = uuidv4();
const mathLesson1 = uuidv4();
const mathLesson2 = uuidv4();


export const sampleLessons: Lesson[] = [
    // Physics
    { id: physicsLesson1, subjectId: physicsId, title: "Newton's Laws of Motion", level: 'beginner', isCompleted: true },
    { id: uuidv4(), subjectId: physicsId, title: "Thermodynamics", level: 'intermediate', isCompleted: false },
    { id: uuidv4(), subjectId: physicsId, title: "Quantum Mechanics", level: 'advanced', isCompleted: false },
    // Math
    { id: mathLesson1, subjectId: mathId, title: "Differential Calculus", level: 'intermediate', isCompleted: true },
    { id: mathLesson2, subjectId: mathId, title: "Integral Calculus", level: 'intermediate', isCompleted: true },
    { id: uuidv4(), subjectId: mathId, title: "Linear Algebra", level: 'advanced', isCompleted: false },
];

export const sampleExams: Exam[] = [
    { id: uuidv4(), name: "Finals", date: format(addMonths(new Date(), 3), 'yyyy-MM-dd') }
];

export const sampleStudyPlan: StudyPlanEntry[] = [
    { id: uuidv4(), day: 1, subjectId: mathId, duration: 2, lessons: [
        { lessonId: mathLesson1, state: 'exercise', notes: 'Practice chain rule problems.' },
        { lessonId: mathLesson2, state: 'learn', notes: 'Review fundamental theorem.' }
    ]}, // Monday 2 hours
    { id: uuidv4(), day: 2, subjectId: physicsId, duration: 3, lessons: [
        { lessonId: physicsLesson1, state: 'learn', notes: 'Focus on the three laws and their real-world applications.' }
    ] }, // Tuesday 3 hours
    { id: uuidv4(), day: 3, subjectId: mathId, duration: 2, lessons: [] }, // Wednesday 2 hours
    { id: uuidv4(), day: 4, subjectId: physicsId, duration: 2, lessons: [] }, // Thursday 2 hours
    { id: uuidv4(), day: 5, subjectId: chemistryId, duration: 2, lessons: [] }, // Friday 2 hours
];
