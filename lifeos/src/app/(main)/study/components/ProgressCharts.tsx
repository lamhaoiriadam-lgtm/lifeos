
"use client";

import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { StudyLevel } from "@/lib/types";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const levelOrder: StudyLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];

export default function ProgressCharts() {
  const { state } = useAppContext();

  const overallProgressData = state.subjects.map(subject => {
    const subjectLessons = state.lessons.filter(l => l.subjectId === subject.id);
    const completed = subjectLessons.filter(l => l.isCompleted).length;
    const total = subjectLessons.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    return { name: subject.name, progress: percentage };
  });

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Overall Subject Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={overallProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip />
              <Legend />
              <Bar dataKey="progress" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {state.subjects.map(subject => {
        const subjectLessons = state.lessons.filter(l => l.subjectId === subject.id);
        const levelData = levelOrder.map(level => ({
            name: level,
            value: subjectLessons.filter(l => l.level === level && l.isCompleted).length
        })).filter(d => d.value > 0);

        return (
            <Card key={subject.id}>
                <CardHeader>
                    <CardTitle>{subject.name}: Completed Lessons by Level</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={levelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                {levelData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        )
      })}
    </div>
  );
}
