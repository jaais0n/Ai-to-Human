import { useCallback } from 'react';
import useAppStore from '../store/useAppStore';
import { humanizeText } from '../services/humanize.service';
import { calculateHumanScore } from '../utils/humanScore';
import { calculateReadability, detectTone } from '../utils/readability';

export function useHumanize() {
  const {
    inputText,
    mode,
    strength,
    creativity,
    complexity,
    tone,
    setOutputText,
    setIsLoading,
    setError,
    setHumanScore,
    setReadabilityScore,
    setToneLabel,
    addToHistory,
    addToast,
  } = useAppStore();

  const humanize = useCallback(async () => {
    if (!inputText.trim()) {
      addToast({ type: 'warning', message: 'Please enter some text to humanize.' });
      return;
    }

    if (inputText.trim().length < 30) {
      addToast({ type: 'warning', message: 'Text is too short. Add at least 30 characters.' });
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutputText('');
    setHumanScore(null);
    setReadabilityScore(null);
    setToneLabel(null);

    try {
      const data = await humanizeText({
        text: inputText,
        mode,
        strength,
        creativity,
        complexity,
        tone,
      });

      if (data.success && data.result) {
        setOutputText(data.result);

        // Calculate scores
        const hScore = calculateHumanScore(data.result);
        const rScore = calculateReadability(data.result);
        const tLabel = detectTone(data.result);

        setHumanScore(hScore);
        setReadabilityScore(rScore);
        setToneLabel(tLabel);

        // Add to history
        addToHistory({
          inputText: inputText.slice(0, 200),
          outputText: data.result.slice(0, 200),
          mode,
          humanScore: hScore,
          wordCount: data.result.trim().split(/\s+/).length,
        });

        addToast({ type: 'success', message: '✨ Content humanized successfully!' });
      }
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message ||
        'Failed to humanize. Please try again.';
      setError(message);
      addToast({ type: 'error', message });
    } finally {
      setIsLoading(false);
    }
  }, [
    inputText, mode, strength, creativity, complexity, tone,
    setOutputText, setIsLoading, setError, setHumanScore,
    setReadabilityScore, setToneLabel, addToHistory, addToast,
  ]);

  return { humanize };
}
