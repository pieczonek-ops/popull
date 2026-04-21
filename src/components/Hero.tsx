import { ArrowRight, Play, Star, Zap, Info, MessageSquare } from 'lucide-react';
import { NewsArticle, HomeConfig } from '../types';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { slugify } from '../lib/slugify';
import { formatDate } from '../lib/dateUtils';
import { useCommentsCount } from '../hooks/useCommentsCount';

interface HeroProps {
  article: NewsArticle;
  config?: HomeConfig['hero'];
}

const ICONS = {
  'ArrowRight': ArrowRight,
  'Play': Play,
  'Star': Star,
  'Zap': Zap,
  'Info': Info
};

export default function Hero({ article, config }: HeroProps) {
  const articleLink = `/article/${article.id}/${slugify(article.title)}`;
  const commentsCount = useCommentsCount(article.id);
  
  const ButtonIcon = config?.buttonIcon ? (ICONS[config.buttonIcon as keyof typeof ICONS] || ArrowRight) : ArrowRight;

  const buttonStyles = {
    solid: `bg-primary text-on-primary`,
    outline: `border-2 border-primary text-primary hover:bg-primary hover:text-on-primary`,
    gradient: `bg-gradient-to-r from-primary to-primary/80 text-on-primary`
  };

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
        <h2 className="font-headline text-xs font-bold uppercase tracking-widest text-primary">Najważniejsze dzisiaj</h2>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-3xl lg:rounded-xl aspect-[16/9] lg:aspect-[21/9] ${config?.backgroundColor ? '' : 'bg-surface-container-low'}`}
        style={{ backgroundColor: config?.backgroundColor }}
      >
        <img 
          className="w-full h-full object-cover" 
          src={article.imageUrl}
          alt={article.title}
          referrerPolicy="no-referrer"
          fetchPriority="high"
          loading="eager"
          decoding="sync"
        />
        <div className="absolute bottom-0 left-0 p-6 lg:p-12 w-full lg:max-w-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="inline-block bg-primary px-3 py-1 rounded-sm text-[10px] font-bold text-on-primary uppercase tracking-widest">
              {article.category}
            </div>
            <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
              {formatDate(article.timestamp)}
            </span>
            {config?.showCommentsCount && commentsCount > 0 && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10">
                <MessageSquare className="w-3 h-3" /> {commentsCount} {commentsCount === 1 ? 'komentarz' : 'komentarze'}
              </div>
            )}
          </div>
          <Link to={articleLink} className="block">
            <h1 
              className="font-headline text-3xl lg:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight hover:text-primary hover:underline transition-colors"
              style={{ color: config?.textColor }}
            >
              {article.title}
            </h1>
          </Link>
          <p className="text-white/80 text-sm lg:text-base max-w-xl line-clamp-2 mb-6">
            {article.description}
          </p>
          <Link 
            to={articleLink} 
            className={`${buttonStyles[config?.buttonType || 'gradient']} px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 w-fit transition-transform active:scale-95`}
            style={{ backgroundColor: config?.buttonType === 'solid' ? config?.buttonColor : undefined, borderColor: config?.buttonType === 'outline' ? config?.buttonColor : undefined, color: config?.buttonType === 'outline' ? config?.buttonColor : undefined }}
          >
            Czytaj dalej <ButtonIcon className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
