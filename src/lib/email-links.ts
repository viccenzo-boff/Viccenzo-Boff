import type { ContactInfo } from "@/types/cv.types";

export type EmailLinkSource = Pick<ContactInfo, "email" | "emailSubject">;

/** URL de composição do Gmail (webmail). Usa `su=` para o assunto; `to`/`su` são percent-encoded. */
export function buildGmailComposeUrl({ email, emailSubject }: EmailLinkSource): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(emailSubject)}`;
}

/** URL de composição do Outlook Web. Usa `subject=` (não `su=`); `to`/`subject` são percent-encoded. */
export function buildOutlookComposeUrl({ email, emailSubject }: EmailLinkSource): string {
  return `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(email)}&subject=${encodeURIComponent(emailSubject)}`;
}

/** URI `mailto:` para o cliente de e-mail padrão do SO. O endereço vai cru; só o assunto é percent-encoded. */
export function buildMailtoUrl({ email, emailSubject }: EmailLinkSource): string {
  return `mailto:${email}?subject=${encodeURIComponent(emailSubject)}`;
}
