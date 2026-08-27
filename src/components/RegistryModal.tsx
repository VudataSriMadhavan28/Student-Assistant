import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Search,
  User,
  GraduationCap,
  Percent,
  BookOpen,
  Send
} from 'lucide-react';
import { StudentRegistryRecord } from '../types.ts';

interface RegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAboutStudent: (name: string) => void;
}

export const RegistryModal: React.FC<RegistryModalProps> = ({
  isOpen,
  onClose,
  onAskAboutStudent
}) => {
  const [students, setStudents] = useState<StudentRegistryRecord[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/registry')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.registry) {
            setStudents(data.registry);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.course.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">University Student Registry</h2>
              <p className="text-xs text-slate-500">
                Official records queried via custom tool: <code className="text-emerald-700 font-bold">get_student_details(name)</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search registry by student name, course, or ID..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
            />
          </div>
        </div>

        {/* List of Registered Students */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-white">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{s.name}</span>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded font-semibold">
                    {s.id}
                  </span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-bold">
                    Year {s.year} • Sec {s.section}
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  <strong>Course:</strong> {s.course} | <strong>Advisor:</strong> {s.advisor}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] font-bold text-emerald-600">
                    Attendance: {s.attendance}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[11px] text-orange-600 font-bold">
                    GPA: {s.gpa}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onAskAboutStudent(s.name);
                  onClose();
                }}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask for details</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

