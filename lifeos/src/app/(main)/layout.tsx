
"use client";

import { useState } from 'react';
import Header from '@/components/layout/header';
import SidebarNav from '@/components/layout/sidebar-nav';
import { Sidebar } from '@/components/ui/sidebar';
import DashboardPage from './dashboard/page';
import TasksPage from './tasks/page';
import HabitsPage from './habits/page';
import FinancePage from './finance/page';
import StudyPage from './study/page';
import FitnessPage from './fitness/page';
import BooksPage from './books/page';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const pageComponents: { [key: string]: React.ComponentType } = {
  '/dashboard': DashboardPage,
  '/tasks': TasksPage,
  '/habits': HabitsPage,
  '/finance': FinancePage,
  '/study': StudyPage,
  '/fitness': FitnessPage,
  '/books': BooksPage,
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(pathname);

  return (
    <>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="inset" collapsible="icon">
          <SidebarNav currentPage={currentPage} onNavigate={setCurrentPage} />
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {Object.entries(pageComponents).map(([path, PageComponent]) => (
              <div key={path} className={cn(currentPage !== path && 'hidden')}>
                <PageComponent />
              </div>
            ))}
          </main>
        </div>
      </div>
    </>
  );
}
