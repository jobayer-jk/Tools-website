"use client";

import { useState } from "react";
import { ArrowRightLeft, Copy, Download, UploadCloud, Trash2 } from "lucide-react";
import Papa from "papaparse";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Format = "csv" | "json" | "xml";

export function DataConverterClient() {
  const [inputData, setInputData] = useState<string>("");
  const [outputData, setOutputData] = useState<string>("");
  const [inputFormat, setInputFormat] = useState<Format>("csv");
  const [outputFormat, setOutputFormat] = useState<Format>("json");

  // --- XML Parsers Configuration ---
  const xmlParser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_"
  });
  
  const xmlBuilder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    arrayNodeName: "item"
  });

  const clearAll = () => {
    setInputData("");
    setOutputData("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Auto-detect format based on extension
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "csv" || ext === "json" || ext === "xml") {
      setInputFormat(ext as Format);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputData(text);
      toast.success("File loaded successfully!");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // --- Conversion Logic ---
  const convertData = () => {
    if (!inputData.trim()) {
      toast.error("Please provide some input data to convert.");
      return;
    }

    if (inputFormat === outputFormat) {
      setOutputData(inputData);
      toast.info("Input and output formats are the same.");
      return;
    }

    try {
      let intermediateJson: any = null;

      // 1. Parse Input to Intermediate JSON Array/Object
      if (inputFormat === "csv") {
        const parsed = Papa.parse(inputData, { header: true, skipEmptyLines: true });
        if (parsed.errors.length > 0) throw new Error(parsed.errors[0].message);
        intermediateJson = parsed.data;
      } 
      else if (inputFormat === "json") {
        intermediateJson = JSON.parse(inputData);
      } 
      else if (inputFormat === "xml") {
        const parsedNode = xmlParser.parse(inputData);
        // Naive extraction: try to find the first array if the root is an object
        // Or just pass the parsed object entirely
        intermediateJson = parsedNode.root || parsedNode.data || parsedNode;
      }

      // 2. Stringify Intermediate JSON to Output Format
      if (outputFormat === "json") {
        setOutputData(JSON.stringify(intermediateJson, null, 2));
      } 
      else if (outputFormat === "csv") {
        // Ensure intermediateJson is an array for reliable CSV unparsing
        let arrayToParse = Array.isArray(intermediateJson) ? intermediateJson : [intermediateJson];
        
        // Sometimes XML parse gives { row: [{}, {}] }
        if (!Array.isArray(intermediateJson) && typeof intermediateJson === "object") {
           const keys = Object.keys(intermediateJson);
           if (keys.length === 1 && Array.isArray(intermediateJson[keys[0]])) {
             arrayToParse = intermediateJson[keys[0]];
           }
        }
        
        const csvString = Papa.unparse(arrayToParse);
        setOutputData(csvString);
      } 
      else if (outputFormat === "xml") {
        // XML requires a single root element usually
        const rootObj = { root: { record: intermediateJson } };
        const xmlString = xmlBuilder.build(rootObj);
        setOutputData(xmlString);
      }
      
      toast.success(`Successfully converted to ${outputFormat.toUpperCase()}!`);
    } catch (error: any) {
      console.error(error);
      toast.error(`Conversion Failed: ${error.message || "Invalid data format"}`);
      setOutputData("");
    }
  };

  const copyToClipboard = async () => {
    if (!outputData) return;
    try {
      await navigator.clipboard.writeText(outputData);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy text.");
    }
  };

  const downloadFile = () => {
    if (!outputData) return;
    const blob = new Blob([outputData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `converted.${outputFormat}`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm relative overflow-hidden flex flex-col pt-4">
        <CardContent className="p-6 space-y-6">
          
          <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-6 items-center">
            
            {/* Input Options Column */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">Input Format</Label>
                <Tabs value={inputFormat} onValueChange={(v) => setInputFormat(v as Format)} className="w-[200px]">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="csv">CSV</TabsTrigger>
                    <TabsTrigger value="json">JSON</TabsTrigger>
                    <TabsTrigger value="xml">XML</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="relative">
                <Textarea 
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder={`Paste your ${inputFormat.toUpperCase()} data here...`}
                  className="min-h-[300px] font-mono text-sm resize-none custom-scrollbar"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute bottom-4 right-4 gap-2 bg-background shadow-sm"
                  onClick={() => document.getElementById("data-upload")?.click()}
                >
                  <UploadCloud className="h-4 w-4" /> Upload File Instead
                </Button>
                <input 
                  id="data-upload"
                  type="file" 
                  className="hidden" 
                  accept=".csv,.json,.xml"
                  onChange={handleFileUpload}
                />
              </div>
            </div>

            {/* Convert Button */}
            <div className="flex flex-col items-center justify-center space-y-2 mt-8 lg:mt-0">
               <div className="hidden lg:flex w-full h-[1px] bg-border my-4" />
               <Button 
                onClick={convertData} 
                size="lg" 
                className="h-16 w-16 rounded-full flex items-center justify-center p-0 shadow-lg shrink-0"
                title="Convert"
              >
                 <ArrowRightLeft className="h-6 w-6" />
               </Button>
               <div className="hidden lg:flex w-full h-[1px] bg-border my-4" />
            </div>

            {/* Output Options Column */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">Output Format</Label>
                <Tabs value={outputFormat} onValueChange={(v) => setOutputFormat(v as Format)} className="w-[200px]">
                  <TabsList className="grid w-full grid-cols-3 bg-primary/10">
                    <TabsTrigger value="csv">CSV</TabsTrigger>
                    <TabsTrigger value="json">JSON</TabsTrigger>
                    <TabsTrigger value="xml">XML</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="relative">
                <Textarea 
                  readOnly
                  value={outputData}
                  placeholder={`Converted ${outputFormat.toUpperCase()} will appear here...`}
                  className="min-h-[300px] font-mono text-sm resize-none bg-muted/20 custom-scrollbar"
                />
                 {outputData && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button variant="outline" size="icon" onClick={copyToClipboard} className="h-8 w-8 bg-background shadow-sm" title="Copy to clipboard">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={downloadFile} className="h-8 w-8 bg-background shadow-sm" title="Download file">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={clearAll} className="h-8 w-8 text-destructive hover:text-destructive bg-background shadow-sm" title="Clear all">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

          </div>
          
        </CardContent>
      </Card>
      
    </div>
  );
}
