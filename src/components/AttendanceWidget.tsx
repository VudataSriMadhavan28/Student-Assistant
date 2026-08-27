import React, { useState } from 'react';
import {
  X,
  Calculator,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Send,
  HelpCircle
} from 'lucide-react';

interface AttendanceWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onAskQuestion: (question: string) => void;
}

export const AttendanceWidget: React.FC<AttendanceWidgetProps> = ({
  isOpen,
  onClose,
  onAskQuestion
}) => {
  const [attended, setAttended] = useState(42);
  const [total, setTotal] = useState(50);
  const [target, setTarget] = useState(75);

  if (!isOpen) return null;

  const currentPct = total > 0 ? Number(((attended / total) * 100).toFixed(2)) : 0;
  const isEligible = currentPct >= target;

  // Calculate required or missable classes
  const targetFraction = target / 100;
  let classesCanMiss = 0;
  let classesNeeded = 0;

  if (isEligible) {
    classesCanMiss = targetFraction > 0 ? Math.floor((attended - targetFraction * total) / targetFraction) : 0;
  } else {
    classesNeeded = Math.ceil((targetFraction * total - attended) / (1 - targetFraction));
  }

  const handleSendToChat = (text: string) => {
    onAskQuestion(text);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-slate-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 border border-orange-200 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Attendance Calculator Tool</h2>
              <p className="text-xs text-slate-500">Formula: (Attended / Total) × 100</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Sliders & Inputs */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                <span>Classes Attended</span>
                <span className="font-bold text-blue-600 font-mono text-sm">{attended}</span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(total, 100)}
                value={attended}
                onChange={(e) => setAttended(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                <span>Total Classes Conducted</span>
                <span className="font-bold text-blue-600 font-mono text-sm">{total}</span>
              </div>
              <input
                type="range"
                min={1}
                max={120}
                value={total}
                onChange={(e) => setTotal(Math.max(1, Number(e.target.value)))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                <span>University Target Requirement</span>
                <span className="font-bold text-orange-600 font-mono text-sm">{target}%</span>
              </div>
              <div className="flex gap-2">
                {[75, 80, 85, 90].map((tVal) => (
                  <button
                    key={tVal}
                    type="button"
                    onClick={() => setTarget(tVal)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      target === tVal
                        ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tVal}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className={`p-4 rounded-xl border ${
            isEligible
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : 'bg-rose-50/80 border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Current Attendance Standing
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {isEligible ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Eligible for Exams</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span className="text-rose-700">Attendance Shortage</span>
                  </>
                )}
              </div>
            </div>

            <div className="mt-2 text-3xl font-black font-mono tracking-tight text-slate-900 flex items-baseline gap-2">
              <span>{currentPct}%</span>
              <span className="text-xs font-normal text-slate-500">
                ({attended} / {total} classes)
              </span>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-slate-700">
              {isEligible ? (
                <>
                  🎉 You are <strong className="text-emerald-700 font-bold">above the {target}% threshold</strong>. You can safely miss up to <strong className="text-emerald-700 font-mono font-bold">{classesCanMiss}</strong> upcoming classes.
                </>
              ) : (
                <>
                  ⚠️ You are <strong className="text-rose-700 font-bold">below the {target}% threshold</strong>. You must attend the next <strong className="text-rose-700 font-mono font-bold">{classesNeeded}</strong> consecutive classes without absence.
                </>
              )}
            </p>
          </div>

          {/* Ask in Chat Quick Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Ask Assistant via Agent Tool
            </span>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => handleSendToChat(`I attended ${attended} out of ${total} classes. What is my attendance percentage?`)}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-between group transition-colors"
              >
                <span>Calculate percentage ({attended}/{total})</span>
                <Send className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => handleSendToChat(`I attended ${attended} out of ${total} classes. The minimum requirement is ${target}%. How many more classes should I attend to maintain the requirement?`)}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-between group transition-colors"
              >
                <span>Check {target}% requirement & needed classes</span>
                <Send className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

