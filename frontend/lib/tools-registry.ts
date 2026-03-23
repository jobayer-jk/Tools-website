import {
  Wrench,
  Image as ImageIcon,
  FileText,
  FileDigit,
  Calculator,
  QrCode,
  Type,
  Baseline,
  Settings,
  Shield,
  Palette,
  AlignLeft,
  FileJson,
  Code,
  Link,
  Keyboard,
  Hash,
  FileDiff,
  AlignJustify,
  Clock,
  Ruler,
  Minimize,
  Maximize,
  Crop,
  RefreshCcw,
  Droplet,
  Stamp,
  Camera,
  Layers,
  FileImage,
  Video,
  Music,
  Archive,
  Wand2,
  Sparkles,
  Search,
  Zap,
} from "lucide-react";

export type ToolCategorySlug =
  | "utility"
  | "productivity"
  | "qr-barcode"
  | "image"
  | "pdf"
  | "conversion"
  | "ai"
  | "platform";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  icon: any; // Lucide icon
  category: ToolCategorySlug;
  path: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export interface ToolCategory {
  slug: ToolCategorySlug;
  name: string;
  description: string;
  icon: any;
  tools: Tool[];
}

export const toolsRegistry: Tool[] = [
  // UTILITY TOOLS
  {
    slug: "password-generator",
    name: "Password Generator",
    description: "Generate highly secure, random passwords instantly.",
    icon: Shield,
    category: "utility",
    path: "/tools/password-generator",
    isPopular: true,
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder/Decoder",
    description: "Encode and decode text or files to Base64 format.",
    icon: Settings,
    category: "utility",
    path: "/tools/base64-encoder",
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and beautify JSON data.",
    icon: FileJson,
    category: "utility",
    path: "/tools/json-formatter",
    isPopular: true,
  },
  {
    slug: "code-minifier",
    name: "Code Minifier",
    description: "Minify HTML, CSS, and JS to reduce file size.",
    icon: Code,
    category: "utility",
    path: "/tools/code-minifier",
  },
  {
    slug: "url-encoder",
    name: "URL Encoder/Decoder",
    description: "Safely encode or decode URLs and parameters.",
    icon: Link,
    category: "utility",
    path: "/tools/url-encoder",
  },
  {
    slug: "color-converter",
    name: "Color Converter",
    description: "Convert colors between HEX, RGB, HSL, and more.",
    icon: Palette,
    category: "utility",
    path: "/tools/color-converter",
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256 hashes from text.",
    icon: Hash,
    category: "utility",
    path: "/tools/hash-generator",
  },
  {
    slug: "diff-checker",
    name: "Text Diff Checker",
    description: "Compare two texts and highlight the differences.",
    icon: FileDiff,
    category: "utility",
    path: "/tools/diff-checker",
  },
  {
    slug: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    description: "Generate dummy text for your designs and layouts.",
    icon: AlignJustify,
    category: "utility",
    path: "/tools/lorem-ipsum",
  },

  // PRODUCTIVITY TOOLS
  {
    slug: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, sentences, and paragraphs.",
    icon: Type,
    category: "productivity",
    path: "/tools/word-counter",
    isPopular: true,
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    description: "Convert text to uppercase, lowercase, title case, etc.",
    icon: Baseline,
    category: "productivity",
    path: "/tools/case-converter",
    isPopular: true,
  },
  {
    slug: "online-notepad",
    name: "Online Notepad",
    description: "Distraction-free text editor that saves in your browser.",
    icon: Keyboard,
    category: "productivity",
    path: "/tools/online-notepad",
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    description: "Convert length, weight, temperature, and more.",
    icon: Ruler,
    category: "productivity",
    path: "/tools/unit-converter",
  },
  {
    slug: "freelance-calculator",
    name: "Freelance Hourly Rate Calculator",
    description: "Calculate your ideal hourly rate based on income goals.",
    icon: Calculator,
    category: "productivity",
    path: "/tools/freelance-calculator",
    isPopular: true,
  },

  // QR & BARCODE TOOLS
  {
    slug: "qr-generator",
    name: "QR Code Generator",
    description: "Create custom QR codes with colors and logos.",
    icon: QrCode,
    category: "qr-barcode",
    path: "/tools/qr-generator",
    isPopular: true,
  },
  {
    slug: "qr-reader",
    name: "QR Code Scanner",
    description: "Scan and decode QR codes from images or webcam.",
    icon: Search,
    category: "qr-barcode",
    path: "/tools/qr-reader",
  },
  {
    slug: "barcode-generator",
    name: "Barcode Generator",
    description: "Generate EAN, UPC, Code128, and other barcodes.",
    icon: FileDigit,
    category: "qr-barcode",
    path: "/tools/barcode-generator",
  },

  // IMAGE TOOLS
  {
    slug: "image-resizer",
    name: "Image Resizer",
    description: "Resize images to specific dimensions easily.",
    icon: Maximize,
    category: "image",
    path: "/tools/image-resizer",
    isPopular: true,
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description: "Reduce image file size without losing quality.",
    icon: Minimize,
    category: "image",
    path: "/tools/image-compressor",
    isPopular: true,
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    description: "Crop images to preset or custom aspect ratios.",
    icon: Crop,
    category: "image",
    path: "/tools/image-cropper",
  },
  {
    slug: "image-converter",
    name: "Image Format Converter",
    description: "Convert between JPG, PNG, WEBP, GIF, and more.",
    icon: RefreshCcw,
    category: "image",
    path: "/tools/image-converter",
    isPopular: true,
  },


  // PDF TOOLS
  {
    slug: "merge-pdf",
    name: "PDF Merger",
    description: "Combine multiple PDF files into a single document.",
    icon: Layers,
    category: "pdf",
    path: "/tools/merge-pdf",
    isPopular: true,
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    description: "Extract pages from your PDF or save each page as a separate PDF.",
    icon: FileText,
    category: "pdf",
    path: "/tools/split-pdf",
  },
  {
    slug: "remove-pdf-pages",
    name: "Remove PDF Pages",
    description: "Delete unnecessary pages from your PDF document easily.",
    icon: FileDigit,
    category: "pdf",
    path: "/tools/remove-pdf-pages",
  },
  {
    slug: "watermark-pdf",
    name: "Watermark PDF",
    description: "Add text or image watermarks directly to your PDF files.",
    icon: Stamp,
    category: "pdf",
    path: "/tools/watermark-pdf",
  },
  {
    slug: "image-to-pdf",
    name: "Image to PDF",
    description: "Convert your images into a PDF document.",
    icon: ImageIcon,
    category: "pdf",
    path: "/tools/image-to-pdf",
  },

  // CONVERSION TOOLS
  {
    slug: "video-to-gif",
    name: "Video to GIF",
    description: "Convert short video clips into animated GIFs.",
    icon: Video,
    category: "conversion",
    path: "/tools/video-to-gif",
  },
  {
    slug: "audio-converter",
    name: "Audio Converter",
    description: "Convert audio files between MP3, WAV, AAC, etc.",
    icon: Music,
    category: "conversion",
    path: "/tools/audio-converter",
  },
  {
    slug: "archive-extractor",
    name: "Archive Extractor",
    description: "Extract ZIP, RAR, and 7Z archives online.",
    icon: Archive,
    category: "conversion",
    path: "/tools/archive-extractor",
  },

  // AI TOOLS
  {
    slug: "ai-background-remover",
    name: "AI Background Remover",
    description: "Automatically remove backgrounds from images.",
    icon: Wand2,
    category: "ai",
    path: "/tools/ai-background-remover",
    isNew: true,
    isPopular: true,
  },
  {
    slug: "ai-image-enhancer",
    name: "AI Image Enhancer",
    description: "Upscale and enhance image quality using AI.",
    icon: Sparkles,
    category: "ai",
    path: "/tools/ai-image-enhancer",
    isNew: true,
  },
];

