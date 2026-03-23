import { ReactNode } from "react";
import { AdSenseSlot } from "@/components/tools/adsense-slot";
import { getPopularTools } from "@/lib/tools-registry";
import { ToolCard } from "@/components/tools/tool-card";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function ToolsLayout({ children }: { children: ReactNode }) {
  const popularTools = getPopularTools().slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      {/* Breadcrumb / Top Area */}
      <nav className="mb-6 flex items-center text-sm text-muted-foreground">
        <Link href="/" className="flex items-center hover:text-foreground transition-colors">
          <Home className="h-4 w-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground">Tools</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Area */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-8">
          {children}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-8">
          {/* Ad Slot */}
          <div className="sticky top-24 space-y-8">
            <AdSenseSlot slotId="sidebar-top-12345" className="bg-card w-full" />

            {/* Popular Tools Widget */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-muted/30">
                <h3 className="font-semibold text-lg">Popular Tools</h3>
              </div>
              <div className="p-4 flex flex-col gap-4">
                {popularTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.slug}
                      href={tool.path}
                      className="group flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium text-sm group-hover:text-primary transition-colors">
                          {tool.name}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {tool.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
            
            <AdSenseSlot slotId="sidebar-bottom-98765" className="bg-card w-full" />
          </div>
        </aside>
      </div>
    </div>
  );
}
