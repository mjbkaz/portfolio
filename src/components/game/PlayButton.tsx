"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Gamepad2 } from "lucide-react";
import { useBestScore } from "@/lib/game";

// The game's code is only downloaded when someone wants to play.
const loadGame = () => import("@/components/game/BubblePopGame");
const BubblePopGame = dynamic(loadGame, { ssr: false });

export default function PlayButton() {
  const [open, setOpen] = useState(false);
  const best = useBestScore();
  const preload = () => {
    void loadGame();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onPointerEnter={preload}
        onFocus={preload}
        className="group inline-flex cursor-pointer items-center gap-3 rounded-full border border-line bg-white/[0.03] py-1.5 pr-4 pl-1.5 text-sm text-fg-muted transition-colors duration-300 hover:border-accent/50 hover:text-fg"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-bg transition-transform duration-500 ease-out-expo group-hover:rotate-[-12deg] group-hover:scale-110">
          <Gamepad2 size={16} aria-hidden />
        </span>
        <span>
          Bored? Play <span className="font-semibold text-fg">Bubble Pop Rush</span>
        </span>
        {best > 0 && <span className="font-mono text-xs text-accent tabular-nums">best {best.toLocaleString("en-US")}</span>}
      </button>
      {open && <BubblePopGame onExit={() => setOpen(false)} />}
    </>
  );
}
