"use client"
import { useState, useEffect } from "react";

const Loading = () => {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const letters = "DEELDEAL...".split("");

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLetters((prev) => {
        if (prev >= letters.length) {
          // Reset animation after completion
          setTimeout(() => setVisibleLetters(0), 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [letters.length]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent">
      <div className="flex space-x-2">
        {letters.map((letter, index) => (
          <div
            key={index}
            className={`text-6xl md:text-8xl font-bold text-white transition-all duration-500 ${
              index < visibleLetters
                ? "opacity-100 scale-100 animate-bounce"
                : "opacity-0 scale-50"
            }`}
            style={{
              animationDelay: `${index * 0.1}s`,
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
