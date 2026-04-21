import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Sidebar from './components/Sidebar';
import NewsCard from './components/NewsCard';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import AdminPanel from './components/AdminPanel';
import ArticlePage from './components/ArticlePage';
import CategoryPage from './components/CategoryPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BREAKING_NEWS, ENTERTAINMENT_NEWS, TECH_NEWS, AMAZING_NEWS } from './constants';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { db } from './firebase';
import { NewsArticle, HomeConfig } from './types';
import { LayoutDashboard } from 'lucide-react';

function MainContent() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [homeConfig, setHomeConfig] = useState<HomeConfig | null>(null);
  const { user } = useAuth();

  // Simple routing based on URL hash
  const [route, setRoute] = useState(window.location.hash || '#home');

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#home');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'articles'), orderBy('timestamp', 'desc'));
    const unsubscribeArticles = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as NewsArticle));
      setArticles(docs);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      setLoading(false);
    });

    const unsubscribeConfig = onSnapshot(doc(db, 'config', 'home'), (snapshot) => {
      if (snapshot.exists()) {
        setHomeConfig(snapshot.data() as HomeConfig);
      }
    });

    return () => {
      unsubscribeArticles();
      unsubscribeConfig();
    };
  }, []);

  // Merge static constants with dynamic articles from Firebase
  const allArticles = [...articles];
  
  // Routing logic
  if (route === '#admin') {
    return <AdminPanel />;
  }

  const heroArticle = homeConfig?.hero.articleId 
    ? allArticles.find(a => a.id === homeConfig.hero.articleId) || [BREAKING_NEWS, ...ENTERTAINMENT_NEWS, ...TECH_NEWS, ...AMAZING_NEWS].find(a => a.id === homeConfig.hero.articleId) || BREAKING_NEWS
    : allArticles.find(a => a.isBreaking) || BREAKING_NEWS;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="pt-24 pb-12 px-4 lg:px-8 max-w-screen-2xl mx-auto w-full flex-grow">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 overflow-hidden">
            {/* Route Content Area */}
            {route === '#home' && (
              <div className="space-y-10">
                <Hero article={heroArticle} config={homeConfig?.hero} />
                
                {homeConfig?.sections && homeConfig.sections.length > 0 ? (
                  homeConfig.sections.map((section) => {
                    const sectionArticles = allArticles.filter(a => a.category === section.category).length > 0
                      ? allArticles.filter(a => a.category === section.category).slice(0, section.count)
                      : [BREAKING_NEWS, ...ENTERTAINMENT_NEWS, ...TECH_NEWS, ...AMAZING_NEWS].filter(a => a.category === section.category).slice(0, section.count);

                    return (
                      <div 
                        key={section.id} 
                        className={`p-8 rounded-3xl border border-outline relative overflow-hidden ${section.backgroundColor || section.backgroundImageUrl ? '' : 'bg-surface-container-low/50'}`} 
                        style={{ 
                          backgroundColor: section.backgroundColor,
                          backgroundImage: section.backgroundImageUrl ? `url(${section.backgroundImageUrl})` : undefined,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        {section.backgroundImageUrl && <div className="absolute inset-0 bg-surface/60 backdrop-blur-[2px] z-0"></div>}
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-8">
                            <h3 className="font-headline text-2xl font-black text-on-surface uppercase tracking-tight" style={{ color: section.titleColor }}>
                              {section.title}
                            </h3>
                            {section.showSeeMore !== false && (
                              <a 
                                className="text-primary text-xs font-bold uppercase tracking-widest hover:underline" 
                                href={`#category/${section.category}`} 
                                style={{ color: section.seeMoreColor || section.linkColor }}
                              >
                                {section.seeMoreText || 'Zobacz więcej'}
                              </a>
                            )}
                          </div>
                          
                          {section.layout === 'grid' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {sectionArticles.map((article) => (
                                <NewsCard 
                                  key={article.id} 
                                  article={article} 
                                  linkColor={section.linkColor}
                                  showDescription={section.showDescription}
                                  showDate={section.showDate}
                                  showCategory={section.showCategory}
                                  showReadTime={section.showReadTime}
                                  showCommentsCount={section.showCommentsCount}
                                />
                              ))}
                            </div>
                          )}

                          {section.layout === 'horizontal' && (
                            <div className="space-y-8">
                              {sectionArticles.map((article) => (
                                <NewsCard 
                                  key={article.id} 
                                  article={article} 
                                  variant="horizontal" 
                                  linkColor={section.linkColor}
                                  showDescription={section.showDescription}
                                  showDate={section.showDate}
                                  showCategory={section.showCategory}
                                  showReadTime={section.showReadTime}
                                  showCommentsCount={section.showCommentsCount}
                                />
                              ))}
                            </div>
                          )}

                          {section.layout === 'small' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {sectionArticles.map((article) => (
                                <NewsCard 
                                  key={article.id} 
                                  article={article} 
                                  variant="small" 
                                  linkColor={section.linkColor}
                                  showDescription={section.showDescription}
                                  showDate={section.showDate}
                                  showCategory={section.showCategory}
                                  showReadTime={section.showReadTime}
                                  showCommentsCount={section.showCommentsCount}
                                />
                              ))}
                            </div>
                          )}

                          {section.layout === 'video' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                              {sectionArticles.map((article) => (
                                <NewsCard 
                                  key={article.id} 
                                  article={article} 
                                  variant="video" 
                                  linkColor={section.linkColor}
                                  showDescription={section.showDescription}
                                  showDate={section.showDate}
                                  showCategory={section.showCategory}
                                  showReadTime={section.showReadTime}
                                  showCommentsCount={section.showCommentsCount}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    {/* Fallback default sections if no config exists */}
                    <div>
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="font-headline text-2xl font-black text-on-surface uppercase tracking-tight">Rozrywka</h3>
                        <a className="text-primary text-xs font-bold uppercase tracking-widest hover:underline" href="#category/Rozrywka">Zobacz więcej</a>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[...allArticles.filter(a => a.category === 'Rozrywka'), ...ENTERTAINMENT_NEWS].slice(0, 4).map((article) => (
                           <NewsCard key={article.id} article={article} showCommentsCount={true} />
                        ))}
                      </div>
                    </div>

                    <div className="bg-surface-container-low/50 p-8 rounded-3xl border border-white/5">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="font-headline text-2xl font-black text-on-surface uppercase tracking-tight">Technologia</h3>
                        <a className="text-primary text-xs font-bold uppercase tracking-widest hover:underline" href="#category/Technologia">Trendy Tech</a>
                      </div>
                      <div className="space-y-8">
                        {[...allArticles.filter(a => a.category === 'Technologia'), ...TECH_NEWS].slice(0, 4).map((article) => (
                          <NewsCard key={article.id} article={article} variant="horizontal" showCommentsCount={true} />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {route.startsWith('#article/') && (() => {
              const parts = route.split('/');
              const articleId = parts[1];
              const article = allArticles.find(a => a.id === articleId) || 
                              [BREAKING_NEWS, ...ENTERTAINMENT_NEWS, ...TECH_NEWS, ...AMAZING_NEWS].find(a => a.id === articleId);
              
              return article ? <ArticlePage article={article} config={homeConfig?.comments} onBack={() => window.location.hash = '#home'} /> : null;
            })()}

            {route.startsWith('#category/') && (() => {
              const categoryName = decodeURIComponent(route.split('/')[1]);
              const categoryArticles = allArticles.filter(a => a.category === categoryName);
              const staticArticles = [BREAKING_NEWS, ...ENTERTAINMENT_NEWS, ...TECH_NEWS, ...AMAZING_NEWS].filter(a => a.category === categoryName);
              const combined = [...categoryArticles, ...staticArticles];

              return <CategoryPage category={categoryName} articles={combined} config={homeConfig?.comments} onBack={() => window.location.hash = '#home'} />;
            })()}
          </div>

          {/* Sidebar */}
          <Sidebar />
        </section>
      </main>

      <Footer />
      <MobileNav />
      
      {/* Admin Link */}
      <a 
        href="#admin" 
        className="fixed bottom-20 right-6 z-[60] bg-primary/10 hover:bg-primary/20 p-3 rounded-full backdrop-blur-md border border-white/5 transition-all md:bottom-6"
        title="Panel Admina"
      >
        <LayoutDashboard className="w-5 h-5 text-primary" />
      </a>
    </div>
  );
}

import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
