"use client"
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // <-- Import this
const Loading = ({pageName = "DEELDEAL..."}) => {
    const pathname = usePathname();
     const routeName =  pathname?.split("/").filter(Boolean).pop()?.toUpperCase() || pageName  || "DEELDEAL...";
  const [visibleLetters, setVisibleLetters] = useState(0);
  const letters = routeName.split("");

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
    <div className="fixed top-0 right-0 min-w-[100%] ">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent">
      <div className="relative">
        {/* Walking border */}
       
        {/* Content */}
        <div className="relative flex space-x-2 px-8 py-6">
          {letters.map((letter, index) => (
            <div
              key={index}
              className={`text-6xl md:text-8xl font-bold transition-all duration-500 ${
                index < visibleLetters
                  ? "opacity-100 scale-100 animate-bounce"
                  : "opacity-0 scale-50"
              }`}
              style={{
                animationDelay: `${index * 0.1}s`,
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3)',
                backgroundSize: '300% 300%',
                animation: `${index < visibleLetters ? 'bounce' : ''} 0.6s ease-in-out ${index * 0.1}s, gradient 4s ease infinite`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {letter}
            </div>
          ))}
        </div>
      </div>
      
      
    </div>
    </div>
  
  );
};

export default Loading;
