import { Download } from "lucide-react";

import { ModeToggle } from "@/components/custom/mode-toggle";
import { SearchCommand } from "@/components/custom/search-command";
import { Button } from "@/components/ui/button";
import { CV_PDF_PATH } from "@/lib/cv-pdf";

export function SiteHeader() {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/80 px-6 py-2 backdrop-blur-sm lg:px-8">
      <SearchCommand />
      <div className="flex items-center gap-1">
        <Button asChild variant="ghost" size="icon">
          <a
            href={CV_PDF_PATH}
            download
            aria-label="Baixar currículo em PDF"
            data-testid="cv-download-header"
          >
            <Download aria-hidden="true" />
          </a>
        </Button>
        <ModeToggle />
      </div>
    </div>
  );
}
