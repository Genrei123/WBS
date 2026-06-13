import { Mail } from "lucide-react";

import { cn } from "@/lib/utils";

import SocialIcon from "../../ui/social-icon";

const CONTACT_EMAIL = "ervhynedalugdogwbs@gmail.com";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61589377103335";

export default function ContactDirect({ className }: { className?: string }) {
  return (
    <section className={cn("px-4 pb-20 sm:pb-28", className)}>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <span className="text-muted-foreground/70 text-xs font-light">
          Prefer to reach us directly?
        </span>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-8">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-foreground hover:text-brand flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <Mail className="text-brand size-4" />
            {CONTACT_EMAIL}
          </a>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-brand flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <SocialIcon name="facebook" className="text-brand size-4" />
            Message us on Facebook
          </a>
        </div>
      </div>
    </section>
  );
}
