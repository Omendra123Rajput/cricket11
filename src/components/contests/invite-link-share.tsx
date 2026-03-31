"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy, Share2, Check } from "lucide-react";

interface InviteLinkShareProps {
  inviteCode: string;
  contestName: string;
}

export function InviteLinkShare({
  inviteCode,
  contestName,
}: InviteLinkShareProps) {
  const [copied, setCopied] = useState(false);
  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/invite/${inviteCode}`
      : `/invite/${inviteCode}`;

  async function handleCopyCode() {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    toast.success("Invite code copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(inviteUrl);
    toast.success("Invite link copied!");
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${contestName} on CrickContest`,
          text: `Join my fantasy cricket contest! Use code: ${inviteCode}`,
          url: inviteUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          readOnly
          value={inviteCode}
          className="text-center font-mono text-lg tracking-widest uppercase"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopyCode}
          className="shrink-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-primary" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleCopyLink}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy Link
        </Button>
        <Button className="flex-1" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}
