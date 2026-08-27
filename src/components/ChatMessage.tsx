import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Calculator,
  Search,
  FileText,
  UserCheck,
  Code2,
  Database,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { ChatMessage as ChatMessageType, ToolActionTrace } from '../types.ts';

interface ChatMessageProps {
  message: ChatMessageType;
  onSelectPrompt?: (prompt: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [showTrace, setShowTrace] = useState(false);

  const isUser = message.sender === 'user';
  const structured = message.structured;
  const trace = message.trace;

  const handleCopy = () => {
    let textToCopy = message.content;
    if (structured) {
      textToCopy = `Answer:\n${structured.answer}\n\nExplanation:\n${structured.explanation}\n\nSource/Reason:\n${structured.sourceReason}\n\nConfidence:\n${structured.confidence}`;
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper for confidence badge colors
  const getConfidenceBadge = (confidence?: 'High' | 'Medium' | 'Low') => {
    if (confidence === 'High') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          High Confidence
        </span>
      );
    }
    if (confidence === 'Medium') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
          <AlertCircle className="w-3.5 h-3.5" />
          Medium Confidence
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
        <AlertCircle className="w-3.5 h-3.5" />
        Low Confidence
      </span>
    );
  };

  // Helper for Tool icons
  const getToolIcon = (toolName: string) => {
    switch (toolName) {
      case 'calculator':
        return <Calculator className="w-3.5 h-3.5 text-orange-500" />;
      case 'googleSearch':
        return <Search className="w-3.5 h-3.5 text-blue-500" />;
      case 'search_university_documents':
        return <FileText className="w-3.5 h-3.5 text-emerald-500" />;
      case 'manage_memory':
        return <UserCheck className="w-3.5 h-3.5 text-cyan-500" />;
      case 'execute_code':
        return <Code2 className="w-3.5 h-3.5 text-purple-500" />;
      case 'get_student_details':
        return <Database className="w-3.5 h-3.5 text-teal-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 my-3">
        <div className="max-w-xl bg-blue-500 text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-xs">
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
          <div className="mt-1 flex justify-end">
            <span className="text-[10px] text-blue-100">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 font-bold shrink-0 mt-1">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-3 my-3">
      {/* Assistant Avatar */}
      <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center text-white font-black text-sm shrink-0 mt-1 shadow-2xs">
        U
      </div>

      <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-xs text-slate-800">
        {/* If structured output exists */}
        {structured ? (
          <div className="space-y-4">
            {/* Header: Tool tags and Confidence */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-1.5">
                {structured.toolUsed && structured.toolUsed.length > 0 ? (
                  structured.toolUsed.map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {getToolIcon(t)}
                      <span className="capitalize">
                        {t === 'googleSearch'
                          ? 'Google Search'
                          : t === 'search_university_documents'
                          ? 'Document Search'
                          : t === 'manage_memory'
                          ? 'Memory'
                          : t === 'execute_code'
                          ? 'Code Execution'
                          : t === 'get_student_details'
                          ? 'System Registry'
                          : t}
                      </span>
                    </span>
                  ))
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    Direct Academic Answer
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {getConfidenceBadge(structured.confidence)}
                <button
                  onClick={handleCopy}
                  title="Copy structured response"
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Answer Section */}
            <div>
              <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase mb-1">
                Answer
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug bg-blue-50/70 p-3.5 rounded-xl border border-blue-200/80">
                {structured.answer}
              </div>
            </div>

            {/* Explanation Section */}
            <div>
              <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase mb-1">
                Explanation
              </div>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-normal">
                {structured.explanation}
              </div>
            </div>

            {/* Source/Reason Section */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase mb-1">
                Source / Reason
              </div>
              <div className="text-xs text-blue-800 font-medium bg-blue-50/50 border border-blue-100 px-3 py-2 rounded-lg">
                {structured.sourceReason}
              </div>
            </div>

            {/* Collapsible Agent Core Loop Trace */}
            {trace && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowTrace(!showTrace)}
                  className="flex items-center justify-between w-full text-left text-xs text-slate-500 hover:text-slate-800 transition-colors py-1"
                >
                  <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-blue-600">
                    <Sparkles className="w-3 h-3" />
                    Agent Decision Loop (Understand → Plan → Tools → Check)
                  </span>
                  {showTrace ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showTrace && (
                  <div className="mt-2 space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
                    {trace.understand && (
                      <div>
                        <span className="text-blue-600 font-bold">1. UNDERSTAND:</span>{' '}
                        <span className="text-slate-700">{trace.understand}</span>
                      </div>
                    )}
                    {trace.plan && (
                      <div>
                        <span className="text-indigo-600 font-bold">2. PLAN:</span>{' '}
                        <span className="text-slate-700">{trace.plan}</span>
                      </div>
                    )}
                    {trace.toolsUsed && trace.toolsUsed.length > 0 && (
                      <div>
                        <span className="text-orange-600 font-bold">3. TOOLS EXECUTED:</span>
                        <div className="mt-1 space-y-1.5 pl-2.5 border-l-2 border-slate-200">
                          {trace.toolsUsed.map((tu: ToolActionTrace, i: number) => (
                            <div key={i} className="text-[11px]">
                              <span className="text-blue-700 font-bold">[{tu.tool}]</span> Input:{' '}
                              <span className="text-slate-600">{JSON.stringify(tu.input)}</span>
                              <br />
                              Output:{' '}
                              <span className="text-emerald-700 font-semibold">{JSON.stringify(tu.output)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {trace.checkResult && (
                      <div>
                        <span className="text-emerald-600 font-bold">4. CHECK RESULT:</span>{' '}
                        <span className="text-slate-700">{trace.checkResult}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // Fallback Plain Text
          <div className="text-sm leading-relaxed whitespace-pre-wrap text-slate-800">{message.content}</div>
        )}

        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
          <span>UniAssist Agent</span>
          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
};

