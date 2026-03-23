"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";
import type { ComponentProps } from "react";

/**
 * ThemeProvider wraps the app with next-themes to support
 * light/dark mode toggling. The `attribute="class"` setting
 * ensures the `.dark` class is added to the `<html>` element,
 * which triggers our CSS variable overrides in globals.css.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
