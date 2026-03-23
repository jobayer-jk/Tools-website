import Link from "next/link";
import { type Tool } from "@/lib/tools-registry";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <Link href={tool.path} className="block group">
      <Card
        className={cn(
          "h-full overflow-hidden transition-all duration-300 border-none bg-secondary/30 hover:bg-secondary/50 shadow-md hover:shadow-lg relative",
          className
        )}
      >
        <CardHeader className="p-4 flex flex-col gap-3 h-full">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
              <Icon className="h-5 w-5" />
            </div>
            {tool.isNew && (
              <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30">
                New
              </Badge>
            )}
            {!tool.isNew && tool.isPopular && (
              <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10">
                Popular
              </Badge>
            )}
          </div>
          <div className="mt-2 space-y-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {tool.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {tool.description}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
