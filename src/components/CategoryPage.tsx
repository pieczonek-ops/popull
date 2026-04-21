import { ArrowLeft } from 'lucide-react';
import { NewsArticle, CommentsConfig } from '../types';
import NewsCard from './NewsCard';
import { motion } from 'motion/react';

interface CategoryPageProps {
  category: string;
  articles: NewsArticle[];
  config?: CommentsConfig;
  onBack: () => void;
}

export default function CategoryPage({ category, articles, config, onBack }: CategoryPageProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-surface py-2"
    >
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
