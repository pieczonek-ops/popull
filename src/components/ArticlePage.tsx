import { ArrowLeft, Clock, Calendar, Share2, Bookmark, MessageCircle, Send } from 'lucide-react';
import { NewsArticle, CommentsConfig } from '../types';
import { motion } from 'motion/react';
import { formatDate } from '../lib/dateUtils';
import { BREAKING_NEWS, ENTERTAINMENT_NEWS, TECH_NEWS } from '../constants';
import { slugify } from '../lib/slugify';
import { useState } from 'react';

import CommentSection from './CommentSection';
import ShareModal from './ShareModal';

interface ArticlePageProps {
  article: NewsArticle;
  config?: CommentsConfig;
  onBack: () => void;
}

export default function ArticlePage({ article, config, onBack }: ArticlePageProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const recommended = [BREAKING_NEWS, ...ENTERTAINMENT_NEWS, ...TECH_NEWS]
    .filter(a => a.id !== article.id)
    .slice(0, 4);

  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: article.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
        setIsShareModalOpen(true);
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface"
    >
      <div className="py-2">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase tracking-widest text-xs">Powrót</span>
        </button>

        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              {article.category}
            </span>
            <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium">
              <Calendar className="w-4 h-4" />
              {formatDate(article.timestamp)}
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium">
              <Clock className="w-4 h-4" />
              {article.readTime} czytania
            </div>
          </div>

          <h1 className="text-3xl lg:text-5xl font-black text-on-surface leading-tight mb-8 tracking-tight break-words">
            {article.title}
          </h1>

          <p className="text-lg text-on-surface-variant leading-relaxed font-medium break-words italic border-l-4 border-primary/20 pl-6">
            {article.description}
          </p>
        </header>

        <div className="aspect-[16/9] rounded-3xl overflow-hidden mb-12 bg-surface-container shadow-2xl">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="max-w-none text-on-surface/90 leading-loose text-lg break-words space-y-6"
              dangerouslySetInnerHTML={{ __html: article.content || article.description }}
            />
            
            {/* Actions */}
            <div className="flex gap-4 mt-12 py-6 border-y border-white/5">
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all"
              >
                <Share2 className="w-4 h-4" /> Udostępnij
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all">
                <Bookmark className="w-4 h-4" /> Zapisz
              </button>
            </div>

            <ShareModal 
              isOpen={isShareModalOpen} 
              onClose={() => setIsShareModalOpen(false)} 
              title={article.title}
              url={`#article/${article.id}/${slugify(article.title)}`}
            />

            {/* Comment Section */}
            <CommentSection articleId={article.id} config={config} />

            {/* Recommended/More */}
            <section className="mt-20">
              <h3 className="text-2xl font-black mb-10 uppercase tracking-tight">Polecane artykuły</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recommended.map((item) => (
                  <a 
                    key={item.id}
                    href={`#article/${item.id}/${slugify(item.title)}`}
                    className="group"
                  >
                    <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-surface-container">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <h5 className="font-bold text-base leading-tight group-hover:text-primary group-hover:underline transition-colors line-clamp-2">
                      {item.title}
                    </h5>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
