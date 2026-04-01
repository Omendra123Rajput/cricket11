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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Sync fixtures: keeps external_ids current as new IPL matches are published
  const fixtureRes = await fetch(`${baseUrl}/api/cricket/sync-fixtures`, {
    headers: { authorization: `Bearer ${cronSecret ?? ""}` },
  });
  const fixtureData = fixtureRes.ok ? await fixtureRes.json() : { error: "fixture sync failed" };

  return NextResponse.json({
    ok: true,
    tasks: ["fixture_sync"],
    fixture_sync: fixtureData,
    timestamp: new Date().toISOString(),
  });
}
