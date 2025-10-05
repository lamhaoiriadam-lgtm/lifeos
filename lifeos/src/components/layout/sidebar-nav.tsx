"use client";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Home,
  CheckSquare,
  Target,
  DollarSign,
  BookOpen,
  Dumbbell,
  BrainCircuit,
  Settings,
  LogOut,
  PanelLeft,
  Library,
} from "lucide-react";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";

interface SidebarNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/habits", icon: Target, label: "Habits" },
  { href: "/finance", icon: DollarSign, label: "Finance" },
  { href: "/study", icon: BookOpen, label: "Study" },
  { href: "/fitness", icon: Dumbbell, label: "Fitness" },
  { href: "/books", icon: Library, label: "Books" },
];

export default function SidebarNav({ currentPage, onNavigate }: SidebarNavProps) {
  const { state: sidebarState } = useSidebar();
  const handleNavigation = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    onNavigate(href);
    window.history.pushState({}, '', href);
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <span className="text-lg font-semibold">LifeHQ</span>
          </div>
          {sidebarState === 'expanded' && <SidebarTrigger><PanelLeft /></SidebarTrigger>}
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={currentPage === item.href}
                tooltip={{ children: item.label, side: "right", align: "center" }}
              >
                <Link href={item.href} onClick={(e) => handleNavigation(e, item.href)}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={{ children: "Settings", side: "right", align: "center" }}
            >
              <Link href="#">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={{ children: "Log Out", side: "right", align: "center" }}
            >
              <Link href="#">
                <LogOut />
                <span>Log Out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
