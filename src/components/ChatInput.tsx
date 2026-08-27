import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Upload, Loader2, Calculator } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onOpenDocs: () => void;
  onOpenAttendance: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onOpenDocs,
  onOpenAttendance
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white/95 backdrop-blur-md p-4 sticky bottom-0 z-20 shadow-xs">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative flex flex-col gap-2">
          {/* Main Input Box */}
          <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-2xs">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask an academic question, attendance formula, document query, or study task..."
              rows={1}
              disabled={isLoading}
              id="student-chat-input"
              className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 resize-none px-3 py-2 focus:outline-none max-h-36 min-h-[44px]"
            />

            <div className="flex items-center gap-1.5 pb-1 pr-1">
              <button
                type="button"
                onClick={onOpenDocs}
                title="Upload or manage university documents"
                className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors"
              >
                <Upload className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenAttendance}
                title="Open Attendance Calculator"
                className="p-2 rounded-xl text-slate-500 hover:text-orange-600 hover:bg-orange-50 border border-transparent hover:border-orange-200 transition-colors"
              >
                <Calculator className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                id="btn-send-message"
                className="p-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:hover:bg-blue-500 text-white font-medium transition-all shadow-xs flex items-center justify-center shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-medium text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Autonomous Agent Loop: Understand → Plan → Tools → Check → Structured Answer
            </span>
            <span className="hidden sm:inline text-slate-400">Press Enter to send, Shift+Enter for new line</span>
          </div>
        </form>
      </div>
    </div>
  );
};

