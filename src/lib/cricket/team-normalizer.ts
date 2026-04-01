// Maps CricAPI full team names → our DB abbreviations
// Handles both current and legacy spellings (e.g., "Bangalore" vs "Bengaluru")

const TEAM_NAME_TO_CODE: Record<string, string> = {
  "Mumbai Indians": "MI",
  "Chennai Super Kings": "CSK",
  "Royal Challengers Bengaluru": "RCB",
  "Royal Challengers Bangalore": "RCB",
  "Kolkata Knight Riders": "KKR",
  "Delhi Capitals": "DC",
  "Punjab Kings": "PBKS",
  "Rajasthan Royals": "RR",
  "Sunrisers Hyderabad": "SRH",
  "Gujarat Titans": "GT",
  "Lucknow Super Giants": "LSG",
};

// Converts full CricAPI team name → DB abbreviation (e.g., "Mumbai Indians" → "MI")
export function normalizeTeamName(name: string): string | null {
  return TEAM_NAME_TO_CODE[name.trim()] ?? null;
}

// Parses bracket notation from /cricScore endpoint: "Mumbai Indians [MI]" → "MI"
export function extractTeamCode(teamString: string): string | null {
  const match = teamString.match(/\[([A-Z]+)\]$/);
  if (match) return match[1];
  // Fall back to full name lookup
  return normalizeTeamName(teamString);
}
