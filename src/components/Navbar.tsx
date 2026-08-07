"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X, Move, MousePointerClick } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

const navItems = [
  { label: "Home", href: "#home", size: "md", position: "left" },
  { label: "Experience", href: "#experience", size: "lg", position: "left" },
  { label: "Projects", href: "#projects", size: "md", position: "left" },
  { label: "About", href: "#about", size: "md", position: "right" },
  { label: "Skills", href: "#skills", size: "lg", position: "right" },
  { label: "Contact", href: "#contact", size: "md", position: "right" },
];

const defaultPositions: Record<string, Position> = {
  'Home': { x: 38, y: 18 },
  'Experience': { x: 62, y: 10 },
  'Projects': { x: 80, y: 22 },
  'About': { x: 52, y: 34 },
  'Skills': { x: 74, y: 44 },
  'Contact': { x: 90, y: 30 }
};

export default function Navbar() {
  const [positions, setPositions] = useState<Record<string, Position>>(defaultPositions);

  useEffect(() => {
    const saved = localStorage.getItem("bubblePositions");
    if (saved) {
      try {
        setPositions(JSON.parse(saved));
      } catch {
        // ignore malformed saved positions
      }
    }
  }, []);

  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dragMode, setDragMode] = useState(false);
  const dragOffset = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent, label: string) => {
    if (!dragMode) return; // click mode: allow link navigation, no drag
    e.preventDefault();
    const bubble = e.currentTarget as HTMLElement;
    const rect = bubble.getBoundingClientRect();
    
    // Calculate offset from the click point to bubble center
    const bubbleCenterX = rect.left + rect.width / 2;
    const bubbleCenterY = rect.top + rect.height / 2;
    const offsetX = e.clientX - bubbleCenterX;
    const offsetY = e.clientY - bubbleCenterY;
    
    dragOffset.current = { x: offsetX, y: offsetY };
    setIsDragging(label);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Calculate position maintaining the initial offset
    const newX = (((e.clientX - (dragOffset.current?.x || 0)) / windowWidth) * 100);
    const newY = (((e.clientY - (dragOffset.current?.y || 0)) / windowHeight) * 100);

    setPositions(prev => {
      const newPositions = {
        ...prev,
        [isDragging]: { x: newX, y: newY }
      };
      // Save to localStorage
      localStorage.setItem('bubblePositions', JSON.stringify(newPositions));
      return newPositions;
    });
  };

  const handleMouseUp = () => {
    setIsDragging(null);
    dragOffset.current = null;
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove as any);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const resetPositions = () => {
    setPositions(defaultPositions);
    localStorage.removeItem('bubblePositions');
  };

  return (
    <>
      {/* Floating Navigation Bubbles */}
      <nav className="fixed inset-0 z-50 overflow-visible pointer-events-none">
        {navItems.map((item, index) => {
          const pos = positions[item.label] || defaultPositions[item.label];
          const safeX = Math.min(88, Math.max(12, pos.x));
          const safeY = Math.min(86, Math.max(8, pos.y));

          return (
            <a
              key={item.href}
              href={item.href}
              className={`bubble-nav-item hidden md:flex pointer-events-auto items-center justify-center font-semibold text-white drop-shadow-lg select-none ${
                item.size === "sm" ? "w-40 h-40 text-xl" :
                item.size === "lg" ? "w-56 h-56 text-4xl" :
                "w-44 h-44 text-2xl"
              } ${isDragging === item.label ? 'cursor-grabbing' : dragMode ? 'cursor-grab' : 'cursor-pointer'}`}
              style={{
                animationDelay: `${index * 0.5}s`,
                left: `${safeX}%`,
                top: `${safeY}%`,
                transform: `translate(-50%, -50%)`,
              }}
              onMouseDown={(e) => handleMouseDown(e, item.label)}
              onClick={(e) => {
                if (dragMode) e.preventDefault();
              }}
            >
              <span>{item.label}</span>
            </a>
          );
        })}

        {/* Mobile Menu Button */}
        <div className="md:hidden pointer-events-auto fixed top-2 right-2 z-50">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="bubble-nav-item w-16 h-16 flex items-center justify-center gap-2"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-40 pointer-events-auto bg-[#0F172A]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{ animationDelay: `${index * 0.05}s` }}
                className="text-2xl font-heading font-semibold text-[#F8FAFC] hover:text-[#22C55E] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}

        {/* Reset Button */}
        <button
          onClick={resetPositions}
          className="hidden md:block pointer-events-auto fixed bottom-4 right-4 bg-accent text-white px-4 py-2 rounded-lg shadow-lg hover:bg-accent-hover transition-colors z-50 text-sm font-semibold"
        >
          Reset Bubbles
        </button>

        {/* Drag Mode Toggle */}
        <div className="hidden md:block pointer-events-auto fixed bottom-4 right-40 z-50 group">
          <button
            onClick={() => setDragMode((v) => !v)}
            aria-pressed={dragMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-colors z-50 text-sm font-semibold ${
              dragMode
                ? "bg-[#22C55E] text-[#0F172A] hover:bg-[#16A34A]"
                : "bg-[#1A2332] text-[#94A3B8] border border-[#475569]/40 hover:border-[#22C55E]/50 hover:text-[#22C55E]"
            }`}
          >
            {dragMode ? <Move size={16} /> : <MousePointerClick size={16} />}
            {dragMode ? "Drag Mode: ON" : "Drag Mode: OFF"}
          </button>
          {/* Tooltip */}
          <span className="pointer-events-none absolute right-0 bottom-full mb-2 w-56 rounded-lg bg-[#0F172A] border border-[#475569]/40 px-3 py-2 text-xs text-[#F8FAFC] opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 z-50 shadow-xl">
            {dragMode
              ? "Drag the bubbles to rearrange them. Clicking won't navigate. Toggle OFF to make bubbles clickable links again."
              : "Bubbles are clickable links now and can't be dragged. Toggle ON to rearrange them."}
          </span>
        </div>
      </nav>
    </>
  );
}
