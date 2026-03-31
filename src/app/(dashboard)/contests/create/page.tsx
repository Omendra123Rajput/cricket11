"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createContest } from "@/actions/contests";
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
import { Trophy, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateContestPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createContest(formData);

    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Contest created! Share the invite link with friends.");
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
        <h1 className="text-2xl font-bold">Create Contest</h1>
      </div>

      <Card className="glass border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>New League</CardTitle>
              <CardDescription>
                Create a private contest for your friends
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Contest Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Office IPL League 2026"
                required
                minLength={3}
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground">
                This will be visible to all members
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_members">Max Members</Label>
              <Input
                id="max_members"
                name="max_members"
                type="number"
                defaultValue={20}
                min={2}
                max={50}
              />
              <p className="text-xs text-muted-foreground">
                Between 2 and 50 friends
              </p>
            </div>

            <div className="rounded-lg bg-muted/30 p-4 space-y-2">
              <h4 className="text-sm font-medium">Scoring Rules</h4>
              <p className="text-xs text-muted-foreground">
                Default Dream11-style scoring will be applied. Custom scoring
                coming soon.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span>Run: +1 pt</span>
                <span>Wicket: +25 pts</span>
                <span>Captain: 2x</span>
                <span>Vice Captain: 1.5x</span>
                <span>1st Place: +3 season pts</span>
                <span>2nd Place: +2 season pts</span>
              </div>
            </div>

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Contest
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
