// Robust player name matching: handles CricAPI shortened/formatted names vs DB canonical names
// Uses cascading strategy: exact → alias → Jaro-Winkler fuzzy → last-name (surname >= 5 chars only)

// Common CricAPI name format differences for IPL players
export const PLAYER_ALIASES: Record<string, string> = {
  // Dhoni variants
  "ms dhoni": "MS Dhoni",
  "m dhoni": "MS Dhoni",
  "m s dhoni": "MS Dhoni",
  // Jadeja
  "ra jadeja": "Ravindra Jadeja",
  "r jadeja": "Ravindra Jadeja",
  "jadeja": "Ravindra Jadeja",
  // Bumrah
  "j bumrah": "Jasprit Bumrah",
  "jasprit bumrah": "Jasprit Bumrah",
  // Suryakumar
  "sk yadav": "Suryakumar Yadav",
  "suryakumar yadav": "Suryakumar Yadav",
  // Faf du Plessis
  "f du plessis": "Faf du Plessis",
  "faf du plessis": "Faf du Plessis",
  // KL Rahul
  "kl rahul": "KL Rahul",
  "k rahul": "KL Rahul",
  "k l rahul": "KL Rahul",
  // Ishan Kishan
  "i kishan": "Ishan Kishan",
  // Hardik Pandya
  "h pandya": "Hardik Pandya",
  "hardik pandya": "Hardik Pandya",
  // Krunal Pandya
  "k pandya": "Krunal Pandya",
  // Virat Kohli
  "v kohli": "Virat Kohli",
  "virat kohli": "Virat Kohli",
  // Rohit Sharma
  "r sharma": "Rohit Sharma",
  "rohit sharma": "Rohit Sharma",
};

export interface MatchResult {
  playerId: number;
  playerName: string;
  confidence: "exact" | "alias" | "fuzzy" | "lastword";
  score: number; // 0–1, 1 = perfect
}

// Jaro similarity (pure math, zero deps)
function jaro(s1: string, s2: string): number {
  if (s1 === s2) return 1;
  const len1 = s1.length;
  const len2 = s2.length;
  const matchDist = Math.floor(Math.max(len1, len2) / 2) - 1;
  const s1Matches = new Array(len1).fill(false);
  const s2Matches = new Array(len2).fill(false);
  let matches = 0;
  let transpositions = 0;
  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchDist);
    const end = Math.min(i + matchDist + 1, len2);
    for (let j = start; j < end; j++) {
      if (s2Matches[j] || s1[i] !== s2[j]) continue;
      s1Matches[i] = true;
      s2Matches[j] = true;
      matches++;
      break;
    }
  }
  if (matches === 0) return 0;
  let k = 0;
  for (let i = 0; i < len1; i++) {
    if (!s1Matches[i]) continue;
    while (!s2Matches[k]) k++;
    if (s1[i] !== s2[k]) transpositions++;
    k++;
  }
  return (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3;
}

// Jaro-Winkler (boosts score for common prefix, up to 4 chars)
function jaroWinkler(s1: string, s2: string): number {
  const j = jaro(s1, s2);
  let prefix = 0;
  for (let i = 0; i < Math.min(4, Math.min(s1.length, s2.length)); i++) {
    if (s1[i] === s2[i]) prefix++;
    else break;
  }
  return j + prefix * 0.1 * (1 - j);
}

// Find the best DB player match for a given API player name.
// Returns null if no match is confident enough — caller should log the apiName.
export function findBestPlayerMatch(
  apiName: string,
  dbPlayers: { id: number; name: string }[]
): MatchResult | null {
  const normalizedApi = apiName.trim().toLowerCase();

  // 1. Exact match (case-insensitive)
  for (const p of dbPlayers) {
    if (p.name.toLowerCase() === normalizedApi) {
      return { playerId: p.id, playerName: p.name, confidence: "exact", score: 1 };
    }
  }

  // 2. Alias table lookup → exact match against resolved name
  const aliasResolved = PLAYER_ALIASES[normalizedApi];
  if (aliasResolved) {
    const aliasLower = aliasResolved.toLowerCase();
    for (const p of dbPlayers) {
      if (p.name.toLowerCase() === aliasLower) {
        return { playerId: p.id, playerName: p.name, confidence: "alias", score: 1 };
      }
    }
  }

  // 3. Jaro-Winkler fuzzy match (threshold: 0.88)
  let bestScore = 0;
  let bestPlayer: { id: number; name: string } | null = null;
  for (const p of dbPlayers) {
    const score = jaroWinkler(normalizedApi, p.name.toLowerCase());
    if (score > bestScore) {
      bestScore = score;
      bestPlayer = p;
    }
  }
  if (bestScore >= 0.88 && bestPlayer) {
    return { playerId: bestPlayer.id, playerName: bestPlayer.name, confidence: "fuzzy", score: bestScore };
  }

  // 4. Last-word (surname) match — only for surnames >= 5 chars to avoid "Ali" collisions
  const apiLastWord = normalizedApi.split(" ").pop() ?? "";
  if (apiLastWord.length >= 5) {
    const surnameMatches = dbPlayers.filter(
      (p) => p.name.toLowerCase().split(" ").pop() === apiLastWord
    );
    if (surnameMatches.length === 1) {
      return { playerId: surnameMatches[0].id, playerName: surnameMatches[0].name, confidence: "lastword", score: 0.7 };
    }
  }

  return null;
}
