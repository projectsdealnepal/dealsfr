"use client";

import React, { useEffect, useState } from "react";


interface TimerProps {
  date: string,
  simple?: boolean
}


export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}


const Timer: React.FC<TimerProps> = ({ date, simple }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isReady, setIsReady] = useState(false);

  const calculateTimeLeft = () => {
    const target = new Date(date).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  useEffect(() => {
    if (!date) return;

    const initial = calculateTimeLeft();
    setTimeLeft(initial);
    setIsReady(true);

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [date]);

  if (!isReady || !timeLeft) {
    return (
      <div className="flex gap-2">
        {["Days", "Hours", "Mins", "Secs"].map((label, i) => (
          <div
            key={i}
            className="opacity-80 text-destructive rounded-md px-3 py-2 flex flex-col items-center"
          >
            <span className="text-base font-bold">--</span>
            <span className="text-[10px] opacity-80 uppercase">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  const timeBoxes = [
    {
      label: timeLeft.days === 1 ? "d" : "d",
      value: timeLeft.days,
      label2: ":",
    },
    { label: "h", value: timeLeft.hours, label2: ":" },
    { label: "m", value: timeLeft.minutes },
    // { label: "s", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-2">
      {simple
        ? timeBoxes.map((item, index) => (
          <div key={index} className="-ml-1">
            <span className="font-bold text-sm text-primary">
              {String(item.value).padStart(2, "0")}
            </span>
            <span className="text-primary time-font text-sm ml-1">
              {item.label2}
            </span>
          </div>
        ))
        : timeBoxes.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <div
              key={index}
              className="relative text-primary rounded-md p-2 flex items-end gap-1"
            >
              <div className="absolute inset-0 bg-white/5 border backdrop-blur-md rounded-md shadow-sm -z-10"></div>

              <span className="font-bold font-mono text-xl">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="text-foreground/70 font-mono text-xl">
                {item.label}
              </span>
            </div>
            <span className="text-foreground/70 time-font text-lg">
              {item.label2}
            </span>
          </div>
        ))}
    </div>
  );
};

export default Timer;
