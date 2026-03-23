import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const allowedCategories = ['blog', 'news', 'guides'];
  if (!allowedCategories.includes(category)) return { title: 'Not Found' };
  
  return {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} - Web Tools Hub`,
    description: `Latest ${category} and updates from Web Tools Hub.`,
  };
}

export default async function CategoryArchivePage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const allowedCategories = ['blog', 'news', 'guides'];
  console.log(">>> [CategoryArchiveRouter] EVALUATING Collection Archive =", category);
  if (!allowedCategories.includes(category)) {
    console.log(">>> [CategoryArchiveRouter] ARCHIVE NOT RECOGNIZED. THROWING 404!");
    notFound();
  }

  let articles = [];
  try {
    const res = await fetch(`http://localhost:3001/articles?category=${category}`, { next: { revalidate: 60 } });
    if (res.ok) {
      articles = await res.json();
    }
  } catch (error) {
    console.error(`Failed to fetch ${category} archive:`, error);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col py-16">
      <div className="max-w-6xl mx-auto px-4 w-full">
        {/* Header */}
        <div className="mb-12 border-b pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 capitalize">
            {category}
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl">
            Discover the latest {category}, insights, and updates from our team to help you maximize your productivity.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No articles published yet</h3>
              <p className="text-gray-500">Check back later for new content in the {category} section.</p>
            </div>
          ) : (
            articles.map((article: any) => (
              <Link 
                key={article.id} 
                href={`/${locale}/${category}/${article.slug}`}
                className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Optional Image Area */}
                <div className="aspect-[16/9] w-full bg-gray-100 relative overflow-hidden">
                  {article.coverImage ? (
                    <img 
                      src={`http://localhost:3001${article.coverImage}`} 
                      alt=""
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-gray-50 flex items-center justify-center">
                      <span className="text-gray-300 font-bold text-4xl uppercase opacity-20">{category}</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center space-x-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    <span>{format(new Date(article.publishedAt), "MMM dd, yyyy")}</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  
                  <div className="mt-auto pt-6 flex items-center text-sm font-medium text-primary">
                    Read article <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
