import { ChevronDown, Download, MapPin } from "lucide-react";

import { GithubIcon, WhatsAppIcon } from "@/components/custom/brand-icons";
import { EmailContactMenu } from "@/components/custom/email-contact-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cvData } from "@/data/cv";
import { CV_PDF_PATH } from "@/lib/cv-pdf";
import { buildWhatsAppChatUrl } from "@/lib/whatsapp-link";

export function Hero() {
  const { contact, summary } = cvData;

  return (
    <header id="inicio" className="scroll-mt-20 border-b border-border bg-background">
      <div className="hero-fill relative flex flex-col overflow-hidden">
        <div aria-hidden="true" className="hero-backdrop absolute inset-0 z-0">
          <div className="hero-grid absolute inset-0" />
          <div className="hero-aurora hero-aurora-a" />
          <div className="hero-aurora hero-aurora-b" />
          <div className="hero-aurora hero-aurora-c" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-10 px-6 pt-10 pb-20 text-center sm:pt-14 sm:pb-28 lg:px-8">
          <Badge
            variant="outline"
            className="hero-rise h-auto gap-2 rounded-full border-border/80 bg-background/70 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm"
          >
            <MapPin aria-hidden="true" />
            <span>{contact.location}</span>
          </Badge>

          <div className="hero-rise hero-rise-2 flex flex-col items-center gap-4">
            <h1 className="hero-name text-4xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              {contact.name}
            </h1>
            <p className="text-lg font-medium text-muted-foreground sm:text-xl lg:text-2xl">
              {contact.targetRole}
            </p>
          </div>

          <p className="hero-rise hero-rise-3 max-w-2xl text-base leading-relaxed text-foreground/80 sm:text-lg">
            {summary}
          </p>

          <div className="hero-rise hero-rise-4 flex w-full justify-center">
            <Separator className="max-w-2xl bg-transparent bg-[linear-gradient(to_right,transparent,var(--scroll-line-from),var(--scroll-line-via),var(--scroll-line-to),transparent)] opacity-70" />
          </div>

          <div className="hero-actions hero-rise hero-rise-5 flex flex-wrap items-center justify-center gap-3">
            <EmailContactMenu contact={contact} />
            <Button asChild variant="outline" size="lg">
              <a
                href={buildWhatsAppChatUrl(contact)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Conversar no WhatsApp"
              >
                <WhatsAppIcon />
                WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={contact.github} target="_blank" rel="noopener noreferrer">
                <GithubIcon />
                GitHub
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={CV_PDF_PATH} download>
                <Download aria-hidden="true" />
                Baixar CV (PDF)
              </a>
            </Button>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center sm:bottom-7">
          <a
            href="#painel-de-impacto"
            aria-label="Rolar para o Painel de Impacto"
            className="hero-rise hero-rise-6 pointer-events-auto flex size-9 items-center justify-center rounded-full border border-border/80 bg-background/70 text-muted-foreground backdrop-blur-sm transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            <ChevronDown className="hero-cue-icon size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
