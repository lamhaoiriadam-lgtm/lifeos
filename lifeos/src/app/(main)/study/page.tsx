
"use client";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import ExamCountdown from "./components/ExamCountdown";
import SubjectCard from "./components/SubjectCard";
import LessonList from "./components/LessonList";
import SubjectForm from "./components/SubjectForm";
import ProgressCharts from "./components/ProgressCharts";
import StudyPlan from "./components/StudyPlan";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Subject } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

export default function StudyPage() {
  const { state } = useAppContext();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>(undefined);

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setIsFormOpen(true);
  };

  const handleAddNewSubject = () => {
    setEditingSubject(undefined);
    setIsFormOpen(true);
  };

  const handleFormFinished = () => {
    setIsFormOpen(false);
    setEditingSubject(undefined);
  };

  if (selectedSubject) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => setSelectedSubject(null)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Subjects
        </Button>
        <LessonList subject={selectedSubject} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ExamCountdown />
      
      <Separator className="my-8" />
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subjects</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button onClick={handleAddNewSubject}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Subject
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingSubject ? "Edit Subject" : "Add New Subject"}</DialogTitle>
                </DialogHeader>
                <SubjectForm subject={editingSubject} onFinished={handleFormFinished} />
            </DialogContent>
        </Dialog>
      </div>

      {state.subjects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {state.subjects.map((subject) => (
              <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onSelect={setSelectedSubject}
                  onEdit={handleEditSubject}
              />
              ))}
          </div>
      ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
              <h3 className="text-xl font-semibold">No subjects yet</h3>
              <p className="text-muted-foreground mt-2 mb-4">Add your first subject to get started.</p>
              <Button onClick={handleAddNewSubject}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Subject
              </Button>
          </div>
      )}

      <Separator className="my-8" />

      <div>
        <h1 className="text-2xl font-bold mb-4">Weekly Study Plan</h1>
        <StudyPlan />
      </div>
      
      <Separator className="my-8" />

      <div>
        <h1 className="text-2xl font-bold mb-4">Progress</h1>
        <ProgressCharts />
      </div>

    </div>
  );
}
