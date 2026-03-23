"use client";

import { useState, useRef } from "react";
import { Download, Share2, PaintBucket } from "lucide-react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";

export function QrGeneratorClient() {
  const [value, setValue] = useState("https://example.com");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [size, setSize] = useState(256);
  
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) {
      toast.error("Error generating QR code for download.");
      return;
    }
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qr-code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    toast.success("QR Code downloaded!");
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start">
      {/* Settings Form */}
      <Card className="lg:col-span-7 border-none shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-semibold">QR Code Content</Label>
            <Textarea 
              placeholder="Enter text, URL, email, or phone number..."
              className="resize-y min-h-[120px] text-base p-4"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold flex items-center gap-2">
                <PaintBucket className="h-4 w-4 text-primary" /> Foreground Color
              </Label>
              <div className="flex items-center gap-3">
                <Input 
                  type="color" 
                  value={fgColor} 
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-14 h-14 p-1 cursor-pointer rounded-lg"
                />
                <Input 
                  type="text" 
                  value={fgColor.toUpperCase()} 
                  onChange={(e) => setFgColor(e.target.value)}
                  className="font-mono flex-1 uppercase"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-semibold flex items-center gap-2">
                <PaintBucket className="h-4 w-4 text-muted-foreground" /> Background Color
              </Label>
              <div className="flex items-center gap-3">
                <Input 
                  type="color" 
                  value={bgColor} 
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-14 h-14 p-1 cursor-pointer rounded-lg border-none"
                />
                <Input 
                  type="text" 
                  value={bgColor.toUpperCase()} 
                  onChange={(e) => setBgColor(e.target.value)}
                  className="font-mono flex-1 uppercase"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Size (Resolution)</Label>
              <span className="font-mono text-sm">{size}x{size}px</span>
            </div>
            <Slider
              min={128} max={1024} step={32}
              value={[size]}
              onValueChange={(v) => setSize(v[0])}
              className="py-4"
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview Column */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
        <Card className="border-none shadow-sm relative overflow-hidden flex flex-col items-center justify-center p-8 bg-muted/10 checkerboard-bg min-h-[350px]">
          <div 
            ref={qrRef}
            className="p-4 bg-white rounded-xl shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: bgColor }}
          >
            {/* Render Canvas for easy download and accurate rendering */}
            <QRCodeCanvas 
              value={value || " "}
              size={256} // fixed display size
              bgColor={bgColor}
              fgColor={fgColor}
              level={"H"}
              includeMargin={false}
              className="max-w-full h-auto rounded-md"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </Card>

        <Button onClick={downloadQR} className="w-full h-12 text-base gap-2 font-semibold">
          <Download className="h-5 w-5" /> Download QR Code
        </Button>
      </div>
    </div>
  );
}
