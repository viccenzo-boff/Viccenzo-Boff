import { ModeToggle } from "@/components/custom/mode-toggle";

export function SiteHeader() {
  return (
    <div className="sticky top-0 z-50 flex justify-end border-b border-border bg-background/80 px-6 py-2 backdrop-blur-sm lg:px-8">
      <ModeToggle />
    </div>
  );
}
