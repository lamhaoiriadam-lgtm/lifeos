
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { bookSchema } from "@/lib/schemas";
import { useAppContext } from "@/context/AppContext";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useCallback } from "react";
import { UploadCloud } from "lucide-react";
import Image from "next/image";

type BookFormProps = {
  onFinished: () => void;
};

export default function BookForm({ onFinished }: BookFormProps) {
  const { dispatch } = useAppContext();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      category: "",
      coverImage: "",
      status: "want-to-read",
    },
  });

  const handleFileChange = (file: File | null) => {
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        form.setError("coverImage", { type: "manual", message: "Image must be less than 2MB" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue("coverImage", result);
        form.clearErrors("coverImage");
      };
      reader.onerror = () => {
        form.setError("coverImage", { type: "manual", message: "Failed to read file" });
      };
      reader.readAsDataURL(file);
    }
  };

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files && event.dataTransfer.files[0];
    handleFileChange(file);
  }, []);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  function onSubmit(values: z.infer<typeof bookSchema>) {
    const bookData = {
      ...values,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    if (!values.coverImage) {
        bookData.coverImage = `https://picsum.photos/seed/${bookData.id}/300/400`;
    }

    dispatch({ type: "ADD_BOOK", payload: bookData });
    toast({
      title: "Book Added",
      description: `"${values.title}" has been added to your library.`,
    });
    onFinished();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Book Cover</FormLabel>
                    <FormControl>
                        <div 
                            className="relative flex justify-center items-center w-full h-48 rounded-md border-2 border-dashed border-muted-foreground/50 cursor-pointer hover:bg-muted/50 p-2"
                            onClick={() => document.getElementById('coverImage-input')?.click()}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                        >
                            {imagePreview ? (
                                <Image src={imagePreview} alt="Book cover preview" fill style={{ objectFit: "contain" }} className="rounded-md" />
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <UploadCloud className="mx-auto h-10 w-10" />
                                    <p>Click to upload or drag & drop</p>
                                    <p className="text-xs">PNG, JPG, WEBP (max. 2MB)</p>
                                </div>
                            )}
                             <Input 
                                id="coverImage-input"
                                type="file" 
                                className="hidden"
                                accept="image/png, image/jpeg, image/webp"
                                onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)} 
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="The Great Gatsby" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="F. Scott Fitzgerald" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Category / Genre</FormLabel>
                <FormControl>
                    <Input placeholder="Fiction" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="want-to-read">Want to Read</SelectItem>
                        <SelectItem value="currently-reading">Currently Reading</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        
        <Button type="submit" className="w-full">
          Add Book
        </Button>
      </form>
    </Form>
  );
}
