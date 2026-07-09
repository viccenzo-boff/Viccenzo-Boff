import { Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cvData } from "@/data/cv";
import { cn } from "@/lib/utils";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-4", className)}
    >
      <path d="M12 .5C5.73.5.98 5.24.98 11.52c0 4.94 3.2 9.13 7.65 10.6.56.1.76-.24.76-.54 0-.27-.01-1.16-.02-2.1-3.11.68-3.77-1.32-3.77-1.32-.51-1.3-1.24-1.64-1.24-1.64-1.01-.7.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.71 2.62 1.22 3.26.93.1-.72.39-1.22.71-1.5-2.48-.28-5.1-1.24-5.1-5.53 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.63 5.24-5.13 5.52.4.35.76 1.04.76 2.1 0 1.52-.01 2.74-.01 3.11 0 .3.2.65.77.54A10.53 10.53 0 0 0 23.02 11.5C23.02 5.24 18.27.5 12 .5Z" />
    </svg>
  );
}

export function Hero() {
  const { contact, summary } = cvData;
  const phoneHref = `tel:+55${contact.phone.replace(/\D/g, "")}`;

  return (
    <header id="inicio" className="scroll-mt-20 border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-6 py-20 text-center sm:py-28 lg:px-8">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <MapPin className="size-4" aria-hidden="true" />
          <span>{contact.location}</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-6xl lg:text-7xl">
            {contact.name}
          </h1>
          <p className="text-lg font-medium text-muted-foreground sm:text-xl lg:text-2xl">
            {contact.targetRole}
          </p>
        </div>

        <p className="max-w-2xl text-base leading-relaxed text-foreground/80 sm:text-lg">
          {summary}
        </p>

        <Separator className="max-w-2xl" />

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <a href={`mailto:${contact.email}`}>
              <Mail />
              {contact.email}
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={phoneHref}>
              <Phone />
              {contact.phone}
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={contact.github} target="_blank" rel="noopener noreferrer">
              <GithubIcon />
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
