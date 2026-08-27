import React from 'react';
import {
  GraduationCap,
  Sparkles,
  FileText,
  Calculator,
  User,
  RotateCcw,
  Database,
  Search
} from 'lucide-react';
import { StudentMemory } from '../types.ts';

interface HeaderProps {
  memory: StudentMemory;
  docCount: number;
  onOpenDocs: () => void;
  onOpenMemory: () => void;
  onOpenAttendance: () => void;
  onOpenRegistry: () => void;
  onClearChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  memory,
  docCount,
  onOpenDocs,
  onOpenMemory,
  onOpenAttendance,
  onOpenRegistry,
  onClearChat
}) => {
  const studentDisplayName = memory.name || 'Rahul';
  const studentCourse = memory.course || 'CS Year 2';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Branding & Role */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-blue-500/20">
            U
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-blue-600 text-lg tracking-tight">
                UniAssist
              </h1>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                AI Agent Active
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              University Student Assistant • Q&A, Attendance, Documents & Memory
            </p>
          </div>
        </div>

        {/* Right: Quick Tools & Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Active Student Memory Pill */}
          <button
            onClick={onOpenMemory}
            id="btn-header-memory"
            title="Inspect or edit active student memory"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 hover:bg-blue-100/80 text-slate-800 border border-blue-200/80 transition-all shadow-2xs"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="max-w-[130px] truncate">{studentDisplayName} • {studentCourse}</span>
          </button>

          {/* University Documents Vault */}
          <button
            onClick={onOpenDocs}
            id="btn-header-docs"
            title="View or upload university documents & policies"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">Docs</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
              {docCount}
            </span>
          </button>

          {/* Attendance Calculator Tool */}
          <button
            onClick={onOpenAttendance}
            id="btn-header-attendance"
            title="Quick Attendance Percentage & 75% Requirement Calculator"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors shadow-2xs"
          >
            <Calculator className="w-3.5 h-3.5 text-orange-500" />
            <span className="hidden md:inline">Attendance</span>
          </button>

          {/* Student Registry */}
          <button
            onClick={onOpenRegistry}
            id="btn-header-registry"
            title="University Student Registry (get_student_details lookup)"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors shadow-2xs"
          >
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span>Registry</span>
          </button>

          {/* Clear Session */}
          <button
            onClick={onClearChat}
            id="btn-header-clear"
            title="Reset chat conversation"
            className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

