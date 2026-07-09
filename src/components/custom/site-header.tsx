import { ModeToggle } from "@/components/custom/mode-toggle";
import { SearchCommand } from "@/components/custom/search-command";

export function SiteHeader() {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/80 px-6 py-2 backdrop-blur-sm lg:px-8">
      <SearchCommand />
      <ModeToggle />
    </div>
  );
}
