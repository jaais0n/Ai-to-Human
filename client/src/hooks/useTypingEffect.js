import { useState, useEffect } from 'react';

export function useTypingEffect(text, speed = 8, enabled = true) {
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayed(text || '');
      setIsTyping(false);
      return;
    }

    setDisplayed('');
    setIsTyping(true);

    let i = 0;
    // Chunk size for performance: reveal multiple chars at once
    const chunkSize = Math.max(1, Math.floor(text.length / 200));

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + chunkSize));
        i += chunkSize;
      } else {
        setDisplayed(text);
        setIsTyping(false);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  return { displayed, isTyping };
}
