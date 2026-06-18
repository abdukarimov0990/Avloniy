import { cn } from "@/lib/utils";

/**
 * MobileShell — butun ilovani mobil telefon kengligida (~430px) markazda ushlab turadi.
 * Desktopda ham telefon ramkasi ko'rinishida, mobilda esa to'liq ekran.
 */
export function MobileShell({
  children,
  className,
  noPadding = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Reels feed kabi to'liq ekranli sahifalar uchun ichki padding'ni o'chiradi */
  noPadding?: boolean;
}) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[var(--width-shell)] flex-col bg-background sm:my-0 sm:min-h-dvh sm:border-x sm:border-border">
      <div className={cn("flex flex-1 flex-col", !noPadding && "px-5", className)}>
        {children}
      </div>
    </div>
  );
}
