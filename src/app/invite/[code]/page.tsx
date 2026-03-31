import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, Users } from "lucide-react";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If logged in, redirect to join page with code pre-filled
  if (user) {
    redirect(`/contests/join?code=${code}`);
  }

  // Look up contest name for display (using service role isn't available here,
  // but we can show a generic invite page for unauthenticated users)
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <Card className="glass border-border/50 w-full max-w-md relative z-10">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Trophy className="w-7 h-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">You&apos;re Invited!</CardTitle>
          <CardDescription className="text-base">
            A friend invited you to join their fantasy cricket contest on
            CrickContest
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="py-4 px-4 rounded-xl bg-muted/50 text-center">
            <div className="text-xs text-muted-foreground mb-1">
              Invite Code
            </div>
            <div className="font-mono text-2xl tracking-[0.3em] font-bold">
              {code.toUpperCase()}
            </div>
          </div>

          <div className="space-y-3">
            <Link href={`/login?next=/contests/join?code=${code}`}>
              <Button className="w-full h-11" size="lg">
                Sign In to Join
              </Button>
            </Link>
            <Link href={`/signup?next=/contests/join?code=${code}`}>
              <Button variant="outline" className="w-full h-11" size="lg">
                <Users className="w-4 h-4 mr-2" />
                Create Account & Join
              </Button>
            </Link>
          </div>

          <div className="rounded-lg bg-muted/30 p-3 space-y-1.5">
            <h4 className="text-xs font-medium text-muted-foreground">
              What is CrickContest?
            </h4>
            <p className="text-xs text-muted-foreground">
              Free fantasy cricket for friends. Pick your dream IPL team, compete
              across the season, and crown a champion. No payments required.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
