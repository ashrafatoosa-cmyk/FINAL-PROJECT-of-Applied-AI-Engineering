"use client";

import { useEffect, useState } from "react";

export function MeshBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#fff1f8] transition-colors duration-700">
      <div 
        className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-30 animate-pulse-glow"
        style={{ 
          background: 'var(--color-brand-200)',
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      ></div>
      <div 
        className="absolute top-[20%] -right-[5%] w-[45%] h-[45%] rounded-full blur-[100px] opacity-20 animate-pulse-glow"
        style={{ 
          background: 'var(--color-brand-300)',
          animationDelay: '1s',
          transform: `translate(${mousePos.x * -1.5}px, ${mousePos.y * -1.5}px)`,
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      ></div>
      <div 
        className="absolute -bottom-[5%] left-[20%] w-[40%] h-[40%] rounded-full blur-[110px] opacity-25 animate-pulse-glow"
        style={{ 
          background: 'var(--color-brand-100)',
          animationDelay: '2s',
          transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)`,
          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      ></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
    </div>
  );
}
