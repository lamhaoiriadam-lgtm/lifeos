
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, BookOpen, Check, Star } from "lucide-react";
import type { Book, BookStatus } from "@/lib/types";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
}

const statusConfig: { [key in BookStatus]: { label: string; icon: React.ElementType; color: string; badgeVariant: "default" | "secondary" | "outline" } } = {
    'want-to-read': { label: 'Want to Read', icon: Star, color: 'text-amber-500', badgeVariant: 'outline' },
    'currently-reading': { label: 'Reading', icon: BookOpen, color: 'text-primary', badgeVariant: 'secondary' },
    'completed': { label: 'Completed', icon: Check, color: 'text-green-500', badgeVariant: 'default' },
}

export default function BookCard({ book, onSelect }: BookCardProps) {
    const { dispatch } = useAppContext();

    const handleDelete = () => {
        dispatch({ type: 'DELETE_BOOK', payload: book.id });
    }

    const handleStatusChange = (status: BookStatus) => {
        dispatch({ type: 'UPDATE_BOOK', payload: { ...book, status } });
    }

    const currentStatus = statusConfig[book.status];

  return (
    <Card className="overflow-hidden group relative">
        <Badge variant={currentStatus.badgeVariant} className={cn("absolute top-2 left-2 z-10", currentStatus.color)}>
            <currentStatus.icon className="h-3 w-3 mr-1" />
            {currentStatus.label}
        </Badge>
      <div className="absolute top-1 right-1 z-10">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 bg-black/50 hover:bg-black/75 text-white rounded-full">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            {Object.entries(statusConfig).map(([statusKey, config]) => (
                                <DropdownMenuItem 
                                    key={statusKey}
                                    disabled={book.status === statusKey}
                                    onClick={() => handleStatusChange(statusKey as BookStatus)}
                                >
                                    <config.icon className="mr-2 h-4 w-4" />
                                    {config.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Book?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete "{book.title}" and all its associated quotes. Are you sure?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="cursor-pointer" onClick={() => onSelect(book)}>
        <CardContent className="p-0">
          <div className="aspect-[3/4] relative w-full">
              <Image
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1280px) 20vw, 16vw"
              />
          </div>
        </CardContent>
        <div className="p-2">
            <h3 className="font-bold text-sm leading-tight line-clamp-2">{book.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
        </div>
      </div>
    </Card>
  );
}
