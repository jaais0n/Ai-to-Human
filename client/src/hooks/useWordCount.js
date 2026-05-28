import { useMemo } from 'react';

export function useWordCount(text) {
  return useMemo(() => {
    if (!text || !text.trim()) {
      return { words: 0, chars: 0, sentences: 0, readTime: 0 };
    }
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length;
    const readTime = Math.max(1, Math.ceil(words / 200)); // avg 200 wpm
    return { words, chars, sentences, readTime };
  }, [text]);
}
