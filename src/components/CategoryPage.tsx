import { ArrowLeft } from 'lucide-react';
import { NewsArticle, CommentsConfig } from '../types';
import NewsCard from './NewsCard';
import { motion } from 'motion/react';
import SEO from './SEO';

interface CategoryPageProps {
  category: string;
  articles: NewsArticle[];
  config?: CommentsConfig;
  onBack: () => void;
}

export default function CategoryPage({ category, articles, config, onBack }: CategoryPageProps) {
  const origin = window.location.origin;
  const canonicalUrl = `${origin}/category/${category}`;
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Strona główna", "item": origin },
      { "@type": "ListItem", "position": 2, "name": category }
    ]
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-surface py-2"
    >
      <SEO 
        title={category}
        description={`Najnowsze wiadomości i artykuły z kategorii ${category}. Bądź na bieżąco z Pulse News.`}
        canonical={canonicalUrl}
        structuredData={breadcrumbSchema}
      />
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-surface-container rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter text-on-surface">
            {category}
          </h1>
        </div>
        <span className="text-on-surface-variant font-bold uppercase tracking-widest text-[10px]">
          {articles.length} ARTYKUŁÓW
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((article) => (
          <NewsCard 
            key={article.id} 
            article={article} 
            showCommentsCount={config?.showCount}
          />
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-24">
          <p className="text-on-surface-variant text-xl italic">Brak artykułów w tej kategorii.</p>
        </div>
      )}
    </motion.div>
  );
}
