"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Trophy, LogOut, User, Menu } from "lucide-react";
import { toast } from "sonner";

interface HeaderProps {
  user: {
    email?: string;
    user_metadata?: {
      display_name?: string;
      full_name?: string;
    };
  } | null;
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const displayName =
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/home" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold hidden sm:block">CrickContest</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/home"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            href="/matches"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Matches
          </Link>
          <Link
            href="/contests"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Contests
          </Link>
          <Link
            href="/analytics"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Analytics
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/profile">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle className="text-left">{displayName}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-sm"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-sm text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
