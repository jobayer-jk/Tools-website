"use client";

import { useState, useEffect } from "react";
import { Bot, KeyRound, Sparkles, Wand2, Copy, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ContentGeneratorClient() {
  const [apiKey, setApiKey] = useState("");
  const [isKeySaved, setIsKeySaved] = useState(false);
  
  const [prompt, setPrompt] = useState("");
  const [roleSystem, setRoleSystem] = useState("You are an expert, helpful AI assistant.");
  const [output, setOutput] = useState("");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("openai_api_key_byok");
    if (savedKey) {
      setApiKey(savedKey);
      setIsKeySaved(true);
    }
  }, []);

  const saveKey = () => {
    if (!apiKey.trim().startsWith("sk-")) {
      toast.error("Invalid API Key format. Must begin with 'sk-'.");
      return;
    }
    localStorage.setItem("openai_api_key_byok", apiKey.trim());
    setIsKeySaved(true);
    toast.success("API Key saved firmly to your browser!");
  };

  const removeKey = () => {
    localStorage.removeItem("openai_api_key_byok");
    setApiKey("");
    setIsKeySaved(false);
    toast.info("API Key removed from browser cache.");
  };

  const generateContent = async () => {
    if (!isKeySaved) {
      toast.error("Please provide and save an OpenAI API key first.");
      return;
    }
    if (!prompt.trim()) {
      toast.error("Please enter a prompt topic to generate content.");
      return;
    }

    try {
      setIsGenerating(true);
      setOutput("");
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: roleSystem },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "Failed to fetch from OpenAI");
      }

      const data = await response.json();
      const text = data.choices[0]?.message?.content || "";
      setOutput(text);
      toast.success("Content generated successfully!");
      
    } catch (error: any) {
      console.error(error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy text.");
    }
  };

  return (
    <div className="grid xl:grid-cols-12 gap-8 items-start">
      
      {/* Settings & Prompt Column */}
      <div className="xl:col-span-4 space-y-6">
        
        {/* API Key Box */}
        <Card className="border-none shadow-sm">
          <div className="border-b bg-muted/20 p-4 font-semibold flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" /> API Key Configuration
          </div>
          <CardContent className="p-6 space-y-4">
            <Alert variant="default" className="bg-primary/5 border-primary/20 pb-3">
              <Info className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary font-bold">Privacy First (BYOK)</AlertTitle>
              <AlertDescription className="text-xs mt-1 text-muted-foreground">
                Your key never hits our servers. It is stored natively in `localStorage` and sent directly to OpenAI from your machine.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label>OpenAI API Key (sk-...)</Label>
              <Input 
                type="password" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)} 
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                disabled={isKeySaved}
                className="font-mono text-sm"
              />
            </div>
            
            {isKeySaved ? (
              <Button onClick={removeKey} variant="destructive" className="w-full font-bold">
                Remove Key safely
              </Button>
            ) : (
              <Button onClick={saveKey} className="w-full font-bold">
                Save Key Locally
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Prompt Setup Box */}
        <Card className="border-none shadow-sm">
          <div className="border-b bg-muted/20 p-4 font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" /> Instructions Setup
          </div>
          <CardContent className="p-6 space-y-6">
            
            <div className="space-y-2">
              <Label>System Role / Tone</Label>
              <Input 
                value={roleSystem} 
                onChange={(e) => setRoleSystem(e.target.value)} 
                placeholder="e.g. You are a senior copywriter..."
              />
            </div>

            <div className="space-y-2">
              <Label>Your Prompt Topic</Label>
              <Textarea 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="Write a completely unique blog post about..."
                className="min-h-[150px] resize-y custom-scrollbar"
              />
            </div>
            
            <Button 
              onClick={generateContent} 
              disabled={isGenerating || !isKeySaved}
              className="w-full gap-2 font-bold h-12 text-base bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            >
              {isGenerating ? <Wand2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              {isGenerating ? "Synthesizing..." : "Generate Content directly"}
            </Button>
            
          </CardContent>
        </Card>
      </div>

      {/* Output Column */}
      <Card className="xl:col-span-8 border-none shadow-sm relative flex flex-col min-h-[500px]">
        <div className="border-b bg-muted/10 p-4 font-semibold text-muted-foreground flex items-center justify-between">
           <span>Model Generation Output</span>
           {output && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard}
                className="h-8 gap-2 bg-background"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
           )}
        </div>
        
        <CardContent className="p-0 flex-1 flex flex-col">
          {!output && !isGenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground px-8 bg-muted/5 min-h-[400px]">
              <Bot className="h-16 w-16 opacity-20 mb-4" />
              <p className="text-lg font-medium">Awaiting Prompt Configuration</p>
              <p className="text-sm mt-2 opacity-70">Supply your key on the left to start chatting with the intelligence natively.</p>
            </div>
          ) : isGenerating ? (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/5 min-h-[400px]">
               <Wand2 className="h-16 w-16 text-emerald-500 animate-pulse mb-6" />
               <h3 className="text-xl font-bold animate-pulse">Communicating with the mainframe latency...</h3>
               <p className="text-sm text-muted-foreground mt-2">Writing high-quality textual generation dynamically...</p>
             </div>
          ) : (
             <div className="flex-1 p-6 bg-muted/5 flex flex-col">
               <Textarea 
                 value={output}
                 readOnly
                 className="flex-1 w-full min-h-[400px] resize-none border-none shadow-none focus-visible:ring-0 bg-transparent text-sm md:text-base leading-relaxed p-4 custom-scrollbar"
               />
             </div>
          )}
        </CardContent>
      </Card>
      
    </div>
  );
}
