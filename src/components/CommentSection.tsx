import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Comment, CommentsConfig } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Send, Trash2, User, Reply, X, MessageSquare } from 'lucide-react';
import { formatDate } from '../lib/dateUtils';

interface CommentSectionProps {
  articleId: string;
  config?: CommentsConfig;
}

export default function CommentSection({ articleId, config }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Default config values
  const showCount = config?.showCount !== false;
  const showDate = config?.showDate !== false;
  const showAvatars = config?.showAvatars !== false;
  const allowReplies = config?.allowReplies !== false;

  useEffect(() => {
    const q = query(
      collection(db, 'articles', articleId, 'comments'),
      orderBy('timestamp', 'asc') // Changed to asc for natural thread flow
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      } as Comment));
      setComments(docs);
    });

    return () => unsubscribe();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const commentData: any = {
        articleId,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Anonim',
        userPhoto: user.photoURL || '',
        content: newComment.trim(),
        timestamp: serverTimestamp()
      };

      if (replyingTo) {
        // If it's a reply to a reply, still keep the original parent for flat-ish nesting
        // but store who we are directy replying to
        commentData.parentId = replyingTo.parentId || replyingTo.id;
        commentData.replyToName = replyingTo.userName;
      }

      await addDoc(collection(db, 'articles', articleId, 'comments'), commentData);
      setNewComment('');
      setReplyingTo(null);
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten komentarz?')) return;
    try {
      await deleteDoc(doc(db, 'articles', articleId, 'comments', commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const topLevelComments = comments.filter(c => !c.parentId).reverse(); // Reverse for newest on top among threads
  const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId);

  return (
    <section className="mt-16 pt-12 border-t border-white/5">
      {showCount && (
        <h3 className="text-2xl font-black mb-8 uppercase tracking-tight text-primary">Komentarze ({comments.length})</h3>
      )}
      
      {user ? (
        <div className={`bg-surface-container-low p-6 rounded-2xl border ${replyingTo ? 'border-primary/50 ring-1 ring-primary/20' : 'border-white/5'} mb-10 transition-all`}>
          {replyingTo && (
            <div className="flex items-center justify-between mb-4 bg-primary/10 px-4 py-2 rounded-lg">
              <span className="text-xs font-bold text-primary flex items-center gap-2">
                <Reply className="w-3 h-3" /> Odpowiadasz użytkownikowi: {replyingTo.userName}
              </span>
              <button 
                onClick={() => setReplyingTo(null)}
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className={`w-10 h-10 rounded-full bg-primary/20 flex-shrink-0 overflow-hidden flex items-center justify-center border border-primary/20 ${!showAvatars ? 'hidden' : ''}`}>
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-5 h-5 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={replyingTo ? "Napisz odpowiedź..." : "Napisz co o tym sądzisz..."}
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant resize-none h-24 text-lg"
                disabled={isSubmitting}
                autoFocus={!!replyingTo}
              />
              <div className="flex justify-end mt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 disabled:opacity-50 hover:scale-105 transition-all shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? 'Wysyłanie...' : (replyingTo ? 'Odpowiedz' : 'Wyślij')} <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-surface-container-low p-10 rounded-3xl border border-white/5 text-center mb-10 shadow-xl">
          <p className="text-on-surface-variant mb-6 text-lg">Zaloguj się, aby brać udział w dyskusji.</p>
          <button 
            onClick={() => window.location.hash = '#home'}
            className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-lg shadow-primary/20"
          >
            Zaloguj się przez Google
          </button>
        </div>
      )}

      <div className="space-y-10">
        {topLevelComments.map((comment) => (
          <div key={comment.id} className="space-y-6">
            {/* Parent Comment */}
            <div className="flex gap-4 group">
              {showAvatars && (
                <div className="w-11 h-11 rounded-full bg-surface-container flex-shrink-0 overflow-hidden flex items-center justify-center border border-white/5">
                  {comment.userPhoto ? (
                    <img src={comment.userPhoto} alt={comment.userName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-5 h-5 text-on-surface-variant" />
                  )}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-base text-on-surface">{comment.userName}</span>
                    {showDate && (
                      <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
                        {comment.timestamp?.toDate ? formatDate(comment.timestamp.toDate().toISOString()) : 'Przed chwilą'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {user && allowReplies && (
                      <button 
                        onClick={() => {
                          setReplyingTo(comment);
                          window.scrollTo({ top: document.querySelector('form')?.offsetTop ? document.querySelector('form')!.offsetTop - 200 : 0, behavior: 'smooth' });
                        }}
                        className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container"
                        title="Odpowiedz"
                      >
                        <Reply className="w-4 h-4" />
                      </button>
                    )}
                    {(user?.uid === comment.userId) && (
                      <button 
                        onClick={() => handleDelete(comment.id)}
                        className="text-on-surface-variant hover:text-error transition-colors p-2 rounded-full hover:bg-surface-container"
                        title="Usuń"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-on-surface/90 text-[15px] leading-relaxed break-words bg-surface-container-low p-4 rounded-2xl rounded-tl-none border border-white/5 shadow-sm">
                  {comment.content}
                </p>
              </div>
            </div>

            {/* Replies */}
            {allowReplies && getReplies(comment.id).map((reply) => (
              <div key={reply.id} className="flex gap-4 ml-12 group">
                {showAvatars && (
                  <div className="w-9 h-9 rounded-full bg-surface-container flex-shrink-0 overflow-hidden flex items-center justify-center border border-white/5">
                    {reply.userPhoto ? (
                      <img src={reply.userPhoto} alt={reply.userName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User className="w-4 h-4 text-on-surface-variant" />
                    )}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-on-surface">{reply.userName}</span>
                      {showDate && (
                        <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
                          {reply.timestamp?.toDate ? formatDate(reply.timestamp.toDate().toISOString()) : 'Przed chwilą'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {user && allowReplies && (
                        <button 
                          onClick={() => {
                            setReplyingTo(reply);
                            window.scrollTo({ top: document.querySelector('form')?.offsetTop ? document.querySelector('form')!.offsetTop - 200 : 0, behavior: 'smooth' });
                          }}
                          className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container"
                          title="Odpowiedz"
                        >
                          <Reply className="w-4 h-4" />
                        </button>
                      )}
                      {(user?.uid === reply.userId) && (
                        <button 
                          onClick={() => handleDelete(reply.id)}
                          className="text-on-surface-variant hover:text-error transition-colors p-2 rounded-full hover:bg-surface-container"
                          title="Usuń"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-2xl rounded-tl-none border border-white/5 shadow-sm relative">
                    <div className="absolute -left-3 top-4 w-3 h-[1px] bg-primary/20"></div>
                    <p className="text-on-surface/90 text-sm leading-relaxed break-words">
                      {reply.replyToName && (
                        <span className="text-primary font-bold mr-2 text-[11px] uppercase tracking-wider">@{reply.replyToName}</span>
                      )}
                      {reply.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        {comments.length === 0 && (
          <div className="text-center py-16 px-4 bg-surface-container-low/30 rounded-3xl border border-dashed border-white/10">
            <MessageCircle className="w-12 h-12 text-white/5 mx-auto mb-4" />
            <p className="text-on-surface-variant italic">Brak komentarzy. Bądź pierwszą osobą, która podzieli się opinią!</p>
          </div>
        )}
      </div>
    </section>
  );
}

import { MessageCircle } from 'lucide-react';
