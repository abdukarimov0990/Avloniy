"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Sertifikatni chop etish / PDF saqlash tugmasi (chop etishda yashiriladi) */
export function PrintButton() {
  return (
    <div className="print:hidden">
      <Button size="md" block onClick={() => window.print()}>
        <Printer size={18} /> Chop etish / PDF saqlash
      </Button>
    </div>
  );
}
