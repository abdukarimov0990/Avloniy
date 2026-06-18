import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CourseForm } from "@/components/seller/course-form";

export default function NewCoursePage() {
  return (
    <div className="px-5 pb-6">
      <header className="flex items-center gap-3 py-5">
        <Link
          href="/studio"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-bold text-foreground">Yangi kurs</h1>
      </header>
      <CourseForm />
    </div>
  );
}
