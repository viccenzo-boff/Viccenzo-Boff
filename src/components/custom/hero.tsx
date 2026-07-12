import { Download, MapPin } from "lucide-react";

import { GithubIcon, WhatsAppIcon } from "@/components/custom/brand-icons";
import { EmailContactMenu } from "@/components/custom/email-contact-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cvData } from "@/data/cv";
import { CV_PDF_PATH } from "@/lib/cv-pdf";
import { buildWhatsAppChatUrl } from "@/lib/whatsapp-link";

export function Hero() {
  const { contact, summary } = cvData;

  return (
    <header id="inicio" className="scroll-mt-20 border-b border-border bg-background">
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-6 pt-10 pb-20 text-center sm:pt-14 sm:pb-28 lg:px-8">
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
    </header>
  );
}
