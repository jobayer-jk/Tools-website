"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCcw, Copy, ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Password constraints
const MIN_LENGTH = 8;
const MAX_LENGTH = 128;
const DEFAULT_LENGTH = 16;

const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
};

type Strength = "weak" | "fair" | "good" | "strong";

export function PasswordGeneratorClient() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(DEFAULT_LENGTH);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [strength, setStrength] = useState<Strength>("good");

  const calculateStrength = (pwd: string, opts: typeof options): Strength => {
    let score = 0;
    if (pwd.length > 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    
    let typesCount = 0;
    if (opts.uppercase) typesCount++;
    if (opts.lowercase) typesCount++;
    if (opts.numbers) typesCount++;
    if (opts.symbols) typesCount++;
    
    score += (typesCount - 1);

    if (score <= 2) return "weak";
    if (score === 3 || score === 4) return "fair";
    if (score === 5) return "good";
    return "strong";
  };

  const generatePassword = useCallback(() => {
    // Collect all valid characters
    let validChars = "";
    if (options.uppercase) validChars += CHAR_SETS.uppercase;
    if (options.lowercase) validChars += CHAR_SETS.lowercase;
    if (options.numbers) validChars += CHAR_SETS.numbers;
    if (options.symbols) validChars += CHAR_SETS.symbols;

    // Fallback if user unchecks everything
    if (validChars === "") {
      validChars = CHAR_SETS.lowercase;
      setOptions(prev => ({ ...prev, lowercase: true }));
    }

    let newPassword = "";
    const validCharsArray = validChars.split("");
    
    // Ensure we attempt to use Crypto API for true randomness
    if (typeof window !== "undefined" && window.crypto) {
      const randomValues = new Uint32Array(length);
      window.crypto.getRandomValues(randomValues);
      for (let i = 0; i < length; i++) {
        newPassword += validCharsArray[randomValues[i] % validCharsArray.length];
      }
    } else {
      // Fallback
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * validCharsArray.length);
        newPassword += validCharsArray[randomIndex];
      }
    }

    setPassword(newPassword);
    setStrength(calculateStrength(newPassword, options));
  }, [length, options]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      toast.success("Password copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy password.");
    }
  };

  const strengthConfig = {
    weak: { color: "bg-destructive text-destructive", label: "Weak", icon: ShieldAlert },
    fair: { color: "bg-amber-500 text-amber-500", label: "Fair", icon: Shield },
    good: { color: "bg-blue-500 text-blue-500", label: "Good", icon: ShieldCheck },
    strong: { color: "bg-green-500 text-green-500", label: "Strong", icon: ShieldCheck },
  };

  const CurrentStrengthIcon = strengthConfig[strength].icon;

  return (
    <div className="grid gap-6">
      {/* Result Card */}
      <Card className="overflow-hidden border-2 transition-colors duration-300">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
            <div className="flex-1 p-6 sm:p-8 overflow-x-auto custom-scrollbar">
              <span className="text-2xl sm:text-3xl font-mono tracking-wider break-all text-foreground">
                {password}
              </span>
            </div>
            <div className="flex sm:flex-col border-t sm:border-t-0 sm:border-l sm:w-20">
              <Button 
                variant="ghost" 
                className="flex-1 rounded-none h-14 sm:h-auto sm:py-6 text-muted-foreground hover:text-primary hover:bg-primary/10"
                onClick={copyToClipboard}
              >
                <div className="flex flex-col items-center gap-1">
                  <Copy className="h-5 w-5" />
                  <span className="text-[10px] hidden sm:block uppercase tracking-wider font-bold">Copy</span>
                </div>
              </Button>
              <div className="w-[1px] h-full sm:w-full sm:h-[1px] bg-border" />
              <Button 
                variant="ghost" 
                className="flex-1 rounded-none h-14 sm:h-auto sm:py-6 text-muted-foreground hover:text-primary hover:bg-primary/10"
                onClick={generatePassword}
              >
                <div className="flex flex-col items-center gap-1">
                  <RefreshCcw className="h-5 w-5" />
                  <span className="text-[10px] hidden sm:block uppercase tracking-wider font-bold">Refresh</span>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
        {/* Strength Meter Bar */}
        <div className="h-1.5 w-full bg-muted flex">
          {["weak", "fair", "good", "strong"].map((level, idx) => {
            const levels: Strength[] = ["weak", "fair", "good", "strong"];
            const currentIndex = levels.indexOf(strength);
            const isActive = idx <= currentIndex;
            return (
              <div 
                key={level} 
                className={cn(
                  "h-full flex-1 transition-all duration-500", 
                  isActive ? strengthConfig[strength].color.split(' ')[0] : "bg-transparent",
                  idx > 0 && isActive ? "border-l border-background/20" : ""
                )}
              />
            );
          })}
        </div>
      </Card>

      {/* Controls Card */}
      <Card>
        <CardContent className="p-6 space-y-8">
          
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Password Strength:</span>
              <div className={cn("flex items-center gap-1 text-sm font-bold", strengthConfig[strength].color.split(' ')[1])}>
                <CurrentStrengthIcon className="h-4 w-4" />
                {strengthConfig[strength].label}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="length-slider" className="text-base font-semibold">Password Length</Label>
              <span className="text-2xl font-bold text-primary">{length}</span>
            </div>
            <Slider
              id="length-slider"
              min={MIN_LENGTH}
              max={MAX_LENGTH}
              step={1}
              value={[length]}
              onValueChange={(vals) => setLength(vals[0])}
              className="py-4"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold mb-2 block">Characters Used</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <Label htmlFor="opt-uppercase" className="flex flex-col cursor-pointer">
                  <span className="font-medium">Uppercase</span>
                  <span className="text-xs text-muted-foreground">A-Z</span>
                </Label>
                <Switch 
                  id="opt-uppercase" 
                  checked={options.uppercase}
                  onCheckedChange={(c) => setOptions(p => ({ ...p, uppercase: c }))}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <Label htmlFor="opt-lowercase" className="flex flex-col cursor-pointer">
                  <span className="font-medium">Lowercase</span>
                  <span className="text-xs text-muted-foreground">a-z</span>
                </Label>
                <Switch 
                  id="opt-lowercase" 
                  checked={options.lowercase}
                  onCheckedChange={(c) => setOptions(p => ({ ...p, lowercase: c }))}
                />
              </div>

              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <Label htmlFor="opt-numbers" className="flex flex-col cursor-pointer">
                  <span className="font-medium">Numbers</span>
                  <span className="text-xs text-muted-foreground">0-9</span>
                </Label>
                <Switch 
                  id="opt-numbers" 
                  checked={options.numbers}
                  onCheckedChange={(c) => setOptions(p => ({ ...p, numbers: c }))}
                />
              </div>

              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <Label htmlFor="opt-symbols" className="flex flex-col cursor-pointer">
                  <span className="font-medium">Symbols</span>
                  <span className="text-xs text-muted-foreground">!@#$%^&*</span>
                </Label>
                <Switch 
                  id="opt-symbols" 
                  checked={options.symbols}
                  onCheckedChange={(c) => setOptions(p => ({ ...p, symbols: c }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
