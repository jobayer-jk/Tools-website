import { Metadata } from "next";
import { UnitConverterClient } from "./client";

export const metadata: Metadata = {
  title: "Unit Converter (Length, Weight, Temp)",
  description: "Convert units of length, weight, and temperature instantly. Fast and accurate online unit converter.",
};

export default function UnitConverterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Unit Converter</h1>
        <p className="text-muted-foreground">
          Instantly convert between different units of measurement including Length, Weight, and Temperature.
        </p>
      </div>
      <UnitConverterClient />
    </div>
  );
}
