"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Conversion Ratios (relative to a base unit for each category)
// Length base: meter
// Weight base: gram
const CONVERSIONS = {
  length: {
    name: "Length",
    units: {
      km: { name: "Kilometers", ratio: 1000 },
      m: { name: "Meters", ratio: 1 },
      cm: { name: "Centimeters", ratio: 0.01 },
      mm: { name: "Millimeters", ratio: 0.001 },
      mi: { name: "Miles", ratio: 1609.344 },
      yd: { name: "Yards", ratio: 0.9144 },
      ft: { name: "Feet", ratio: 0.3048 },
      in: { name: "Inches", ratio: 0.0254 },
    }
  },
  weight: {
    name: "Weight / Mass",
    units: {
      t: { name: "Metric Tons", ratio: 1000000 },
      kg: { name: "Kilograms", ratio: 1000 },
      g: { name: "Grams", ratio: 1 },
      mg: { name: "Milligrams", ratio: 0.001 },
      lb: { name: "Pounds", ratio: 453.59237 },
      oz: { name: "Ounces", ratio: 28.349523125 },
    }
  },
  temperature: {
    name: "Temperature",
    // Handled via special formulas, not simple ratios
    units: {
      c: { name: "Celsius" },
      f: { name: "Fahrenheit" },
      k: { name: "Kelvin" },
    }
  }
};

type Category = keyof typeof CONVERSIONS;

export function UnitConverterClient() {
  const [category, setCategory] = useState<Category>("length");
  
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");
  const [inputValue, setInputValue] = useState("1");
  const [outputValue, setOutputValue] = useState("");

  const calculateConversion = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      setOutputValue("");
      return;
    }

    const val = Number(inputValue);
    let result = 0;

    if (category === "temperature") {
      // Temperature uses specific formulas
      if (fromUnit === toUnit) {
        result = val;
      } else if (fromUnit === "c" && toUnit === "f") result = (val * 9/5) + 32;
      else if (fromUnit === "c" && toUnit === "k") result = val + 273.15;
      else if (fromUnit === "f" && toUnit === "c") result = (val - 32) * 5/9;
      else if (fromUnit === "f" && toUnit === "k") result = (val - 32) * 5/9 + 273.15;
      else if (fromUnit === "k" && toUnit === "c") result = val - 273.15;
      else if (fromUnit === "k" && toUnit === "f") result = (val - 273.15) * 9/5 + 32;
    } else {
      // Ratio-based calculations
      const catData = CONVERSIONS[category as "length" | "weight"];
      // @ts-ignore
      const fromRatio = catData.units[fromUnit].ratio;
      // @ts-ignore
      const toRatio = catData.units[toUnit].ratio;
      
      // Convert 'from' to base, then base to 'to'
      const inBase = val * fromRatio;
      result = inBase / toRatio;
    }

    // Format output (handle floating point precision issues softly)
    setOutputValue(parseFloat(result.toPrecision(10)).toString());
  };

  useEffect(() => {
    calculateConversion();
  }, [inputValue, fromUnit, toUnit, category]);

  const handleCategoryChange = (val: Category) => {
    setCategory(val);
    const unitsList = Object.keys(CONVERSIONS[val].units);
    setFromUnit(unitsList[0]);
    setToUnit(unitsList[1]);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const copyToClipboard = async () => {
    if (!outputValue) return;
    try {
      await navigator.clipboard.writeText(outputValue);
      toast.success("Result copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text.");
    }
  };

  return (
    <Card className="border-none max-w-2xl mx-auto shadow-sm">
      <CardHeader className="border-b bg-muted/20 pb-6">
        <Label className="text-sm font-semibold mb-2 block text-muted-foreground">Select Category</Label>
        <Select value={category} onValueChange={(val) => handleCategoryChange(val as Category)}>
          <SelectTrigger className="w-full h-12 text-base font-medium bg-background">
            <SelectValue placeholder="Select completely" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CONVERSIONS).map(([key, data]) => (
              <SelectItem key={key} value={key} className="text-base py-2">
                {data.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      
      <CardContent className="p-6 md:p-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
          
          {/* FROM */}
          <div className="space-y-4 p-4 md:p-6 bg-muted/30 rounded-xl border relative">
            <span className="absolute -top-3 left-4 bg-background px-2 text-xs font-semibold text-muted-foreground border rounded-full">FROM</span>
            <div className="grid gap-2">
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="h-14 text-2xl font-bold bg-background text-foreground"
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger className="h-12 bg-background font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CONVERSIONS[category].units).map(([uKey, uData]) => (
                    <SelectItem key={uKey} value={uKey}>
                      {uData.name} ({uKey})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* SWAP BTN */}
          <div className="flex justify-center -my-4 md:my-0 relative z-10">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={swapUnits}
              className="h-12 w-12 rounded-full border-2 bg-background hover:bg-accent text-primary shadow-sm hover:scale-105 transition-transform"
            >
              <ArrowLeftRight className="h-5 w-5" />
            </Button>
          </div>

          {/* TO */}
          <div className="space-y-4 p-4 md:p-6 bg-primary/5 rounded-xl border border-primary/20 relative">
            <span className="absolute -top-3 left-4 bg-background px-2 text-xs font-semibold text-primary border border-primary/20 rounded-full">TO</span>
            <div className="grid gap-2">
              <Input
                type="text"
                readOnly
                value={outputValue}
                className="h-14 text-2xl font-bold bg-background text-foreground focus-visible:ring-0 cursor-default"
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger className="h-12 bg-background font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CONVERSIONS[category].units).map(([uKey, uData]) => (
                    <SelectItem key={uKey} value={uKey}>
                      {uData.name} ({uKey})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
        </div>

        <div className="flex justify-center border-t pt-6">
          <Button onClick={copyToClipboard} variant="secondary" size="lg" className="w-full sm:w-auto min-w-[200px] gap-2">
            <Copy className="h-4 w-4" /> Copy Result
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
