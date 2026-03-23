"use client";

import { useState, useRef, useEffect } from "react";
import { Download, ScanBarcode } from "lucide-react";
// @ts-ignore - react-barcode types are often missing or lacking
import Barcode from "react-barcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export function BarcodeGeneratorClient() {
  const [value, setValue] = useState("123456789012");
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const barcodeWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const downloadBarcode = () => {
    const svg = barcodeWrapperRef.current?.querySelector("svg");
    if (!svg) {
      toast.error("Error generating barcode for download.");
      return;
    }

    // Convert SVG to Data URL for drawing to Canvas to get PNG
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // Scale up for better quality
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "barcode.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
        toast.success("Barcode downloaded!");
      }
    };
    img.src = url;
  };

  // Prevent generic hydration errors by only rendering complex barcode client side
  if (!mounted) return <div className="min-h-[400px]" />;

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start">
      {/* Settings Form */}
      <Card className="lg:col-span-7 border-none shadow-sm">
        <CardContent className="p-6 space-y-8">
          <div className="space-y-4">
            <Label className="text-base font-semibold flex items-center gap-2">
              <ScanBarcode className="h-4 w-4 text-primary" /> Barcode Data
            </Label>
            <Input 
              placeholder="Enter numbers, letters, or symbols..."
              className="text-lg h-14 font-mono w-full"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={40}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Bar Width</Label>
              <span className="font-mono text-sm">{width}px</span>
            </div>
            <Slider
              min={1} max={5} step={1}
              value={[width]}
              onValueChange={(v) => setWidth(v[0])}
              className="py-2"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Barcode Height</Label>
              <span className="font-mono text-sm">{height}px</span>
            </div>
            <Slider
              min={40} max={200} step={10}
              value={[height]}
              onValueChange={(v) => setHeight(v[0])}
              className="py-2"
            />
          </div>

          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4 bg-muted/20">
            <Label htmlFor="opt-value" className="flex flex-col cursor-pointer">
              <span className="font-semibold">Display Text</span>
              <span className="text-xs text-muted-foreground mt-1">Show the data value below the barcode</span>
            </Label>
            <Switch 
              id="opt-value" 
              checked={displayValue}
              onCheckedChange={setDisplayValue}
            />
          </div>

        </CardContent>
      </Card>

      {/* Preview Column */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
        <Card className="border-none shadow-sm relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-8 bg-muted/10 checkerboard-bg min-h-[350px]">
          <div 
            ref={barcodeWrapperRef}
            className="bg-white rounded-xl shadow-lg transition-transform overflow-hidden px-8 py-4 flex items-center justify-center min-w-[200px]"
          >
            {value ? (
              <Barcode 
                value={value} 
                width={width}
                height={height}
                displayValue={displayValue}
                background="#ffffff"
                lineColor="#000000"
                margin={10}
                format="CODE128"
              />
            ) : (
              <span className="text-muted-foreground py-10 font-medium">Enter data to generate Barcode</span>
            )}
          </div>
        </Card>

        <Button onClick={downloadBarcode} disabled={!value} className="w-full h-12 text-base gap-2 font-semibold">
          <Download className="h-5 w-5" /> Download Barcode (PNG)
        </Button>
      </div>
    </div>
  );
}
