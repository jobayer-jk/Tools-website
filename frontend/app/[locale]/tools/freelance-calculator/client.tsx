"use client";

import { useState, useMemo } from "react";
import { DollarSign, Briefcase, Calendar, Receipt, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export function FreelanceCalculatorClient() {
  // Inputs
  const [desiredSalary, setDesiredSalary] = useState<number>(60000);
  const [annualExpenses, setAnnualExpenses] = useState<number>(5000);
  const [taxRate, setTaxRate] = useState<number>(25);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(30); // Billable hours
  const [weeksOff, setWeeksOff] = useState<number>(4);

  // Calculations
  const calculations = useMemo(() => {
    // 1. Calculate Gross Income Needed to hit Target Net (Salary + Expenses) after taxes
    // Net Income = Gross - (Gross * (taxRate / 100))
    // Gross * (1 - (taxRate / 100)) = Net Income
    // Gross = (Desired Salary + Expenses) / (1 - taxRate / 100)
    
    // Fallback to prevent divide by zero or negative if tax is 100%
    const effectiveTaxRate = Math.min(taxRate, 99) / 100;
    
    // Target net is just what they take home + business expenses they MUST pay
    // Actually, normally: Target Gross = (Target Net + Expenses) / (1 - Tax Rate)
    const targetNet = desiredSalary;
    const grossIncomeNeeded = (targetNet + annualExpenses) / (1 - effectiveTaxRate);

    // 2. Calculate Billable Hours Per Year
    const weeksWorking = 52 - weeksOff;
    const totalBillableHours = weeksWorking * hoursPerWeek;

    // 3. Hourly Rate
    const hourlyRate = totalBillableHours > 0 ? (grossIncomeNeeded / totalBillableHours) : 0;

    return {
      grossIncomeNeeded: Math.round(grossIncomeNeeded),
      totalBillableHours,
      hourlyRate: Number(hourlyRate.toFixed(2)),
      totalTaxes: Math.round(grossIncomeNeeded * effectiveTaxRate)
    };
  }, [desiredSalary, annualExpenses, taxRate, hoursPerWeek, weeksOff]);

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start">
      
      {/* Input Form Column */}
      <Card className="lg:col-span-7 border-none shadow-sm">
        <CardHeader className="border-b bg-muted/20 pb-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Income & Work Variables
          </h3>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <DollarSign className="h-4 w-4 text-emerald-500" /> Desired Annual Net Salary
              </Label>
              <span className="font-mono font-bold text-lg">${desiredSalary.toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">How much you want to take home after all taxes and expenses.</p>
            <Slider
              min={10000} max={250000} step={1000}
              value={[desiredSalary]}
              onValueChange={(vals) => setDesiredSalary(vals[0])}
              className="py-4"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Receipt className="h-4 w-4 text-amber-500" /> Estimated Annual Expenses
              </Label>
              <div className="relative w-32">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input 
                  type="number" min={0} 
                  value={annualExpenses}
                  onChange={(e) => setAnnualExpenses(Number(e.target.value) || 0)}
                  className="pl-7 font-mono text-right"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Software, hardware, internet, travel, etc.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Receipt className="h-4 w-4 text-red-500" /> Estimated Tax Rate
              </Label>
              <span className="font-mono font-bold text-lg">{taxRate}%</span>
            </div>
            <Slider
              min={0} max={60} step={1}
              value={[taxRate]}
              onValueChange={(vals) => setTaxRate(vals[0])}
              className="py-4"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Briefcase className="h-4 w-4 text-blue-500" /> Billable Hours per Week
              </Label>
              <span className="font-mono font-bold text-lg">{hoursPerWeek} hrs</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Only count hours you can actually charge to clients (usually 20-30 max).</p>
            <Slider
              min={5} max={60} step={1}
              value={[hoursPerWeek]}
              onValueChange={(vals) => setHoursPerWeek(vals[0])}
              className="py-4"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Calendar className="h-4 w-4 text-purple-500" /> Weeks Off per Year
              </Label>
              <span className="font-mono font-bold text-lg">{weeksOff} weeks</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Vacation, holidays, and sick leave.</p>
            <Slider
              min={0} max={52} step={1}
              value={[weeksOff]}
              onValueChange={(vals) => setWeeksOff(vals[0])}
              className="py-4"
            />
          </div>

        </CardContent>
      </Card>

      {/* Results Column */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
        <Card className="border-2 border-primary/20 shadow-md bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <CardHeader className="pb-2">
            <h3 className="font-semibold text-lg text-primary">Your Minimum Hourly Rate</h3>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-extrabold tracking-tight">${calculations.hourlyRate}</span>
              <span className="text-xl font-medium text-muted-foreground">/ hr</span>
            </div>
            <p className="text-sm text-muted-foreground pt-2">
              Charge this rate to consistently hit your financial goals.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="border-b bg-muted/10 pb-3 py-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">The Breakdown</h4>
          </CardHeader>
          <CardContent className="p-0 divide-y">
            <div className="flex justify-between items-center p-4 hover:bg-muted/10 transition-colors">
              <span className="text-sm font-medium">Target Gross Revenue</span>
              <span className="font-mono font-bold">${calculations.grossIncomeNeeded.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 hover:bg-muted/10 transition-colors text-red-500/80">
              <span className="text-sm font-medium">Estimated Taxes</span>
              <span className="font-mono font-bold">-${calculations.totalTaxes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 hover:bg-muted/10 transition-colors text-amber-500/80">
              <span className="text-sm font-medium">Business Expenses</span>
              <span className="font-mono font-bold">-${annualExpenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted/20 text-emerald-600 dark:text-emerald-400">
              <span className="text-sm font-bold">Net Take-Home Salary</span>
              <span className="font-mono font-bold">${desiredSalary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 hover:bg-muted/10 transition-colors text-muted-foreground">
              <span className="text-sm font-medium">Total Billable Hours/Yr</span>
              <span className="font-mono font-bold">{calculations.totalBillableHours} hrs</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
}
