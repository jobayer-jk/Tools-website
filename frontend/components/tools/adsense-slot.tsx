"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface AdSenseSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  slotId: string;
  format?: "auto" | "fluid" | "rectangle";
  responsive?: boolean;
}

/**
 * AdSenseSlot component to display AdSense ads.
 * It uses a fixed minimum height (`min-h-[250px]`) to prevent Cumulative Layout Shift (CLS),
 * which is critical for good SEO and Core Web Vitals.
 */
export function AdSenseSlot({
  slotId,
  format = "auto",
  responsive = true,
  className,
  ...props
}: AdSenseSlotProps) {
  // Wait for component to mount to avoid hydration mismatch if doing anything browser-specific
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Real implementation would push to adsbygoogle here if the script is loaded
    /*
    try {
      if (typeof window !== "undefined") {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error("AdSense error", err);
    }
    */
  }, []);

  return (
    <div
      className={cn(
        "flex min-h-[250px] w-full items-center justify-center overflow-hidden rounded-md border border-dashed bg-muted/50 p-4 text-muted-foreground",
        className
      )}
      {...props}
    >
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
          Advertisement
        </p>
        <div className="mt-2 text-sm">
          {mounted ? (
            <span className="flex flex-col items-center">
              <span>Slot ID: {slotId}</span>
              <span className="text-[10px] mt-1">(Real AdSense block goes here)</span>
            </span>
          ) : (
            "Loading Ad..."
          )}
        </div>
      </div>

      {/* Real AdSense Element (Commented out for MVP/Dev)
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with actual Publisher ID
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
      */}
    </div>
  );
}
