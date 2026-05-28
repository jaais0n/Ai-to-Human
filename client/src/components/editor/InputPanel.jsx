import { useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, FileText, Type } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { useWordCount } from '../../hooks/useWordCount';
import { parseFile } from '../../utils/fileParser';

export default function InputPanel() {
  const { inputText, setInputText, clearInput, addToast } = useAppStore();
  const { words, chars, sentences } = useWordCount(inputText);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await parseFile(file);
      setInputText(text);
      addToast({ type: 'success', message: `Loaded "${file.name}"` });
    } catch (err) {
      addToast({ type: 'error', message: err.message });
    }
    e.target.value = '';
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    try {
      const text = await parseFile(file);
      setInputText(text);
      addToast({ type: 'success', message: `Loaded "${file.name}"` });
    } catch (err) {
      addToast({ type: 'error', message: err.message });
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const charLimit = 12000;
  const charPercent = Math.min((chars / charLimit) * 100, 100);
  const isNearLimit = chars > charLimit * 0.9;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-500">Input</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-ghost flex items-center gap-1.5 px-2 py-1.5"
            title="Upload .txt or .docx"
          >
            <Upload className="w-3 h-3" />
            Upload
          </button>
          {inputText && (
            <button
              onClick={clearInput}
              className="btn-ghost flex items-center gap-1.5 px-2 py-1.5 hover:text-red-400 hover:border-red-500/20"
              title="Clear input"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Textarea */}
      <div
        className="relative flex-1 card-inner rounded-xl p-4 transition-all duration-200 overflow-hidden focus-within:border-white/15"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {!inputText && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
              <FileText className="w-4 h-4 text-neutral-600" />
            </div>
            <div className="text-center">
              <p className="text-sm text-neutral-600">Paste your text here</p>
              <p className="text-xs text-neutral-700 mt-1">or drag & drop a file</p>
            </div>
          </div>
        )}
        <textarea
          id="input-textarea"
          className="panel-textarea h-full min-h-[280px]"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder=""
          spellCheck={false}
          aria-label="Input text"
        />

        {/* Char limit bar */}
        {inputText && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
            <motion.div
              className="h-full rounded-full transition-colors duration-300"
              style={{
                width: `${charPercent}%`,
                background: isNearLimit ? '#ef4444' : 'rgba(255,255,255,0.3)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${charPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mt-2.5">
        <div className="flex items-center gap-4 text-[11px] text-neutral-600">
          <span>
            <span className="text-neutral-400 font-medium">{words.toLocaleString()}</span> words
          </span>
          <span>
            <span className="text-neutral-400 font-medium">{chars.toLocaleString()}</span> chars
          </span>
          <span>
            <span className="text-neutral-400 font-medium">{sentences}</span> sentences
          </span>
        </div>
        <span className={`text-[11px] ${isNearLimit ? 'text-red-400' : 'text-neutral-600'}`}>
          {chars.toLocaleString()} / {charLimit.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
