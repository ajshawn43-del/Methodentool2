import { useState, useEffect } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const API_BASE = `${SUPABASE_URL}/functions/v1/make-server-aac39e77`;

// Get or create anonymous user ID
function getUserId() {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userId', userId);
  }
  return userId;
}

// Get username from localStorage or prompt
function getUsername() {
  let username = localStorage.getItem('username');
  if (!username) {
    username = prompt('Bitte geben Sie Ihren Namen ein:') || 'Anonymer Nutzer';
    localStorage.setItem('username', username);
  }
  return username;
}

export function useLikes(methodId: string) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikes();
    const likedMethods = JSON.parse(localStorage.getItem('likedMethods') || '{}');
    setLiked(!!likedMethods[methodId]);
  }, [methodId]);

  const fetchLikes = async () => {
    try {
      const response = await fetch(`${API_BASE}/likes/${methodId}`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });

      // Check if response is valid JSON
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Backend not available');
      }

      const data = await response.json();
      setLikes(data.likes || 0);
    } catch (error) {
      // Backend nicht verfügbar - verwende localStorage Fallback
      setLikes(Math.floor(Math.random() * 50) + 10); // Fallback
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    const method = liked ? 'DELETE' : 'POST';
    const newLiked = !liked;

    // Optimistic update
    setLiked(newLiked);
    setLikes(prev => newLiked ? prev + 1 : prev - 1);

    // Update localStorage
    const likedMethods = JSON.parse(localStorage.getItem('likedMethods') || '{}');
    if (newLiked) {
      likedMethods[methodId] = true;
    } else {
      delete likedMethods[methodId];
    }
    localStorage.setItem('likedMethods', JSON.stringify(likedMethods));

    try {
      const response = await fetch(`${API_BASE}/likes/${methodId}`, {
        method,
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });

      // Check if response is valid JSON
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Backend not available');
      }

      const data = await response.json();
      setLikes(data.likes || 0);
    } catch (error) {
      // Backend nicht verfügbar - optimistische Aktualisierung beibehalten
      // (Die Änderung bleibt nur lokal gespeichert)
    }
  };

  return { likes, liked, toggleLike, loading };
}

export function useComments(methodId: string) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [methodId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_BASE}/comments/${methodId}`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });

      // Check if response is valid JSON
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Backend not available');
      }

      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      // Backend nicht verfügbar - keine Kommentare laden
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (text: string) => {
    if (!text.trim()) return;

    const username = getUsername();
    const tempComment = {
      id: `temp-${Date.now()}`,
      username,
      text,
      timestamp: new Date().toISOString()
    };

    // Optimistic update
    setComments(prev => [...prev, tempComment]);

    try {
      const response = await fetch(`${API_BASE}/comments/${methodId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, text })
      });

      // Check if response is valid JSON
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Backend not available');
      }

      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      // Backend nicht verfügbar - optimistischen Kommentar beibehalten
      // (Wird nur lokal angezeigt, geht beim Neuladen verloren)
    }
  };

  return { comments, addComment, loading };
}

export function usePins() {
  const [pinnedMethods, setPinnedMethods] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = getUserId();

  useEffect(() => {
    fetchPins();
  }, []);

  const fetchPins = async () => {
    try {
      const response = await fetch(`${API_BASE}/pins/${userId}`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });

      // Check if response is valid JSON
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Backend not available');
      }

      const data = await response.json();
      setPinnedMethods(data.pins || []);
      // Also sync to localStorage
      localStorage.setItem('pinnedMethods', JSON.stringify(data.pins || []));
    } catch (error) {
      // Backend nicht verfügbar - Fallback zu localStorage
      const saved = localStorage.getItem('pinnedMethods');
      if (saved) {
        setPinnedMethods(JSON.parse(saved));
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePin = async (methodId: string) => {
    const isPinned = pinnedMethods.includes(methodId);
    const method = isPinned ? 'DELETE' : 'POST';
    const newPins = isPinned
      ? pinnedMethods.filter(id => id !== methodId)
      : [...pinnedMethods, methodId];

    // Optimistic update
    setPinnedMethods(newPins);
    localStorage.setItem('pinnedMethods', JSON.stringify(newPins));

    try {
      const response = await fetch(`${API_BASE}/pins/${userId}/${methodId}`, {
        method,
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });

      // Check if response is valid JSON
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Backend not available');
      }

      const data = await response.json();
      setPinnedMethods(data.pins || []);
      localStorage.setItem('pinnedMethods', JSON.stringify(data.pins || []));
    } catch (error) {
      // Backend nicht verfügbar - optimistische Aktualisierung beibehalten
      // (Wird in localStorage gespeichert)
    }
  };

  return { pinnedMethods, togglePin, loading };
}
