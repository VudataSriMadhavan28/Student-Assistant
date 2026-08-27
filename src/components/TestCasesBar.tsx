import React, { useState } from 'react';
import {
  Sparkles,
  Calculator,
  UserCheck,
  Search,
  FileSearch,
  Code2,
  Calendar,
  Database,
  BookOpen
} from 'lucide-react';

interface TestCase {
  id: string;
  label: string;
  prompt: string;
  expectedTool: 'Direct' | 'Calculator' | 'Memory' | 'Google Search' | 'Document Search' | 'Code Execution' | 'Multi-Step' | 'Registry';
  icon: React.ReactNode;
  category: 'core' | 'attendance' | 'memory' | 'tools' | 'academic';
}

const TEST_CASES: TestCase[] = [
  {
    id: 'test-genai',
    label: 'What is GenAI?',
    prompt: 'What is Generative AI?',
    expectedTool: 'Direct',
    icon: <BookOpen className="w-3 h-3 text-blue-500" />,
    category: 'academic'
  },
  {
    id: 'test-attendance-pct',
    label: '42/50 Attendance %',
    prompt: 'I attended 42 out of 50 classes. What is my attendance percentage?',
    expectedTool: 'Calculator',
    icon: <Calculator className="w-3 h-3 text-orange-500" />,
    category: 'attendance'
  },
  {
    id: 'test-remember-rahul',
    label: 'Remember: Name Rahul',
    prompt: 'My name is Rahul. Remember my name.',
    expectedTool: 'Memory',
    icon: <UserCheck className="w-3 h-3 text-emerald-500" />,
    category: 'memory'
  },
  {
    id: 'test-recall-name',
    label: 'Recall: What is my name?',
    prompt: 'What is my name?',
    expectedTool: 'Memory',
    icon: <UserCheck className="w-3 h-3 text-emerald-500" />,
    category: 'memory'
  },
  {
    id: 'test-ai-agents',
    label: 'Explain AI Agents',
    prompt: 'Explain AI Agents in simple language.',
    expectedTool: 'Direct',
    icon: <Sparkles className="w-3 h-3 text-purple-500" />,
    category: 'academic'
  },
  {
    id: 'test-latest-genai',
    label: 'Latest GenAI Updates',
    prompt: 'What are the latest developments in Generative AI?',
    expectedTool: 'Google Search',
    icon: <Search className="w-3 h-3 text-blue-500" />,
    category: 'tools'
  },
  {
    id: 'test-doc-attendance',
    label: 'Min Attendance Policy',
    prompt: 'What is the minimum attendance requirement?',
    expectedTool: 'Document Search',
    icon: <FileSearch className="w-3 h-3 text-emerald-500" />,
    category: 'tools'
  },
  {
    id: 'test-calc-average',
    label: 'Average of Marks',
    prompt: 'Calculate the average of these marks: 78, 82, 91, 69, 88.',
    expectedTool: 'Calculator',
    icon: <Calculator className="w-3 h-3 text-orange-500" />,
    category: 'attendance'
  },
  {
    id: 'test-study-plan',
    label: '7-Day Study Plan',
    prompt: 'Create a study plan for me for the next 7 days.',
    expectedTool: 'Multi-Step',
    icon: <Calendar className="w-3 h-3 text-rose-500" />,
    category: 'academic'
  },
  {
    id: 'test-attendance-75',
    label: 'Maintain 75% Requirement',
    prompt: 'I attended 42 out of 50 classes. The minimum requirement is 75%. How many more classes should I attend to maintain the requirement?',
    expectedTool: 'Calculator',
    icon: <Calculator className="w-3 h-3 text-orange-500" />,
    category: 'attendance'
  },
  {
    id: 'test-registry-rahul',
    label: "Rahul's System Details",
    prompt: "Ask the system for Rahul's details.",
    expectedTool: 'Registry',
    icon: <Database className="w-3 h-3 text-teal-500" />,
    category: 'tools'
  }
];

interface TestCasesBarProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export const TestCasesBar: React.FC<TestCasesBarProps> = ({ onSelectPrompt, disabled }) => {
  const [filter, setFilter] = useState<'all' | 'academic' | 'attendance' | 'memory' | 'tools'>('all');

  const filteredCases = filter === 'all'
    ? TEST_CASES
    : TEST_CASES.filter(t => t.category === filter);

  return (
    <div className="bg-white/95 border-b border-slate-200 px-4 py-2 shadow-2xs backdrop-blur-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Quick Prompts:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-full border border-slate-200">
            {(['all', 'attendance', 'memory', 'tools', 'academic'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
                  filter === cat
                    ? 'bg-blue-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable pill container */}
        <div className="w-full md:w-auto overflow-x-auto pb-1 md:pb-0 flex items-center gap-1.5 scrollbar-thin">
          {filteredCases.map(test => (
            <button
              key={test.id}
              onClick={() => onSelectPrompt(test.prompt)}
              disabled={disabled}
              id={`test-case-${test.id}`}
              title={`${test.prompt}\n(Expected tool: ${test.expectedTool})`}
              className="group flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-blue-50/70 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 text-xs font-medium transition-all shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {test.icon}
              <span className="truncate max-w-[140px] sm:max-w-[180px]">{test.label}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-100 group-hover:bg-blue-100 text-slate-500 group-hover:text-blue-700 font-semibold font-mono">
                {test.expectedTool}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

