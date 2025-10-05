
"use client";

import { useState, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import BookCard from "./components/BookCard";
import QuoteCard from "./components/QuoteCard";
import BookForm from "./components/BookForm";
import QuoteForm from "./components/QuoteForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Book, BookStatus } from "@/lib/types";

export default function BooksPage() {
  const { state } = useAppContext();
  const [view, setView] = useState<"library" | "book-quotes">("library");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<BookStatus | "all">("all");

  const [isBookFormOpen, setIsBookFormOpen] = useState(false);
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setView("book-quotes");
    setSearchTerm("");
  };

  const handleBackToLibrary = () => {
    setSelectedBook(null);
    setView("library");
  };

  const filteredQuotes = useMemo(() => {
    let quotes = state.quotes;
    if (view === "book-quotes" && selectedBook) {
      quotes = quotes.filter((q) => q.bookId === selectedBook.id);
    }
    if (searchTerm) {
      quotes = quotes.filter(
        (q) =>
          q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return quotes;
  }, [state.quotes, view, selectedBook, searchTerm]);

  const filteredBooks = useMemo(() => {
    let books = state.books;
    if (activeTab !== 'all') {
        books = books.filter(book => book.status === activeTab);
    }
    if (searchTerm) {
        books = books.filter(
        (book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    return books;
  }, [state.books, searchTerm, activeTab]);

  const bookCounts = useMemo(() => ({
    all: state.books.length,
    'want-to-read': state.books.filter(b => b.status === 'want-to-read').length,
    'currently-reading': state.books.filter(b => b.status === 'currently-reading').length,
    'completed': state.books.filter(b => b.status === 'completed').length,
  }), [state.books]);


  return (
    <div className="space-y-6">
      {view === "library" && (
        <>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h1 className="text-2xl font-bold">Book Library</h1>
            <div className="flex items-center gap-2">
                <div className="relative flex-1 md:flex-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search books..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={() => setIsBookFormOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Book
                </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BookStatus | 'all')}>
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({bookCounts.all})</TabsTrigger>
                <TabsTrigger value="want-to-read">Want to Read ({bookCounts['want-to-read']})</TabsTrigger>
                <TabsTrigger value="currently-reading">Reading ({bookCounts['currently-reading']})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({bookCounts.completed})</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab}>
                {filteredBooks.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 pt-4">
                    {filteredBooks.map((book) => (
                        <BookCard key={book.id} book={book} onSelect={handleSelectBook} />
                    ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center mt-4">
                        <h3 className="text-xl font-semibold">No books in this category</h3>
                        <p className="text-muted-foreground mt-2 mb-4">Add a new book to get started.</p>
                        <Button onClick={() => setIsBookFormOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Book
                        </Button>
                    </div>
                )}
            </TabsContent>
          </Tabs>
        </>
      )}

      {view === "book-quotes" && selectedBook && (
        <>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={handleBackToLibrary}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{selectedBook.title}</h1>
                    <p className="text-muted-foreground">by {selectedBook.author}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="relative flex-1 md:flex-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search quotes..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={() => setIsQuoteFormOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Quote
                </Button>
            </div>
          </div>
          {filteredQuotes.length > 0 ? (
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredQuotes.map((quote) => (
                    <QuoteCard key={quote.id} quote={quote} />
                ))}
             </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                <h3 className="text-xl font-semibold">No quotes yet for this book</h3>
                <p className="text-muted-foreground mt-2 mb-4">Add your first quote to capture your thoughts.</p>
                <Button onClick={() => setIsQuoteFormOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add First Quote
                </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={isBookFormOpen} onOpenChange={setIsBookFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
          </DialogHeader>
          <BookForm onFinished={() => setIsBookFormOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isQuoteFormOpen} onOpenChange={setIsQuoteFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Quote</DialogTitle>
          </DialogHeader>
          <QuoteForm 
            bookId={selectedBook?.id} 
            onFinished={() => setIsQuoteFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
