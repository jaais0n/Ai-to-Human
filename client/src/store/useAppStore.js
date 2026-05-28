import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set, get) => ({
      // Editor state
      inputText: '',
      outputText: '',
      isLoading: false,
      error: null,

      // Mode & controls
      mode: 'standard',
      strength: 70,
      creativity: 50,
      complexity: 50,
      tone: '',

      // Scores
      humanScore: null,
      readabilityScore: null,
      toneLabel: null,

      // UI state
      theme: 'dark',
      showDiff: false,
      activeTab: 'editor',
      showHistory: false,

      // History
      history: [],

      // Settings
      exportFormat: 'txt',
      defaultMode: 'standard',

      // Toast
      toasts: [],

      // Actions
      setInputText: (text) => set({ inputText: text }),
      setOutputText: (text) => set({ outputText: text }),
      setMode: (mode) => set({ mode }),
      setStrength: (strength) => set({ strength }),
      setCreativity: (creativity) => set({ creativity }),
      setComplexity: (complexity) => set({ complexity }),
      setTone: (tone) => set({ tone }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setHumanScore: (humanScore) => set({ humanScore }),
      setReadabilityScore: (readabilityScore) => set({ readabilityScore }),
      setToneLabel: (toneLabel) => set({ toneLabel }),
      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        }
      },
      setShowDiff: (showDiff) => set({ showDiff }),
      setActiveTab: (activeTab) => set({ activeTab }),
      setShowHistory: (showHistory) => set({ showHistory }),
      setExportFormat: (exportFormat) => set({ exportFormat }),
      setDefaultMode: (defaultMode) => set({ defaultMode }),

      clearInput: () => set({ inputText: '' }),
      clearOutput: () =>
        set({
          outputText: '',
          humanScore: null,
          readabilityScore: null,
          toneLabel: null,
        }),

      addToHistory: (entry) => {
        const { history } = get();
        const newEntry = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...entry,
        };
        set({ history: [newEntry, ...history].slice(0, 50) });
      },

      removeFromHistory: (id) => {
        const { history } = get();
        set({ history: history.filter((h) => h.id !== id) });
      },

      clearHistory: () => set({ history: [] }),

      addToast: (toast) => {
        const id = Date.now();
        set((state) => ({
          toasts: [...state.toasts, { id, ...toast }],
        }));
        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }));
        }, toast.duration || 3500);
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },
    }),
    {
      name: 'humanize-ai-store',
      partialize: (state) => ({
        theme: state.theme,
        history: state.history,
        exportFormat: state.exportFormat,
        defaultMode: state.defaultMode,
        mode: state.mode,
        strength: state.strength,
        creativity: state.creativity,
        complexity: state.complexity,
        inputText: state.inputText,
        outputText: state.outputText,
      }),
    }
  )
);

export default useAppStore;
