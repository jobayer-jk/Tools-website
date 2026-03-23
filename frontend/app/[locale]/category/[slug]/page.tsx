import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/tools-registry";
import { ToolCard } from "@/components/tools/tool-card";
import { Wrench } from "lucide-react";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;

  const category = getCategoryBySlug(resolvedParams.slug);
  if (!category) {
    notFound();
  }

  const tools = category.tools;

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8 min-h-[70vh]">
      <div className="mb-12 text-center space-y-4 flex flex-col items-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary/50 text-primary mb-2 shadow-sm">
          <category.icon className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          {category.name}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {category.description}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tools.length > 0 ? (
          tools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)
        ) : (
          <div className="col-span-full py-20 text-center text-muted-foreground flex flex-col items-center">
            <Wrench className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-xl font-medium">No tools currently published in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
