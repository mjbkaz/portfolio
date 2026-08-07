"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Module-level flag: only the true first mount (a fresh page load / refresh)
// should play the splash. Client-side navigation never remounts the layout,
// so this stays true and the video won't replay on internal link clicks.
let splashPlayed = false;

const L_GLOW = {
  width: 100,
  height: 100,
};

export default function LoadingVideo() {
  const [show, setShow] = useState(() => !splashPlayed);
  const [exiting, setExiting] = useState(false);
  const [reveal, setReveal] = useState(false); // start the "L -> tech stack" flight
  const videoRef = useRef<HTMLVideoElement>(null);
  const [from, setFrom] = useState({ x: 0, y: 0 });
  const [to, setTo] = useState({ x: 0, y: 0 });

  useEffect(() => {
    splashPlayed = true;

    const video = videoRef.current;
    if (!video) {
      setShow(false);
      return;
    }

    const finish = () => {
      setExiting(true); // fade the black overlay out, revealing the page

      // Where does the "L" start (viewport center) and fly to (tech stack)?
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const el = document.getElementById("tech-stack");
      let tx = cx;
      let ty = cy;
      if (el) {
        const r = el.getBoundingClientRect();
        tx = r.left + r.width / 2;
        ty = r.top + r.height / 2;
      }
      setFrom({ x: cx, y: cy });
      setTo({ x: tx, y: ty });
      setReveal(true);

      // Unmount overlay once the flight is done.
      setTimeout(() => setShow(false), 1300);
    };

    video.addEventListener("ended", finish);
    video.addEventListener("error", finish);

    const onCanPlay = () => {
      video.play().catch(finish);
    };
    video.addEventListener("canplay", onCanPlay);

    const safety = setTimeout(finish, 15000);

    return () => {
      video.removeEventListener("ended", finish);
      video.removeEventListener("error", finish);
      video.removeEventListener("canplay", onCanPlay);
      clearTimeout(safety);
    };
  }, []);

  const flair = 40; // half the "L" glyph size

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none" aria-hidden>
      <AnimatePresence>
        {show && (
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 1 }}
            animate={{ opacity: exiting ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <video
              ref={videoRef}
              src="/loadingstate.mp4"
              autoPlay
              muted
              loop={false}
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* The "L": appears instantly at center, then travels to the tech stack */}
      <AnimatePresence>
        {reveal && (
          <motion.div
            className="absolute flex items-center justify-center"
            style={{
              width: L_GLOW.width,
              height: L_GLOW.height,
              marginLeft: -L_GLOW.width / 2,
              marginTop: -L_GLOW.height / 2,
            }}
            initial={{ left: from.x, top: from.y, scale: 0.3, opacity: 0.9 }}
            animate={{
              left: to.x,
              top: to.y,
              scale: [0.3, 1, 0.5],
              opacity: [0.9, 1, 0],
            }}
            transition={{ duration: 1.1, times: [0, 0.2, 1], ease: "easeInOut" }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(239,68,68,0.55) 0%, rgba(239,68,68,0.25) 40%, transparent 70%)",
                filter: "blur(14px)",
              }}
            />
            <span
              className="text-[#EF4444] font-heading font-bold leading-none"
              style={{
                fontSize: 96,
                filter:
                  "drop-shadow(0 0 22px rgba(239,68,68,1)) drop-shadow(0 0 60px rgba(239,68,68,0.9)) drop-shadow(0 0 110px rgba(239,68,68,0.7))",
                textShadow:
                  "0 0 30px rgba(239,68,68,1), 0 0 60px rgba(239,68,68,0.8)",
              }}
            >
              {"</>"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}