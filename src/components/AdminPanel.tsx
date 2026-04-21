import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot, query, orderBy, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { NewsArticle, HomeConfig, HomeSection, CommentsConfig, ArticleSubSection } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../lib/dateUtils';
import { Plus, Edit2, Trash2, X, Save, LayoutDashboard, LogOut, Settings, Home, Layers, MoveUp, MoveDown, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminPanel() {
  const { user, isAdmin, login, logout, loading } = useAuth();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<NewsArticle> | null>(null);
  const [activeTab, setActiveTab] = useState<'articles' | 'home'>('articles');
  const [homeConfig, setHomeConfig] = useState<HomeConfig | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, 'articles'), orderBy('timestamp', 'desc'));
    const unsubscribeArticles = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as NewsArticle));
      setArticles(docs);
    });

    const unsubscribeConfig = onSnapshot(doc(db, 'config', 'home'), (snapshot) => {
      if (snapshot.exists()) {
        setHomeConfig(snapshot.data() as HomeConfig);
      } else {
        // Default config
        setHomeConfig({
          hero: { buttonType: 'gradient', showCard: true, showCommentsCount: false },
          sections: [],
          comments: { showCount: true, showDate: true, showAvatars: true, allowReplies: true }
        });
      }
    });

    return () => {
      unsubscribeArticles();
      unsubscribeConfig();
    };
  }, [isAdmin]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Ładowanie...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-black mb-8 uppercase italic text-primary">Admin Pulse</h1>
        <button 
          onClick={login}
          className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform"
        >
          Zaloguj się przez Google
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Brak uprawnień</h1>
        <p className="text-on-surface-variant mb-8">Tylko administratorzy mają dostęp do tego panelu.</p>
        <button onClick={logout} className="text-primary font-bold">Wyloguj się</button>
      </div>
    );
  }

  const handleSaveArticle = async () => {
    if (!currentArticle?.title || !currentArticle?.content) return;

    const articleData = {
      ...currentArticle,
      timestamp: currentArticle.timestamp || new Date().toISOString(),
      readTime: currentArticle.readTime || '5 min',
      authorId: user.uid,
    };

    try {
      if (currentArticle.id) {
        const { id, ...data } = articleData as NewsArticle;
        await updateDoc(doc(db, 'articles', id), data);
      } else {
        await addDoc(collection(db, 'articles'), articleData);
      }
      setIsEditing(false);
      setCurrentArticle(null);
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten artykuł?')) {
      await deleteDoc(doc(db, 'articles', id));
    }
  };

  const addSubSection = () => {
    if (!currentArticle) return;
    const newSub: ArticleSubSection = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      imageUrl: '',
      content: ''
    };
    setCurrentArticle(prev => ({
      ...prev,
      subSections: [...(prev?.subSections || []), newSub]
    }));
  };

  const removeSubSection = (id: string) => {
    if (!currentArticle) return;
    setCurrentArticle(prev => ({
      ...prev,
      subSections: prev?.subSections?.filter(s => s.id !== id)
    }));
  };

  const updateSubSection = (id: string, field: keyof ArticleSubSection, value: string) => {
    if (!currentArticle) return;
    setCurrentArticle(prev => ({
      ...prev,
      subSections: prev?.subSections?.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const moveSubSection = (index: number, direction: 'up' | 'down') => {
    if (!currentArticle || !currentArticle.subSections) return;
    const newSubs = [...currentArticle.subSections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSubs.length) return;
    [newSubs[index], newSubs[targetIndex]] = [newSubs[targetIndex], newSubs[index]];
    setCurrentArticle({ ...currentArticle, subSections: newSubs });
  };

  const handleSaveHomeConfig = async () => {
    if (!homeConfig) return;
    try {
      await setDoc(doc(db, 'config', 'home'), homeConfig);
      alert('Konfiguracja zapisana pomyślnie!');
    } catch (error) {
      console.error('Error saving home config:', error);
    }
  };

  const addSection = () => {
    if (!homeConfig) return;
    const newSection: HomeSection = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Nowa Sekcja',
      category: 'Technologia',
      count: 4,
      layout: 'grid'
    };
    setHomeConfig({
      ...homeConfig,
      sections: [...homeConfig.sections, newSection]
    });
  };

  const removeSection = (id: string) => {
    if (!homeConfig) return;
    setHomeConfig({
      ...homeConfig,
      sections: homeConfig.sections.filter(s => s.id !== id)
    });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (!homeConfig) return;
    const newSections = [...homeConfig.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setHomeConfig({ ...homeConfig, sections: newSections });
  };

  return (
    <div className="min-h-screen bg-surface p-4 lg:p-8">
      <header className="flex justify-between items-center mb-12 max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <LayoutDashboard className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-black uppercase tracking-tight">Panel Administratora</h1>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex bg-surface-container rounded-full p-1 mr-4">
            <button 
              onClick={() => setActiveTab('articles')}
              className={`px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'articles' ? 'bg-primary text-on-primary shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <Layers className="w-4 h-4" /> Artykuły
            </button>
            <button 
              onClick={() => setActiveTab('home')}
              className={`px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'home' ? 'bg-primary text-on-primary shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <Home className="w-4 h-4" /> Strona Główna
            </button>
          </nav>
          <span className="text-sm text-on-surface-variant hidden md:block">{user.email}</span>
          <button onClick={logout} className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto">
        {activeTab === 'articles' ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Wszystkie artykuły ({articles.length})</h2>
              <button 
                onClick={() => {
                  setCurrentArticle({ category: 'Technologia', isBreaking: false, content: '' });
                  setIsEditing(true);
                }}
                className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Plus className="w-5 h-5" /> Nowy artykuł
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {articles.map((article) => (
                <div key={article.id} className="bg-surface-container-low p-4 rounded-2xl flex items-center justify-between border border-white/5">
                  <div className="flex items-center gap-4">
                    <img src={article.imageUrl} className="w-16 h-16 rounded-lg object-cover" alt="" referrerPolicy="no-referrer" />
                    <div>
                      <h3 className="font-bold line-clamp-1">{article.title}</h3>
                      <div className="flex gap-2 items-center">
                        <span className="text-xs text-on-surface-variant uppercase font-bold tracking-widest">{article.category}</span>
                        <span className="text-[10px] text-on-surface-variant/60">{formatDate(article.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setCurrentArticle(article);
                        setIsEditing(true);
                      }}
                      className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteArticle(article.id)}
                      className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-12">
            {/* Hero Configuration */}
            <section className="bg-surface-container-low p-8 rounded-3xl border border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <Settings className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold uppercase tracking-tight">Konfiguracja Sekcji Hero</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Artykuł w Hero</label>
                  <select 
                    className="w-full bg-surface-container border border-white/10 rounded-xl py-3 px-4 outline-none"
                    value={homeConfig?.hero.articleId || ''}
                    onChange={e => setHomeConfig(prev => prev ? {...prev, hero: {...prev.hero, articleId: e.target.value}} : null)}
                  >
                    <option value="">Najnowszy (Automatycznie)</option>
                    {articles.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Kolor Tła</label>
                  <div className="flex gap-2">
                    <input 
                      type="color"
                      className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-none"
                      value={homeConfig?.hero.backgroundColor || '#1d1e21'}
                      onChange={e => setHomeConfig(prev => prev ? {...prev, hero: {...prev.hero, backgroundColor: e.target.value}} : null)}
                    />
                    <input 
                      type="text"
                      className="flex-1 bg-surface-container border border-white/10 rounded-xl px-4 text-sm"
                      value={homeConfig?.hero.backgroundColor || ''}
                      onChange={e => setHomeConfig(prev => prev ? {...prev, hero: {...prev.hero, backgroundColor: e.target.value}} : null)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Kolor Tekstu</label>
                  <input 
                    type="color"
                    className="w-full h-12 rounded-lg cursor-pointer bg-transparent border-none"
                    value={homeConfig?.hero.textColor || '#ffffff'}
                    onChange={e => setHomeConfig(prev => prev ? {...prev, hero: {...prev.hero, textColor: e.target.value}} : null)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Rodzaj Przycisku</label>
                  <select 
                    className="w-full bg-surface-container border border-white/10 rounded-xl py-3 px-4 outline-none"
                    value={homeConfig?.hero.buttonType || 'gradient'}
                    onChange={e => setHomeConfig(prev => prev ? {...prev, hero: {...prev.hero, buttonType: e.target.value as any}} : null)}
                  >
                    <option value="solid">Pełny (Solid)</option>
                    <option value="outline">Obramowanie (Outline)</option>
                    <option value="gradient">Gradient</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Kolor Przycisku</label>
                  <input 
                    type="color"
                    className="w-full h-12 rounded-lg cursor-pointer bg-transparent border-none"
                    value={homeConfig?.hero.buttonColor || '#0061a4'}
                    onChange={e => setHomeConfig(prev => prev ? {...prev, hero: {...prev.hero, buttonColor: e.target.value}} : null)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Ikona Przycisku</label>
                  <select 
                    className="w-full bg-surface-container border border-white/10 rounded-xl py-3 px-4 outline-none"
                    value={homeConfig?.hero.buttonIcon || 'ArrowRight'}
                    onChange={e => setHomeConfig(prev => prev ? {...prev, hero: {...prev.hero, buttonIcon: e.target.value}} : null)}
                  >
                    <option value="ArrowRight">Strzałka</option>
                    <option value="Play">Play</option>
                    <option value="Star">Gwiazdka</option>
                    <option value="Zap">Błyskawica</option>
                    <option value="Info">Info</option>
                  </select>
                </div>

                <div className="space-y-4 pt-4 md:col-span-2 lg:col-span-3">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/50 border border-white/5 cursor-pointer hover:bg-surface-container transition-colors w-fit">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-white/10 bg-surface-container text-primary focus:ring-primary"
                      checked={homeConfig?.hero.showCommentsCount === true}
                      onChange={e => setHomeConfig(prev => prev ? {...prev, hero: {...prev.hero, showCommentsCount: e.target.checked}} : null)}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface">Pokaż ilość komentarzy w sekcji Hero</span>
                  </label>
                </div>
              </div>
            </section>

            {/* Global Comments Configuration */}
            <section className="bg-surface-container-low p-8 rounded-3xl border border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <MessageCircle className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold uppercase tracking-tight">Globalne Ustawienia Komentarzy</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <label className="flex items-center gap-3 p-4 rounded-xl bg-surface-container/50 border border-white/5 cursor-pointer hover:bg-surface-container transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-white/10 bg-surface-container text-primary focus:ring-primary"
                    checked={homeConfig?.comments?.showCount !== false}
                    onChange={e => setHomeConfig(prev => prev ? {...prev, comments: {...(prev.comments || {showCount: true, showDate: true, showAvatars: true, allowReplies: true}), showCount: e.target.checked}} : null)}
                  />
                  <span className="text-xs font-bold uppercase tracking-widest">Pokaż licznik w nagłówku</span>
                </label>
                
                <label className="flex items-center gap-3 p-4 rounded-xl bg-surface-container/50 border border-white/5 cursor-pointer hover:bg-surface-container transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-white/10 bg-surface-container text-primary focus:ring-primary"
                    checked={homeConfig?.comments?.showDate !== false}
                    onChange={e => setHomeConfig(prev => prev ? {...prev, comments: {...(prev.comments || {showCount: true, showDate: true, showAvatars: true, allowReplies: true}), showDate: e.target.checked}} : null)}
                  />
                  <span className="text-xs font-bold uppercase tracking-widest">Pokaż daty komentarzy</span>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-xl bg-surface-container/50 border border-white/5 cursor-pointer hover:bg-surface-container transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-white/10 bg-surface-container text-primary focus:ring-primary"
                    checked={homeConfig?.comments?.showAvatars !== false}
                    onChange={e => setHomeConfig(prev => prev ? {...prev, comments: {...(prev.comments || {showCount: true, showDate: true, showAvatars: true, allowReplies: true}), showAvatars: e.target.checked}} : null)}
                  />
                  <span className="text-xs font-bold uppercase tracking-widest">Pokaż zdjęcia autorów</span>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-xl bg-surface-container/50 border border-white/5 cursor-pointer hover:bg-surface-container transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-white/10 bg-surface-container text-primary focus:ring-primary"
                    checked={homeConfig?.comments?.allowReplies !== false}
                    onChange={e => setHomeConfig(prev => prev ? {...prev, comments: {...(prev.comments || {showCount: true, showDate: true, showAvatars: true, allowReplies: true}), allowReplies: e.target.checked}} : null)}
                  />
                  <span className="text-xs font-bold uppercase tracking-widest">Zezwalaj na odpowiedzi</span>
                </label>
              </div>
              <p className="mt-4 text-[10px] text-on-surface-variant/70 italic">
                * Te ustawienia działają globalnie wewnątrz sekcji komentarzy pod każdym artykułem.
              </p>
            </section>

            {/* Sections Configuration */}
            <section className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Layers className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold uppercase tracking-tight">Sekcje Strony Głównej</h2>
                </div>
                <button 
                  onClick={addSection}
                  className="bg-primary/20 text-primary px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-primary hover:text-on-primary transition-all"
                >
                  <Plus className="w-4 h-4" /> Dodaj Sekcję
                </button>
              </div>

              <div className="space-y-6">
                {homeConfig?.sections.map((section, index) => (
                  <div key={section.id} className="bg-surface-container-low p-8 rounded-3xl border border-white/5 space-y-8">
                    {/* Header with Title and Controls */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1">
                          <button onClick={() => moveSection(index, 'up')} className="p-1 hover:bg-surface-container rounded text-on-surface-variant hover:text-primary transition-colors"><MoveUp className="w-4 h-4" /></button>
                          <button onClick={() => moveSection(index, 'down')} className="p-1 hover:bg-surface-container rounded text-on-surface-variant hover:text-primary transition-colors"><MoveDown className="w-4 h-4" /></button>
                        </div>
                        <h4 className="font-headline font-black text-xl uppercase tracking-tight text-primary">
                          {section.title || 'Nowa Sekcja'}
                        </h4>
                      </div>
                      <button 
                        onClick={() => removeSection(section.id)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 text-red-500 rounded-full transition-colors text-xs font-bold uppercase tracking-widest"
                      >
                        <Trash2 className="w-4 h-4" /> Usuń Sekcję
                      </button>
                    </div>
                    
                    {/* Settings Groups */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* Left Column: Basic Info & Layout */}
                      <div className="space-y-6">
                        <h5 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant/50 mb-4">Ustawienia Podstawowe</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Tytuł Sekcji</label>
                            <input 
                              className="w-full bg-surface-container border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-primary/50 transition-colors"
                              value={section.title}
                              onChange={e => {
                                const newSections = [...homeConfig.sections];
                                newSections[index].title = e.target.value;
                                setHomeConfig({...homeConfig, sections: newSections});
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Kategoria</label>
                            <select 
                              className="w-full bg-surface-container border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-primary/50 transition-colors"
                              value={section.category}
                              onChange={e => {
                                const newSections = [...homeConfig.sections];
                                newSections[index].category = e.target.value;
                                setHomeConfig({...homeConfig, sections: newSections});
                              }}
                            >
                              <option>Technologia</option>
                              <option>Rozrywka</option>
                              <option>Świat</option>
                              <option>Niesamowite</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Układ Kart</label>
                            <select 
                              className="w-full bg-surface-container border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-primary/50 transition-colors"
                              value={section.layout}
                              onChange={e => {
                                const newSections = [...homeConfig.sections];
                                newSections[index].layout = e.target.value as any;
                                setHomeConfig({...homeConfig, sections: newSections});
                              }}
                            >
                              <option value="grid">Siatka (Grid)</option>
                              <option value="horizontal">Poziomo (Horizontal)</option>
                              <option value="small">Małe Karty (Small)</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Ilość Artykułów</label>
                            <input 
                              type="number"
                              className="w-full bg-surface-container border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-primary/50 transition-colors"
                              value={section.count}
                              onChange={e => {
                                const newSections = [...homeConfig.sections];
                                newSections[index].count = parseInt(e.target.value);
                                setHomeConfig({...homeConfig, sections: newSections});
                              }}
                            />
                          </div>
                        </div>

                        <div className="pt-4">
                          <h5 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant/50 mb-4">Opcje Wyświetlania</h5>
                          <div className="grid grid-cols-2 gap-4">
                            <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/50 border border-white/5 cursor-pointer hover:bg-surface-container transition-colors">
                              <input 
                                type="checkbox" 
                                className="w-5 h-5 rounded border-white/10 bg-surface-container text-primary focus:ring-primary"
                                checked={section.showDescription !== false}
                                onChange={e => {
                                  const newSections = [...homeConfig.sections];
                                  newSections[index].showDescription = e.target.checked;
                                  setHomeConfig({...homeConfig, sections: newSections});
                                }}
                              />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Opis</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/50 border border-white/5 cursor-pointer hover:bg-surface-container transition-colors">
                              <input 
                                type="checkbox" 
                                className="w-5 h-5 rounded border-white/10 bg-surface-container text-primary focus:ring-primary"
                                checked={section.showDate !== false}
                                onChange={e => {
                                  const newSections = [...homeConfig.sections];
                                  newSections[index].showDate = e.target.checked;
                                  setHomeConfig({...homeConfig, sections: newSections});
                                }}
                              />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Data</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/50 border border-white/5 cursor-pointer hover:bg-surface-container transition-colors">
                              <input 
                                type="checkbox" 
                                className="w-5 h-5 rounded border-white/10 bg-surface-container text-primary focus:ring-primary"
                                checked={section.showCategory !== false}
                                onChange={e => {
                                  const newSections = [...homeConfig.sections];
                                  newSections[index].showCategory = e.target.checked;
                                  setHomeConfig({...homeConfig, sections: newSections});
                                }}
                              />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Kategoria</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/50 border border-white/5 cursor-pointer hover:bg-surface-container transition-colors">
                              <input 
                                type="checkbox" 
                                className="w-5 h-5 rounded border-white/10 bg-surface-container text-primary focus:ring-primary"
                                checked={section.showReadTime !== false}
                                onChange={e => {
                                  const newSections = [...homeConfig.sections];
                                  newSections[index].showReadTime = e.target.checked;
                                  setHomeConfig({...homeConfig, sections: newSections});
                                }}
                              />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Czas czytania</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/50 border border-white/5 cursor-pointer hover:bg-surface-container transition-colors">
                              <input 
                                type="checkbox" 
                                className="w-5 h-5 rounded border-white/10 bg-surface-container text-primary focus:ring-primary"
                                checked={section.showCommentsCount !== false}
                                onChange={e => {
                                  const newSections = [...homeConfig.sections];
                                  newSections[index].showCommentsCount = e.target.checked;
                                  setHomeConfig({...homeConfig, sections: newSections});
                                }}
                              />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Ilość komentarzy</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Styling & Colors */}
                      <div className="space-y-6">
                        <h5 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant/50 mb-4">Stylizacja i Kolory</h5>
                        <div className="space-y-6">
                          <div className="flex items-center gap-6 p-4 rounded-2xl bg-surface-container/30 border border-white/5">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block">Kolor Tła</label>
                              <input 
                                type="color"
                                className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-none"
                                value={section.backgroundColor || '#1d1e21'}
                                onChange={e => {
                                  const newSections = [...homeConfig.sections];
                                  newSections[index].backgroundColor = e.target.value;
                                  setHomeConfig({...homeConfig, sections: newSections});
                                }}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block">Kolor Tytułu</label>
                              <input 
                                type="color"
                                className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-none"
                                value={section.titleColor || '#ffffff'}
                                onChange={e => {
                                  const newSections = [...homeConfig.sections];
                                  newSections[index].titleColor = e.target.value;
                                  setHomeConfig({...homeConfig, sections: newSections});
                                }}
                              />
                            </div>
                            <div className="space-y-2 flex-1">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block">URL Obrazu Tła</label>
                              <input 
                                className="w-full bg-surface-container border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-primary/50 transition-colors"
                                placeholder="https://images.unsplash.com/..."
                                value={section.backgroundImageUrl || ''}
                                onChange={e => {
                                  const newSections = [...homeConfig.sections];
                                  newSections[index].backgroundImageUrl = e.target.value;
                                  setHomeConfig({...homeConfig, sections: newSections});
                                }}
                              />
                            </div>
                          </div>

                          <div className="pt-4">
                            <h5 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant/50 mb-4">Link "Zobacz Więcej"</h5>
                            <div className="space-y-4">
                              <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/50 border border-white/5 cursor-pointer hover:bg-surface-container transition-colors">
                                <input 
                                  type="checkbox" 
                                  className="w-5 h-5 rounded border-white/10 bg-surface-container text-primary focus:ring-primary"
                                  checked={section.showSeeMore !== false}
                                  onChange={e => {
                                    const newSections = [...homeConfig.sections];
                                    newSections[index].showSeeMore = e.target.checked;
                                    setHomeConfig({...homeConfig, sections: newSections});
                                  }}
                                />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Pokaż Link</span>
                              </label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Tekst Linku</label>
                                  <input 
                                    className="w-full bg-surface-container border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-primary/50 transition-colors"
                                    placeholder="Zobacz więcej"
                                    value={section.seeMoreText || ''}
                                    onChange={e => {
                                      const newSections = [...homeConfig.sections];
                                      newSections[index].seeMoreText = e.target.value;
                                      setHomeConfig({...homeConfig, sections: newSections});
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block">Kolor Linku</label>
                                  <input 
                                    type="color"
                                    className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-none"
                                    value={section.seeMoreColor || '#0061a4'}
                                    onChange={e => {
                                      const newSections = [...homeConfig.sections];
                                      newSections[index].seeMoreColor = e.target.value;
                                      setHomeConfig({...homeConfig, sections: newSections});
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 p-4 rounded-2xl bg-surface-container/30 border border-white/5">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block">Kolor Linków</label>
                              <input 
                                type="color"
                                className="w-12 h-12 rounded-lg cursor-pointer bg-transparent border-none"
                                value={section.linkColor || '#0061a4'}
                                onChange={e => {
                                  const newSections = [...homeConfig.sections];
                                  newSections[index].linkColor = e.target.value;
                                  setHomeConfig({...homeConfig, sections: newSections});
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] text-on-surface-variant/70 leading-relaxed">
                                Ten kolor zostanie zastosowany do tytułów artykułów w tej sekcji, nadpisując domyślny kolor motywu.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex justify-end pt-8 border-t border-white/5">
              <button 
                onClick={handleSaveHomeConfig}
                className="bg-primary text-on-primary px-12 py-4 rounded-full font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2"
              >
                <Save className="w-5 h-5" /> Zapisz Wszystkie Zmiany Strony Głównej
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-surface/95 backdrop-blur-sm p-4 lg:p-8 overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto bg-surface-container p-6 lg:p-10 rounded-3xl border border-white/10 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase">{currentArticle?.id ? 'Edytuj' : 'Nowy'} Artykuł</h2>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-surface-container-highest rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Tytuł</label>
                    <input 
                      className="w-full bg-surface-container-low border border-white/10 rounded-xl py-3 px-4 outline-none focus:ring-1 focus:ring-primary"
                      value={currentArticle?.title || ''}
                      onChange={e => setCurrentArticle({...currentArticle, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Kategoria</label>
                    <select 
                      className="w-full bg-surface-container-low border border-white/10 rounded-xl py-3 px-4 outline-none focus:ring-1 focus:ring-primary"
                      value={currentArticle?.category || ''}
                      onChange={e => setCurrentArticle({...currentArticle, category: e.target.value})}
                    >
                      <option>Technologia</option>
                      <option>Rozrywka</option>
                      <option>Świat</option>
                      <option>Niesamowite</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">URL Obrazu</label>
                  <input 
                    className="w-full bg-surface-container-low border border-white/10 rounded-xl py-3 px-4 outline-none focus:ring-1 focus:ring-primary"
                    value={currentArticle?.imageUrl || ''}
                    onChange={e => setCurrentArticle({...currentArticle, imageUrl: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Krótki opis</label>
                  <textarea 
                    className="w-full bg-surface-container-low border border-white/10 rounded-xl py-3 px-4 outline-none focus:ring-1 focus:ring-primary h-24"
                    value={currentArticle?.description || ''}
                    onChange={e => setCurrentArticle({...currentArticle, description: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Treść (Edytor Wizualny)</label>
                  <ReactQuill 
                    theme="snow" 
                    value={currentArticle?.content || ''} 
                    onChange={content => setCurrentArticle({...currentArticle, content})}
                  />
                </div>

                <div className="flex items-center gap-8 pt-4 pb-4 border-y border-white/5">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-white/10 bg-surface-container-low text-primary focus:ring-primary"
                        checked={currentArticle?.isBreaking || false}
                        onChange={e => setCurrentArticle({...currentArticle, isBreaking: e.target.checked})}
                      />
                      <span className="text-sm font-bold uppercase tracking-widest">Breaking News</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-4 border-l border-white/10 pl-8">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Tryb wyświetlania</label>
                    <select 
                      className="bg-surface-container-low border border-white/10 rounded-full py-1 px-4 text-xs font-bold uppercase tracking-widest outline-none focus:ring-1 focus:ring-primary"
                      value={currentArticle?.displayMode || 'single'}
                      onChange={e => setCurrentArticle({...currentArticle, displayMode: e.target.value as any})}
                    >
                      <option value="single">Jedna Strona</option>
                      <option value="multi">Stronicowanie (Galeia/Multi)</option>
                    </select>
                  </div>
                </div>

                {/* Sub-sections Management */}
                <div className="space-y-6 pt-4">
                  <div className="flex justify-between items-center bg-surface-container-low/50 p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 text-primary">
                      <Layers className="w-5 h-5" />
                      <h3 className="font-bold uppercase tracking-tight text-sm">Sekcje artykułu / Galeria</h3>
                    </div>
                    <button 
                      onClick={addSubSection}
                      className="bg-primary/20 text-primary px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-primary hover:text-on-primary transition-all"
                    >
                      <Plus className="w-4 h-4" /> Dodaj sekcję
                    </button>
                  </div>

                  <div className="space-y-8 pl-4 border-l-2 border-white/5">
                    {currentArticle?.subSections?.map((sub, index) => (
                      <div key={sub.id} className="relative bg-surface-container-low/30 p-6 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Sekcja #{index + 1}</span>
                          <div className="flex gap-1">
                            <button onClick={() => moveSubSection(index, 'up')} className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors"><MoveUp className="w-4 h-4" /></button>
                            <button onClick={() => moveSubSection(index, 'down')} className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors"><MoveDown className="w-4 h-4" /></button>
                            <button 
                              onClick={() => removeSubSection(sub.id)}
                              className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors ml-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Tytuł Sekcji</label>
                            <input 
                              placeholder="Np. Opis zdjęcia lub podtytuł"
                              className="w-full bg-surface-container-low border border-white/10 rounded-xl py-2 px-4 text-sm outline-none focus:ring-1 focus:ring-primary"
                              value={sub.title}
                              onChange={e => updateSubSection(sub.id, 'title', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">URL Obrazu Sekcji</label>
                            <input 
                              placeholder="https://..."
                              className="w-full bg-surface-container-low border border-white/10 rounded-xl py-2 px-4 text-sm outline-none focus:ring-1 focus:ring-primary"
                              value={sub.imageUrl}
                              onChange={e => updateSubSection(sub.id, 'imageUrl', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Treść Sekcji (Edytor Wizualny)</label>
                          <ReactQuill 
                            theme="snow" 
                            className="bg-surface-container-low"
                            value={sub.content} 
                            onChange={v => updateSubSection(sub.id, 'content', v)}
                          />
                        </div>
                      </div>
                    ))}
                    {(!currentArticle?.subSections || currentArticle.subSections.length === 0) && (
                      <p className="text-xs text-on-surface-variant italic pl-2">Brak dodatkowych sekcji. Artykuł będzie wyświetlany standardowo.</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-8">
                  <button 
                    onClick={handleSaveArticle}
                    className="flex-1 bg-primary text-on-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                  >
                    <Save className="w-5 h-5" /> Zapisz Artykuł
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-surface-container-highest text-on-surface py-4 rounded-xl font-bold hover:bg-white/10 transition-colors"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
