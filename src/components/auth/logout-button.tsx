"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/demo/use-demo";

export function LogoutButton() {
  const router = useRouter();
  const logout = useDemo((s) => s.logout);
  const [confirm, setConfirm] = useState(false);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setConfirm(true)}>
        <LogOut size={16} /> Chiqish
      </Button>

      {confirm && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setConfirm(false)} />
          <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[var(--width-shell)] rounded-t-[var(--radius-xl)] border-t border-border bg-surface p-5">
            <h3 className="text-base font-bold text-foreground">Chiqishni tasdiqlang</h3>
            <p className="mt-2 text-sm text-muted">Akkauntdan chiqmoqchimisiz?</p>
            <div className="mt-4 flex gap-2">
              <Button variant="danger" block onClick={handleLogout}>
                <LogOut size={16} /> Ha, chiqish
              </Button>
              <Button variant="ghost" onClick={() => setConfirm(false)}>
                Bekor
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
