import { IconCloud } from "@/components/ui/interactive-icon-cloud"

const slugs = [
  "typescript",
  "javascript",
  "react",
  "vue",
  "php",
  "laravel",
  "mysql",
  "postgresql",
  "html5",
  "css3",
  "tailwindcss",
  "git",
  "github",
  "vercel",
  "nextdotjs",
  "npm",
  "vite",
  "bootstrap",
  "docker",
  "figma",
]

export function IconCloudDemo() {
  return (
    <div className="relative size-full overflow-hidden">
      <IconCloud iconSlugs={slugs} />
    </div>
  )
}