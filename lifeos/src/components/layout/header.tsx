"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Home, User } from "lucide-react";
import { usePathname } from 'next/navigation';

const pageTitles: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/tasks': 'Task Manager',
  '/habits': 'Habit Tracker',
  '/finance': 'Finance Tracker',
  '/study': 'Study Tracker',
  '/fitness': 'Fitness Logger',
  '/books': 'Book Tracker',
};

export default function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'LifeHQ';

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://picsum.photos/seed/user/100/100" alt="User Avatar" />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
