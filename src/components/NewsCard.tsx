import { NewsArticle } from '../types';
import { motion } from 'motion/react';
import { slugify } from '../lib/slugify';
import { formatDate } from '../lib/dateUtils';
import { MessageSquare } from 'lucide-react';
import { useCommentsCount } from '../hooks/useCommentsCount';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'horizontal' | 'small';
  linkColor?: string;
  key?: string | number;
  showDescription?: boolean;
  showDate?: boolean;
  showCategory?: boolean;
  showReadTime?: boolean;
  showCommentsCount?: boolean;
}

export default function NewsCard({ 
  article, 
  variant = 'default', 
  linkColor,
  showDescription = true,
  showDate = true,
  showCategory = true,
  showReadTime = true,
  showCommentsCount = false
}: NewsCardProps) {
  const articleLink = `#article/${article.id}/${slugify(article.title)}`;
  const categoryLink = `#category/${article.category}`;
  const commentsCount = useCommentsCount(article.id);

  if (variant === 'horizontal') {
    return (
      <motion.article 
        className="flex flex-col md:flex-row gap-6 items-start cursor-pointer"
      >
        <a href={articleLink} className="relative w-full md:w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-surface-container">
          {showCommentsCount && commentsCount > 0 && (
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1 text-[10px] bg-primary text-on-primary px-2 py-0.5 rounded-full font-bold shadow-lg">
              <MessageSquare className="w-3 h-3" /> {commentsCount}
            </div>
          )}
          <img 
            className="w-full h-full object-cover" 
            src={article.imageUrl} 
            alt={article.title}
            referrerPolicy="no-referrer"
          />
        </a>
        <div className="flex-1 overflow-hidden">
          <div className="mb-2">
            <a href={articleLink}>
              <h4 
                className="font-headline text-lg font-bold hover:text-primary hover:underline transition-colors leading-tight break-words"
                style={{ color: linkColor }}
              >
                {article.title}
              </h4>
            </a>
          </div>
          {showDescription && (
            <p className="text-on-surface-variant text-sm line-clamp-2 break-words">
              {article.description}
            </p>
          )}
          {(showDate || showReadTime) && (
            <span className="text-on-surface-variant text-[10px] mt-2 block uppercase tracking-widest font-bold">
              {showDate && formatDate(article.timestamp)} 
              {showDate && showReadTime && ' • '} 
              {showReadTime && `${article.readTime} czytania`}
            </span>
          )}
        </div>
      </motion.article>
    );
  }

  if (variant === 'small') {
    return (
      <a href={articleLink}>
        <motion.article 
          className="bg-surface-container-low p-4 rounded-2xl shadow-sm border border-white/5 cursor-pointer h-full relative"
        >
          {showCommentsCount && commentsCount > 0 && (
            <div className="absolute top-6 right-6 z-10 flex items-center gap-1 text-[10px] bg-primary text-on-primary px-2 py-0.5 rounded-full font-bold shadow-lg">
              <MessageSquare className="w-3 h-3" /> {commentsCount}
            </div>
          )}
          <div className="aspect-square rounded-xl overflow-hidden mb-4">
            <img 
              className="w-full h-full object-cover" 
              src={article.imageUrl} 
              alt={article.title}
              referrerPolicy="no-referrer"
            />
          </div>
          <h5 
            className="font-bold text-sm leading-snug line-clamp-2 hover:text-primary hover:underline transition-colors"
            style={{ color: linkColor }}
          >
            {article.title}
          </h5>
        </motion.article>
      </a>
    );
  }

  return (
    <motion.article 
      className="cursor-pointer"
    >
      <a href={articleLink} className="relative block aspect-[16/9] overflow-hidden rounded-2xl mb-4 bg-surface-container">
        {showCommentsCount && commentsCount > 0 && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1 text-xs bg-primary text-on-primary px-3 py-1 rounded-full font-bold shadow-xl">
            <MessageSquare className="w-3 h-3" /> {commentsCount}
          </div>
        )}
        <img 
          className="w-full h-full object-cover" 
          src={article.imageUrl} 
          alt={article.title}
          referrerPolicy="no-referrer"
        />
      </a>
      {showCategory && (
        <a href={categoryLink} className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-1 rounded-sm uppercase mb-2 inline-block tracking-widest hover:bg-primary hover:text-on-primary transition-colors">
          {article.category}
        </a>
      )}
      <a href={articleLink} className="block">
        <h4 
          className="font-headline text-xl font-bold mb-2 hover:text-primary hover:underline transition-colors leading-tight break-words"
          style={{ color: linkColor }}
        >
          {article.title}
        </h4>
      </a>
      {showDescription && (
        <p className="text-on-surface-variant text-sm line-clamp-2 break-words">
          {article.description}
        </p>
      )}
    </motion.article>
  );
}
