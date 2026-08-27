import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header.tsx';
import { TestCasesBar } from './components/TestCasesBar.tsx';
import { ChatMessage } from './components/ChatMessage.tsx';
import { ChatInput } from './components/ChatInput.tsx';
import { DocumentDrawer } from './components/DocumentDrawer.tsx';
import { MemoryModal } from './components/MemoryModal.tsx';
import { AttendanceWidget } from './components/AttendanceWidget.tsx';
import { RegistryModal } from './components/RegistryModal.tsx';
import {
  ChatMessage as ChatMessageType,
  UniversityDocument,
  StudentMemory
} from './types.ts';
import {
  Sparkles,
  BookOpen,
  Calculator,
  UserCheck,
  FileSearch,
  Bot
} from 'lucide-react';

const INITIAL_GREETING: ChatMessageType = {
  id: 'msg-welcome',
  sender: 'assistant',
  timestamp: Date.now(),
  content: 'Hello! I am your University Student Assistant. How can I help you today?',
  structured: {
    answer: 'Welcome to the University Student Assistant portal!',
    explanation: 'I am here to help university students with academic concepts (AI, Generative AI, AI Agents, ML, DSA, Math, Programming), exact attendance calculations, searching uploaded university policies and syllabi, managing your student profile memory, and executing multi-step study plans.',
    sourceReason: 'University Student Assistant initialization & core academic capabilities.',
    confidence: 'High'
  },
  trace: {
    understand: 'Session initialized for university student assistance.',
    plan: 'Ready to intelligently route queries to Direct Knowledge, Google Search, Document Search, Calculator, Code Execution, Memory, or Registry tools.',
    checkResult: 'Agent ready.'
  }
};

export default function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>([INITIAL_GREETING]);
  const [documents, setDocuments] = useState<UniversityDocument[]>([]);
  const [memory, setMemory] = useState<StudentMemory>({ lastUpdated: Date.now() });
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial documents and memory
  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.documents) {
          setDocuments(data.documents);
        }
      })
      .catch(console.error);

    fetch('/api/memory')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.memory) {
          setMemory(data.memory);
        }
      })
      .catch(console.error);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Send message to assistant
  const handleSendMessage = async (prompt: string) => {
    if (!prompt.trim() || isLoading) return;

    const userMsg: ChatMessageType = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: prompt,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build conversation history (last 8 turns)
      const history = messages.slice(-8).map(m => ({
        role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: m.structured ? `Answer: ${m.structured.answer}\nExplanation: ${m.structured.explanation}` : m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          conversationHistory: history
        })
      });

      const data = await res.json();
      if (data.success) {
        const assistantMsg: ChatMessageType = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          content: data.structured?.answer || 'Response received',
          structured: data.structured,
          trace: data.trace,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, assistantMsg]);
        if (data.memory) {
          setMemory(data.memory);
        }
      } else {
        throw new Error(data.error || 'Failed to process response');
      }
    } catch (err: any) {
      console.error('Error sending message:', err);
      const errorMsg: ChatMessageType = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        content: `Error: ${err.message}`,
        structured: {
          answer: `I encountered an issue processing your request: ${err.message}`,
          explanation: `The assistant could not complete the tool decision or model call. Please try again or rephrase your question.`,
          sourceReason: 'Error handling fallback',
          confidence: 'Low'
        },
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Upload document
  const handleUploadDocument = async (docData: {
    title: string;
    category: 'policy' | 'syllabus' | 'notes' | 'general';
    content: string;
    summary: string;
  }) => {
    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docData)
      });
      const data = await res.json();
      if (data.success && data.document) {
        setDocuments(prev => [...prev, data.document]);
      }
    } catch (err) {
      console.error('Failed to upload document:', err);
    }
  };

  // Delete document
  const handleDeleteDocument = async (id: string) => {
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setDocuments(prev => prev.filter(d => d.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  // Update memory
  const handleUpdateMemory = async (updates: Partial<StudentMemory>) => {
    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success && data.memory) {
        setMemory(data.memory);
      }
    } catch (err) {
      console.error('Failed to update memory:', err);
    }
  };

  // Reset memory
  const handleResetMemory = async () => {
    try {
      const res = await fetch('/api/memory/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.memory) {
        setMemory(data.memory);
      }
    } catch (err) {
      console.error('Failed to reset memory:', err);
    }
  };

  // Clear chat
  const handleClearChat = () => {
    setMessages([INITIAL_GREETING]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F5FF] text-slate-800 antialiased font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navigation */}
      <Header
        memory={memory}
        docCount={documents.length}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenMemory={() => setIsMemoryOpen(true)}
        onOpenAttendance={() => setIsAttendanceOpen(true)}
        onOpenRegistry={() => setIsRegistryOpen(true)}
        onClearChat={handleClearChat}
      />

      {/* Quick Test Cases Bar for 1-click testing */}
      <TestCasesBar
        onSelectPrompt={handleSendMessage}
        disabled={isLoading}
      />

      {/* Main Chat Stream Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onSelectPrompt={handleSendMessage}
            />
          ))}

          {/* Loading Indicator with Agent Thinking Animation */}
          {isLoading && (
            <div className="flex justify-start gap-3 my-4 animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center text-white shrink-0 mt-1 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-4 shadow-sm flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  Agent Loop: Understanding → Planning → Executing Tools → Checking...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenAttendance={() => setIsAttendanceOpen(true)}
      />

      {/* Modals & Drawers */}
      <DocumentDrawer
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
        documents={documents}
        onUploadDocument={handleUploadDocument}
        onDeleteDocument={handleDeleteDocument}
        onAskAboutDoc={handleSendMessage}
      />

      <MemoryModal
        isOpen={isMemoryOpen}
        onClose={() => setIsMemoryOpen(false)}
        memory={memory}
        onUpdateMemory={handleUpdateMemory}
        onResetMemory={handleResetMemory}
      />

      <AttendanceWidget
        isOpen={isAttendanceOpen}
        onClose={() => setIsAttendanceOpen(false)}
        onAskQuestion={handleSendMessage}
      />

      <RegistryModal
        isOpen={isRegistryOpen}
        onClose={() => setIsRegistryOpen(false)}
        onAskAboutStudent={(name) => handleSendMessage(`Ask the system for ${name}'s details.`)}
      />
    </div>
  );
}
