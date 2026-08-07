"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";

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
  'Home': { x: 5, y: 50 },
  'Experience': { x: 20, y: 15 },
  'Projects': { x: 18, y: 78 },
  'About': { x: 80, y: 18 },
  'Skills': { x: 82, y: 48 },
  'Contact': { x: 78, y: 78 }
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
  const dragOffset = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent, label: string) => {
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
      <nav className="fixed inset-0 z-50 overflow-visible">
        {navItems.map((item, index) => {
          const pos = positions[item.label] || defaultPositions[item.label];

          return (
            <a
              key={item.href}
              href={item.href}
              className={`bubble-nav-item hidden md:flex items-center justify-center font-semibold text-white drop-shadow-lg select-none ${
                item.size === "sm" ? "w-40 h-40 text-xl" :
                item.size === "lg" ? "w-56 h-56 text-4xl" :
                "w-44 h-44 text-2xl"
              } ${isDragging === item.label ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{
                animationDelay: `${index * 0.5}s`,
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: `translate(-50%, -50%)`,
              }}
              onMouseDown={(e) => handleMouseDown(e, item.label)}
            >
              <span>{item.label}</span>
            </a>
          );
        })}

        {/* Mobile Menu Button */}
        <div className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50">
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
          <div className="md:hidden fixed inset-0 z-40 bg-[#0F172A]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
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
          className="fixed bottom-4 right-4 bg-accent text-white px-4 py-2 rounded-lg shadow-lg hover:bg-accent-hover transition-colors z-50 text-sm font-semibold"
        >
          Reset Bubbles
        </button>
      </nav>
    </>
  );
}
