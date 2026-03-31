import { SEASON_POINTS } from "@/lib/utils/constants";

export interface RankedUser {
  userId: string;
  fantasyPoints: number;
  rank: number;
  positionPoints: number;
}

export function rankUsersForMatch(
  users: { userId: string; fantasyPoints: number }[]
): RankedUser[] {
  // Sort by fantasy points descending
  const sorted = [...users].sort(
    (a, b) => b.fantasyPoints - a.fantasyPoints
  );

  return sorted.map((user, index) => {
    const rank = index + 1;
    let positionPoints: number;

    switch (rank) {
      case 1:
        positionPoints = SEASON_POINTS.rank1;
        break;
      case 2:
        positionPoints = SEASON_POINTS.rank2;
        break;
      default:
        positionPoints = SEASON_POINTS.rankOther;
        break;
    }

    return {
      userId: user.userId,
      fantasyPoints: user.fantasyPoints,
      rank,
      positionPoints,
    };
  });
}
