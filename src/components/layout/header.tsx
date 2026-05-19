import { Bell } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6 shrink-0">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="通知"
        >
          <Bell className="h-5 w-5" />
        </button>
        <LogoutButton />
      </div>
    </header>
  );
}
