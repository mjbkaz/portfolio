// Server-safe: imported by the root layout (a Server Component).

export const INTRO_STORAGE_KEY = "mjc-intro-seen";

/** Runs before paint (inlined in <head>) so returning visitors skip the intro. */
export const introBootScript = `try{if(sessionStorage.getItem("${INTRO_STORAGE_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.intro="seen"}}catch(e){}`;
