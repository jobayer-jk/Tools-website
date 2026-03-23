"use client";

import { usePathname } from "next/navigation";

export function FooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname && (pathname.includes('/dashboard') || pathname.includes('/login') || pathname.includes('/register'))) {
    return null;
  }

  return <>{children}</>;
}
