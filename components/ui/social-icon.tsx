import React from "react";

export default function SocialIcon({ name, className }: { name?: string; className?: string }) {
  const size = 18;
  switch (name) {
    case "facebook":
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M22 12a10 10 0 10-11.5 9.9v-7H8.5v-3h2V9.5c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.4 3h-1.8v7A10 10 0 0022 12z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M23 7s-.2-1.6-.8-2.3c-.8-.9-1.7-.9-2.1-1C16.5 3 12 3 12 3s-4.5 0-7.9.7c-.4.1-1.3.1-2.1 1C1.2 5.4 1 7 1 7S1 8.9 1.4 10.1C1.9 11.7 3 12.2 3.6 12.4 5.4 13 12 13 12 13s6.5 0 8.4-.6c.6-.2 1.7-.7 2.2-2C23 8.9 23 7 23 7zM9.8 9.6v4.8L14.4 12 9.8 9.6z" />
        </svg>
      );
    case "twitter":
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M23 4.6c-.8.4-1.6.6-2.5.8.9-.6 1.5-1.6 1.8-2.6-.8.5-1.9.9-2.9 1.1C18.6 3 17.5 2.5 16.3 2.5c-2 0-3.6 1.7-3.6 3.7 0 .3 0 .6.1.9C9.7 7 6.1 5.4 3.8 3c-.4.7-.6 1.6-.6 2.4 0 1.6.8 3 2 3.8-.7 0-1.4-.2-2-.5v.1c0 2.2 1.6 4 3.7 4.4-.4.1-.9.2-1.3.2-.3 0-.6 0-.9-.1.6 1.8 2.3 3.1 4.3 3.1C7.7 18.4 5 19.3 2.2 19c2 1.3 4.4 2 6.9 2 8.3 0 12.8-7 12.8-13v-.6c.9-.7 1.6-1.6 2.2-2.6-.8.4-1.7.6-2.6.7z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5.8A4.2 4.2 0 1016.2 12 4.2 4.2 0 0012 7.8zm6.4-1.6a1.2 1.2 0 11-1.2-1.2 1.2 1.2 0 011.2 1.2z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5V24H0zM7.5 8h4.8v2.2h.1c.7-1.3 2.4-2.7 5-2.7 5.3 0 6.3 3.5 6.3 8V24h-5V16.2c0-1.9 0-4.3-2.6-4.3-2.6 0-3 2-3 4.1V24h-5V8z" />
        </svg>
      );
    default:
      return null;
  }
}
