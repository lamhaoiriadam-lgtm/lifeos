"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

export default function WelcomeHeader() {
  const [currentDate, setCurrentDate] = useState<string | null>(null);

  useEffect(() => {
    setCurrentDate(format(new Date(), "EEEE, MMMM do"));
  }, []);

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight">Welcome to LifeHQ</h1>
      <p className="text-muted-foreground">{currentDate || "Loading date..."}</p>
    </div>
  );
}
