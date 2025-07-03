"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const shapes = [
  { style: "w-24 h-24 rounded-full bg-violet-300/50", animation: "animate-float-1" },
  { style: "w-32 h-32 rounded-2xl bg-pink-300/50", animation: "animate-float-2" },
  { style: "w-20 h-20 rounded-lg bg-yellow-200/50", animation: "animate-float-3" },
  { style: "w-16 h-16 rounded-full bg-violet-200/50", animation: "animate-float-4" },
  { style: "w-28 h-28 rounded-3xl bg-pink-200/50", animation: "animate-float-1" },
  { style: "w-24 h-24 rounded-full bg-yellow-300/50", animation: "animate-float-2" },
];

const animationStyles = `
  @keyframes float {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
    100% { transform: translateY(0px) rotate(360deg); }
  }
  .animate-float-1 { animation: float 25s ease-in-out infinite; }
  .animate-float-2 { animation: float 20s ease-in-out infinite; }
  .animate-float-3 { animation: float 30s ease-in-out infinite; }
  .animate-float-4 { animation: float 15s ease-in-out infinite; }
`;

export function FloatingShapes() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
      <style>{animationStyles}</style>
      {shapes.map((shape, index) => (
        <div
          key={index}
          className={cn("absolute blur-xl opacity-70", shape.style, shape.animation)}
          style={{
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 80}%`,
          }}
        />
      ))}
    </div>
  );
}
