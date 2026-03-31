"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MatchCountdownProps {
  startTime: string;
  onComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(startTime: string): TimeLeft | null {
  const diff = new Date(startTime).getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-14 h-14 sm:w-16 sm:h-16">
        <div className="absolute inset-0 rounded-lg bg-muted/50 border border-border/50" />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl font-bold tabular-nums"
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export function MatchCountdown({ startTime, onComplete }: MatchCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    calculateTimeLeft(startTime)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft(startTime);
      setTimeLeft(remaining);
      if (!remaining) {
        clearInterval(timer);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, onComplete]);

  if (!timeLeft) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <span className="text-lg font-bold text-red-400 animate-pulse">
          Match Started!
        </span>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {timeLeft.days > 0 && (
        <>
          <CountdownUnit value={timeLeft.days} label="Days" />
          <span className="text-xl font-bold text-muted-foreground mt-[-16px]">:</span>
        </>
      )}
      <CountdownUnit value={timeLeft.hours} label="Hours" />
      <span className="text-xl font-bold text-muted-foreground mt-[-16px]">:</span>
      <CountdownUnit value={timeLeft.minutes} label="Mins" />
      <span className="text-xl font-bold text-muted-foreground mt-[-16px]">:</span>
      <CountdownUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
}
