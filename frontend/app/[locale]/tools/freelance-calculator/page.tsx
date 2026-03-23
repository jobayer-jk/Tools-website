import { Metadata } from "next";
import { FreelanceCalculatorClient } from "./client";

export const metadata: Metadata = {
  title: "Freelance Hourly Rate Calculator",
  description: "Calculate your ideal freelance hourly rate based on desired salary, expenses, working hours, and taxes.",
};

export default function FreelanceCalculatorPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Freelance Hourly Rate Calculator</h1>
        <p className="text-muted-foreground">
          Determine exactly what you need to charge per hour to hit your income goals, accounting for taxes, expenses, and time off.
        </p>
      </div>
      <FreelanceCalculatorClient />
    </div>
  );
}