export const toolCategories: ToolCategory[] = [
  {
    slug: "utility",
    name: "Utility & Dev",
    description: "Essential tools for developers and technical users.",
    icon: Wrench,
    tools: toolsRegistry.filter((t) => t.category === "utility"),
  },
  {
    slug: "productivity",
    name: "Productivity",
    description: "Tools to help you write, calculate, and organize.",
    icon: Zap,
    tools: toolsRegistry.filter((t) => t.category === "productivity"),
  },
  {
    slug: "image",
    name: "Image Tools",
    description: "Edit, convert, and enhance your images.",
    icon: ImageIcon,
    tools: toolsRegistry.filter((t) => t.category === "image"),
  },
  {
    slug: "pdf",
    name: "PDF Tools",
    description: "Merge, split, and convert PDF documents.",
    icon: FileText,
    tools: toolsRegistry.filter((t) => t.category === "pdf"),
  },
  {
    slug: "qr-barcode",
    name: "QR & Barcodes",
    description: "Generate and scan QR codes and barcodes.",
    icon: QrCode,
    tools: toolsRegistry.filter((t) => t.category === "qr-barcode"),
  },
  {
    slug: "conversion",
    name: "File Conversion",
    description: "Convert audio, video, documents, and archives.",
    icon: RefreshCcw,
    tools: toolsRegistry.filter((t) => t.category === "conversion"),
  },
  {
    slug: "ai",
    name: "AI Tools",
    description: "Smart tools powered by Artificial Intelligence.",
    icon: Sparkles,
    tools: toolsRegistry.filter((t) => t.category === "ai"),
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return toolsRegistry.find((t) => t.slug === slug);
}

export function getCategoryBySlug(slug: string): ToolCategory | undefined {
  return toolCategories.find((c) => c.slug === slug);
}

export function getAllTools(): Tool[] {
  return toolsRegistry;
}

export function getPopularTools(): Tool[] {
  return toolsRegistry.filter((t) => t.isPopular);
}

export function getNewTools(): Tool[] {
  return toolsRegistry.filter((t) => t.isNew);
}
