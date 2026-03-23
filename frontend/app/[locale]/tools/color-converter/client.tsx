"use client";

import { useState, useEffect } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Basic color conversion helpers
function hexToRgb(hex: string) {
  let r = 0, g = 0, b = 0;
  // 3 digits
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } 
  // 6 digits
  else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s
    ? l === r
      ? (g - b) / s
      : l === g
      ? 2 + (b - r) / s
      : 4 + (r - g) / s
    : 0;
  return {
    h: Math.round(60 * h < 0 ? 60 * h + 360 : 60 * h),
    s: Math.round(100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0)),
    l: Math.round((100 * (2 * l - s)) / 2),
  };
}

function hslToRgb(h: number, s: number, l: number) {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  };
}

export function ColorConverterClient() {
  const [hex, setHex] = useState("#3B82F6");
  const [rgb, setRgb] = useState("rgb(59, 130, 246)");
  const [hsl, setHsl] = useState("hsl(217, 91%, 60%)");
  const [error, setError] = useState("");

  const updateFromHex = (val: string) => {
    setHex(val);
    setError("");
    const isValidHex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val);
    if (!isValidHex) {
      setError("Invalid HEX format. Use #RRGGBB or #RGB.");
      return;
    }
    const { r, g, b } = hexToRgb(val);
    setRgb(`rgb(${r}, ${g}, ${b})`);
    const { h, s, l } = rgbToHsl(r, g, b);
    setHsl(`hsl(${h}, ${s}%, ${l}%)`);
  };

  const updateFromRgb = (val: string) => {
    setRgb(val);
    setError("");
    const match = val.match(/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/);
    if (!match) {
      setError("Invalid RGB format. Use rgb(R, G, B) with values 0-255.");
      return;
    }
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    if (r > 255 || g > 255 || b > 255) {
      setError("RGB values must be between 0 and 255.");
      return;
    }
    setHex(rgbToHex(r, g, b));
    const { h, s, l } = rgbToHsl(r, g, b);
    setHsl(`hsl(${h}, ${s}%, ${l}%)`);
  };

  const updateFromHsl = (val: string) => {
    setHsl(val);
    setError("");
    const match = val.match(/^hsl\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%\)$/);
    if (!match) {
      setError("Invalid HSL format. Use hsl(H, S%, L%).");
      return;
    }
    const h = parseInt(match[1]);
    const s = parseInt(match[2]);
    const l = parseInt(match[3]);
    if (h > 360 || s > 100 || l > 100) {
      setError("H must be 0-360, S and L must be 0-100.");
      return;
    }
    const { r, g, b } = hslToRgb(h, s, l);
    setHex(rgbToHex(r, g, b));
    setRgb(`rgb(${r}, ${g}, ${b})`);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${text} copied to clipboard!`);
    } catch (err) {
      toast.error("Failed to copy text.");
    }
  };

  // Ensure valid color preview, fallback to transparent if error
  const previewColor = error ? "transparent" : hex;

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Color Preview Box */}
      <Card className="overflow-hidden border-2 aspect-square max-h-[400px] flex flex-col">
        <div 
          className="flex-1 w-full transition-colors duration-300 relative bg-muted/20 checkerboard-bg"
          style={{ backgroundColor: previewColor }}
        >
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
              <span className="text-destructive font-medium bg-background px-4 py-2 rounded-md shadow-sm">
                Invalid Color
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Input Controls */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            
            {/* HEX Input */}
            <div className="grid gap-2">
              <Label htmlFor="hex-input" className="font-semibold">HEX</Label>
              <div className="flex gap-2">
                <Input 
                  id="hex-input"
                  value={hex}
                  onChange={(e) => updateFromHex(e.target.value)}
                  className="font-mono"
                  placeholder="#000000"
                />
                <Button variant="secondary" size="icon" onClick={() => copyToClipboard(hex)} title="Copy HEX">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* RGB Input */}
            <div className="grid gap-2">
              <Label htmlFor="rgb-input" className="font-semibold">RGB</Label>
              <div className="flex gap-2">
                <Input 
                  id="rgb-input"
                  value={rgb}
                  onChange={(e) => updateFromRgb(e.target.value)}
                  className="font-mono"
                  placeholder="rgb(0, 0, 0)"
                />
                <Button variant="secondary" size="icon" onClick={() => copyToClipboard(rgb)} title="Copy RGB">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* HSL Input */}
            <div className="grid gap-2">
              <Label htmlFor="hsl-input" className="font-semibold">HSL</Label>
              <div className="flex gap-2">
                <Input 
                  id="hsl-input"
                  value={hsl}
                  onChange={(e) => updateFromHsl(e.target.value)}
                  className="font-mono"
                  placeholder="hsl(0, 0%, 0%)"
                />
                <Button variant="secondary" size="icon" onClick={() => copyToClipboard(hsl)} title="Copy HSL">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

          </div>

          {error && (
            <p className="text-sm font-medium text-destructive mt-4 animate-in fade-in slide-in-from-top-1">
              {error}
            </p>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
