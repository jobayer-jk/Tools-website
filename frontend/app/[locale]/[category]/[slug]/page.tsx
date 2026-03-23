import { notFound } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from 'next';

export const revalidate = 60; // Revalidate public articles every 60 seconds

export async function generateMetadata({ params }: { params: Promise<{ category: string, slug: string }> }): Promise<Metadata> {
  try {
    const { category, slug } = await params;
    const res = await fetch(`http://localhost:3001/articles/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return { title: 'Article Not Found' };
    const article = await res.json();
    return {
      title: `${article.title} - Web Tools Hub`,
      description: `Read ${article.title} under the ${category} category.`,
      openGraph: {
        images: article.coverImage ? [article.coverImage] : [],
      }
    };
  } catch {
    return { title: 'Article' };
  }
}

export default async function PublicArticlePage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, category, slug } = await params;
  
  // Validate that this dynamic route is genuinely meant for articles like /blog, /news
  // (Prevents matching static files or unexpected top-level routes traversing here)
  const allowedCategories = ['blog', 'news', 'guides'];
  console.log(">>> [CategorySlugRouter] EVALUATING Category =", category, "Slug =", slug);
  if (!allowedCategories.includes(category)) {
    console.log(">>> [CategorySlugRouter] NOT RECOGNIZED AS BLOG ARCHIVE. THROWING 404!");
    notFound();
  }

  let article = null;
  try {
    const res = await fetch(`http://localhost:3001/articles/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      if (res.status === 404) notFound();
      throw new Error("Failed to fetch article from backend");
    }
    article = await res.json();
  } catch (error) {
    console.error("Failed to fetch article:", error);
    notFound();
  }

  // Double check the fetched article actually matches the URL category strictly
  if (article.category !== category) {
      notFound();
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Article Hero Header */}
      <header className="py-16 md:py-24 bg-gray-50/50 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Link 
            href={`/${locale}/${category}`}
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors uppercase tracking-wider bg-primary/5 px-3 py-1 rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {category}
          </Link>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mx-auto max-w-3xl leading-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 font-medium pt-4">
            <span className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {article.author?.email?.split('@')[0] || "Admin"}
            </span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {format(new Date(article.publishedAt), "MMMM do, yyyy")}
            </span>
          </div>
        </div>
      </header>

      {/* Optional Cover Image */}
      {article.coverImage && (
        <div className="w-full max-w-5xl mx-auto -mt-8 relative z-10 px-4 sm:px-6">
          <div className="aspect-[16/9] md:aspect-[21/9] w-full relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5">
            {/* Warning: In production, configure next.config.mjs to allow image domains if hitting external URLs */}
            <img 
              src={`http://localhost:3001${article.coverImage}`} 
              alt={article.title}
              className="object-cover w-full h-full" 
            />
          </div>
        </div>
      )}

      {/* Rich Text Body Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        {/* We use prose classes from Tailwind Typography plugin to automatically style the raw HTML safely */}
        <div 
          className="prose prose-lg prose-slate md:prose-xl mx-auto prose-img:rounded-xl prose-img:shadow-md prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80"
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />
      </div>
    </article>
  );
}
