"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/demo/use-demo";

export function LogoutButton() {
  const router = useRouter();
  const logout = useDemo((s) => s.logout);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      <LogOut size={16} /> Chiqish
    </Button>
  );
}
