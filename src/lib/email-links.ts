import type { ContactInfo } from "@/types/cv.types";

export type EmailLinkSource = Pick<ContactInfo, "email" | "emailSubject">;

export function buildGmailComposeUrl({ email, emailSubject }: EmailLinkSource): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(emailSubject)}`;
}

export function buildOutlookComposeUrl({ email, emailSubject }: EmailLinkSource): string {
  return `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(email)}&subject=${encodeURIComponent(emailSubject)}`;
}

export function buildMailtoUrl({ email, emailSubject }: EmailLinkSource): string {
  return `mailto:${email}?subject=${encodeURIComponent(emailSubject)}`;
}
