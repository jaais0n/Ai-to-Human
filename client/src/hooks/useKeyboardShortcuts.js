import { useEffect } from 'react';

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      for (const { key, ctrl, alt, shift, action } of shortcuts) {
        const ctrlMatch = ctrl ? (e.ctrlKey || e.metaKey) : true;
        const altMatch = alt ? e.altKey : !e.altKey;
        const shiftMatch = shift ? e.shiftKey : !e.shiftKey;
        const keyMatch = e.key.toLowerCase() === key.toLowerCase();

        if (ctrlMatch && altMatch && shiftMatch && keyMatch) {
          e.preventDefault();
          action(e);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
