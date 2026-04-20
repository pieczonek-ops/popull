import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';

export function useCommentsCount(articleId: string) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!articleId) return;

    const q = query(collection(db, 'articles', articleId, 'comments'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCount(snapshot.size);
    }, (error) => {
      console.error("Error fetching comments count:", error);
    });

    return () => unsubscribe();
  }, [articleId]);

  return count;
}
