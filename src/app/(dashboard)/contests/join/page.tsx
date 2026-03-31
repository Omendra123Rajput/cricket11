"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { joinContest } from "@/actions/contests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Users, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function JoinContestPage() {
  const searchParams = useSearchParams();
  const prefillCode = searchParams.get("code") || "";
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await joinContest(formData);

    setLoading(false);

    if (result.error && !result.data) {
      toast.error(result.error);
      return;
    }

    if (result.error && result.data) {
      // Already a member
      toast.info(result.error);
      router.push(`/contests/${result.data.id}`);
      return;
    }

    toast.success(`Joined "${result.data!.name}" successfully!`);
    router.push(`/contests/${result.data!.id}`);
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/contests">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Join Contest</h1>
      </div>

      <Card className="glass border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div>
              <CardTitle>Enter Invite Code</CardTitle>
              <CardDescription>
                Get the code from your friend who created the contest
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="invite_code">Invite Code</Label>
              <Input
                id="invite_code"
                name="invite_code"
                placeholder="e.g., ABCD1234"
                defaultValue={prefillCode}
                required
                minLength={6}
                maxLength={12}
                className="text-center text-lg tracking-widest uppercase font-mono"
              />
              <p className="text-xs text-muted-foreground">
                8-character code, case insensitive
              </p>
            </div>

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Join Contest
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
