"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Module-level flag: only the true first mount (a fresh page load / refresh)
// should play the splash. Client-side navigation never remounts the layout,
// so this stays true and the video won't replay on internal link clicks.
let splashPlayed = false;

export default function LoadingVideo() {
  const [show, setShow] = useState(() => !splashPlayed);
  const [exiting, setExiting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    splashPlayed = true;

    const video = videoRef.current;
    if (!video) {
      setShow(false);
      return;
    }

    const finish = () => {
      setExiting(true);
      // Let the fade-out finish, then unmount entirely.
      setTimeout(() => setShow(false), 800);
    };

    video.addEventListener("ended", finish);
    video.addEventListener("error", finish);

    const onCanPlay = () => {
      video.play().catch(finish);
    };
    video.addEventListener("canplay", onCanPlay);

    // Safety net in case "ended" never fires (e.g. stalled video).
    const safety = setTimeout(finish, 15000);

    return () => {
      video.removeEventListener("ended", finish);
      video.removeEventListener("error", finish);
      video.removeEventListener("canplay", onCanPlay);
      clearTimeout(safety);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          aria-hidden
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
  );
}
