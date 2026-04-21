import { ArrowLeft, Clock, Calendar, Share2, Bookmark, MessageCircle, Send, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { NewsArticle, CommentsConfig } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { formatDate } from '../lib/dateUtils';
import { BREAKING_NEWS, ENTERTAINMENT_NEWS, TECH_NEWS } from '../constants';
import { slugify } from '../lib/slugify';
import { useState, useEffect } from 'react';

import CommentSection from './CommentSection';
import ShareModal from './ShareModal';

interface ArticlePageProps {
  article: NewsArticle;
  config?: CommentsConfig;
  onBack: () => void;
}

export default function ArticlePage({ article, config, onBack }: ArticlePageProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  const recommended = [BREAKING_NEWS, ...ENTERTAINMENT_NEWS, ...TECH_NEWS]
    .filter(a => a.id !== article.id)
    .slice(0, 4);

  const totalSteps = 1 + (article.subSections?.length || 0);
  const isMultiPage = article.displayMode === 'multi' && totalSteps > 1;

  // Reset page when article changes and re-parse social widgets
  useEffect(() => {
    setActiveStep(0);
    
    // Re-parse social widgets after content render
    const timer = setTimeout(() => {
      // @ts-ignore
      if (window.twttr?.widgets) {
        // @ts-ignore
        window.twttr.widgets.load();
      }
      // @ts-ignore
      if (window.FB?.XFBML) {
        // @ts-ignore
        window.FB.XFBML.parse();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [article.id]);

  // Re-parse when step changes (multi-page mode)
  useEffect(() => {
    const timer = setTimeout(() => {
      // @ts-ignore
      if (window.twttr?.widgets) {
        // @ts-ignore
        window.twttr.widgets.load();
      }
      // @ts-ignore
      if (window.FB?.XFBML) {
        // @ts-ignore
        window.FB.XFBML.parse();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [activeStep]);

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
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold uppercase tracking-widest text-xs">Powrót</span>
          </button>

          {isMultiPage && (
            <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full border border-outline scale-90 md:scale-100">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <Layers className="w-3 h-3" /> Strona {activeStep + 1} z {totalSteps}
              </span>
              <div className="flex gap-1 border-l border-white/10 pl-4 text-on-surface-variant">
                <button 
                  onClick={() => {
                    setActiveStep(s => Math.max(0, s-1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  disabled={activeStep === 0}
                  className="p-1 hover:text-primary disabled:opacity-30 disabled:hover:text-on-surface-variant transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="w-[1px] h-3 bg-white/10 self-center"></div>
                <button 
                  onClick={() => {
                    setActiveStep(s => Math.min(totalSteps-1, s+1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  disabled={activeStep === totalSteps-1}
                  className="p-1 hover:text-primary disabled:opacity-30 disabled:hover:text-on-surface-variant transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

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
            {activeStep === 0 ? article.title : article.subSections![activeStep-1].title || article.title}
          </h1>

          {activeStep === 0 && (
            <p className="text-lg text-on-surface-variant leading-relaxed font-medium break-words italic border-l-4 border-primary/20 pl-6">
              {article.description}
            </p>
          )}
        </header>

        <div className="mb-12">
          <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-surface-container shadow-2xl relative group/img">
            <img 
              src={activeStep === 0 ? article.imageUrl : article.subSections![activeStep-1].imageUrl || article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {activeStep > 0 && article.subSections![activeStep-1].title && (
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-bold text-lg">{article.subSections![activeStep-1].title}</p>
              </div>
            )}
          </div>
          {(activeStep === 0 ? article.imageSource : article.subSections![activeStep-1]?.imageSource) && (
            <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2 opacity-60">
              <span className="w-4 h-[1px] bg-on-surface-variant/30"></span>
              {activeStep === 0 ? article.imageSource : article.subSections![activeStep-1].imageSource}
            </p>
          )}
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="max-w-none text-on-surface/90 leading-loose text-lg break-words space-y-8"
              >
                {/* Main Content or Sub-section Content */}
                {activeStep === 0 ? (
                  <div 
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.content || article.description }} 
                  />
                ) : (
                  <div className="space-y-8">
                    <div 
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: article.subSections![activeStep-1].content }} 
                    />
                  </div>
                )}

                {/* Show all sub-sections if NOT in multi-page mode */}
                {!isMultiPage && activeStep === 0 && article.subSections?.map((sub, idx) => (
                  <div key={sub.id} className="pt-16 mt-16 border-t border-outline space-y-8">
                    <div className="flex items-center gap-4">
                      <span className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center font-black text-xs">{idx + 1}</span>
                      <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tight">{sub.title}</h2>
                    </div>
                    {sub.imageUrl && (
                      <div className="space-y-3">
                        <div className="aspect-video rounded-2xl overflow-hidden bg-surface-container shadow-lg">
                          <img src={sub.imageUrl} alt={sub.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        {sub.imageSource && (
                          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2 opacity-60">
                            <span className="w-4 h-[1px] bg-on-surface-variant/30"></span>
                            {sub.imageSource}
                          </p>
                        )}
                      </div>
                    )}
                    <div 
                      className="prose prose-invert max-w-none text-on-surface/80"
                      dangerouslySetInnerHTML={{ __html: sub.content }} 
                    />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Navigation for Multi-page */}
            {isMultiPage && (
              <div className="flex justify-between items-center mt-12 py-8 border-y border-outline">
                <button 
                  onClick={() => {
                    setActiveStep(s => Math.max(0, s-1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  disabled={activeStep === 0}
                  className="flex items-center gap-2 bg-surface-container-low px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-on-primary disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Poprzednia
                </button>
                <div className="hidden md:flex gap-2">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveStep(i);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${activeStep === i ? 'bg-primary w-6' : 'bg-white/10 hover:bg-white/30'}`}
                    />
                  ))}
                </div>
                <button 
                  onClick={() => {
                    setActiveStep(s => Math.min(totalSteps-1, s+1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  disabled={activeStep === totalSteps-1}
                  className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 disabled:opacity-30 transition-all shadow-lg shadow-primary/20"
                >
                  Następna <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex gap-4 mt-12 py-6 border-y border-outline">
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
