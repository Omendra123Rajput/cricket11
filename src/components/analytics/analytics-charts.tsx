"use client";

import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChartDataPoint {
  label: string;
  points: number;
  match: string;
}

interface AnalyticsChartsProps {
  data: ChartDataPoint[];
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const maxPoints = Math.max(...data.map((d) => d.points), 1);
  const avg =
    data.length > 0
      ? Math.round(data.reduce((s, d) => s + d.points, 0) / data.length)
      : 0;

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Bar Chart */}
        <div className="flex items-end gap-1.5 h-40 sm:h-48">
          {data.map((d, i) => {
            const height = maxPoints > 0 ? (d.points / maxPoints) * 100 : 0;
            const isAboveAvg = d.points >= avg;

            return (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <div className="flex-1 flex flex-col items-center gap-1 cursor-pointer">
                    <span className="text-[9px] tabular-nums text-muted-foreground">
                      {d.points}
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      className={`w-full rounded-t-md min-h-[4px] ${
                        isAboveAvg
                          ? "bg-primary/70 hover:bg-primary"
                          : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      } transition-colors`}
                    />
                    <span className="text-[9px] text-muted-foreground truncate w-full text-center">
                      {d.label}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold text-xs">{d.match}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.points} fantasy points
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Average line label */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-primary/30 border-dashed" />
          <span>Avg: {avg} pts</span>
          <div className="h-px flex-1 bg-primary/30 border-dashed" />
        </div>
      </div>
    </TooltipProvider>
  );
}
