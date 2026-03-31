import { NextResponse } from "next/server";

// Single multiplexed cron endpoint
// Vercel free tier: runs daily at 06:00 UTC
// Live score sync is handled via client-side polling (see Phase 5)
export async function GET(request: Request) {
  // Verify CRON_SECRET
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Implement schedule refresh, match status checks
  // Badge evaluation and streaks are handled in process-match endpoint

  return NextResponse.json({
    ok: true,
    tasks: ["schedule_refresh", "cleanup"],
    timestamp: new Date().toISOString(),
  });
}
