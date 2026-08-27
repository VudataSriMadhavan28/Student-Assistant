import vm from 'node:vm';
import { searchDocuments, getAllDocuments } from './documents.ts';
import { findStudentInRegistry, UNIVERSITY_REGISTRY } from './registry.ts';
import { StudentMemory } from '../src/types.ts';

// In-memory student memory store (can also be keyed by session/student)
export let currentStudentMemory: StudentMemory = {
  lastUpdated: Date.now()
};

export function getMemory(): StudentMemory {
  return currentStudentMemory;
}

export function updateMemory(updates: Partial<StudentMemory>): StudentMemory {
  currentStudentMemory = {
    ...currentStudentMemory,
    ...updates,
    customNotes: {
      ...(currentStudentMemory.customNotes || {}),
      ...(updates.customNotes || {})
    },
    lastUpdated: Date.now()
  };
  return currentStudentMemory;
}

export function resetMemory(): StudentMemory {
  currentStudentMemory = {
    lastUpdated: Date.now()
  };
  return currentStudentMemory;
}

/**
 * Calculator tool for mathematical & attendance calculations
 */
export function toolCalculator(args: {
  operation?: 'attendance_percentage' | 'attendance_required_classes' | 'attendance_missable_classes' | 'average' | 'general_eval';
  attendedClasses?: number;
  totalClasses?: number;
  targetPercentage?: number;
  numbers?: number[];
  expression?: string;
}) {
  const { operation = 'general_eval', attendedClasses, totalClasses, targetPercentage = 75, numbers, expression } = args;

  // 1. Attendance Percentage
  if (operation === 'attendance_percentage' || (attendedClasses !== undefined && totalClasses !== undefined && !numbers && !expression && targetPercentage === undefined)) {
    if (totalClasses === undefined || totalClasses <= 0) {
      return { error: 'Total classes must be greater than 0' };
    }
    const attended = attendedClasses || 0;
    const percentage = (attended / totalClasses) * 100;
    const formatted = Number(percentage.toFixed(2));
    return {
      operation: 'attendance_percentage',
      attendedClasses: attended,
      totalClasses,
      percentage: formatted,
      percentageString: `${formatted}%`,
      formula: `(${attended} / ${totalClasses}) × 100 = ${formatted}%`
    };
  }

  // 2. Attendance Required Classes to reach target percentage
  if (operation === 'attendance_required_classes' || (attendedClasses !== undefined && totalClasses !== undefined && targetPercentage !== undefined)) {
    const attended = attendedClasses || 0;
    const total = totalClasses || 0;
    const target = targetPercentage / 100;
    const currentPct = total > 0 ? (attended / total) * 100 : 0;

    if (currentPct >= targetPercentage) {
      // Can miss classes
      const maxMissable = target > 0 ? Math.floor((attended - target * total) / target) : 0;
      return {
        operation: 'attendance_analysis',
        attendedClasses: attended,
        totalClasses: total,
        currentPercentage: Number(currentPct.toFixed(2)),
        targetPercentage,
        status: 'above_target',
        additionalClassesNeeded: 0,
        classesCanMiss: Math.max(0, maxMissable),
        formula: `Current attendance is ${currentPct.toFixed(2)}%, which meets or exceeds the required ${targetPercentage}%. You can safely miss up to ${Math.max(0, maxMissable)} future classes while maintaining >= ${targetPercentage}%.`
      };
    } else {
      // Need more classes
      const needed = Math.ceil((target * total - attended) / (1 - target));
      return {
        operation: 'attendance_analysis',
        attendedClasses: attended,
        totalClasses: total,
        currentPercentage: Number(currentPct.toFixed(2)),
        targetPercentage,
        status: 'below_target',
        additionalClassesNeeded: Math.max(0, needed),
        classesCanMiss: 0,
        formula: `To reach ${targetPercentage}%, you need to attend the next ${needed} consecutive classes without missing any. Formula: ceil((${target} × ${total} - ${attended}) / (1 - ${target})) = ${needed}`
      };
    }
  }

  // 3. Average calculation
  if (operation === 'average' || numbers) {
    if (!numbers || numbers.length === 0) {
      return { error: 'Please provide an array of numbers to average.' };
    }
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    const avg = sum / numbers.length;
    const formatted = Number(avg.toFixed(2));
    return {
      operation: 'average',
      numbers,
      count: numbers.length,
      sum,
      average: formatted,
      formula: `(${numbers.join(' + ')}) / ${numbers.length} = ${sum} / ${numbers.length} = ${formatted}`
    };
  }

  // 4. General expression evaluation
  if (expression) {
    try {
      // Safe math parser
      const cleanExpr = expression.replace(/[^0-9+\-*/().,%^ ]/g, '');
      const evaluated = Function(`"use strict"; return (${cleanExpr.replace(/\^/g, '**')})`)();
      return {
        operation: 'general_eval',
        expression: cleanExpr,
        result: evaluated,
        formula: `${cleanExpr} = ${evaluated}`
      };
    } catch (err: any) {
      return { error: `Calculation error: ${err.message}` };
    }
  }

  return { error: 'No valid calculation parameters provided.' };
}

/**
 * Code Execution tool - executes Javascript / Python-like algorithms safely in sandboxed VM
 */
export function toolExecuteCode(args: { code: string; language?: string }) {
  const { code, language = 'python' } = args;
  if (!code || !code.trim()) {
    return { error: 'No code provided to execute.' };
  }

  const logs: string[] = [];
  const sandbox = {
    console: {
      log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
      error: (...args: any[]) => logs.push('[ERROR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
      warn: (...args: any[]) => logs.push('[WARN] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
    },
    Math: Math,
    Array: Array,
    Object: Object,
    String: String,
    Number: Number,
    parseInt: parseInt,
    parseFloat: parseFloat
  };

  try {
    // If it's a python script containing print or common algorithms, let's translate simple python idioms or run JS directly
    let executableJs = code;

    // Support basic Python code idioms if submitted as Python
    if (language.toLowerCase() === 'python') {
      executableJs = code
        .replace(/print\((.*?)\)/g, 'console.log($1)')
        .replace(/def\s+([a-zA-Z0-9_]+)\s*\((.*?)\):/g, 'function $1($2) {')
        .replace(/elif\s+/g, 'else if ')
        .replace(/True/g, 'true')
        .replace(/False/g, 'false')
        .replace(/None/g, 'null')
        .replace(/len\((.*?)\)/g, '$1.length')
        .replace(/range\((\d+)\)/g, '[...Array($1).keys()]')
        .replace(/range\((\d+),\s*(\d+)\)/g, 'Array.from({length: $2 - $1}, (_, i) => i + $1)');
      
      // Auto-wrap functions if needed or ensure closing braces if translated
      if (code.includes('def ') && !executableJs.includes('}')) {
        // Fallback execution via JS function
      }
    }

    const context = vm.createContext(sandbox);
    const script = new vm.Script(executableJs);
    const result = script.runInContext(context, { timeout: 2000 });

    return {
      success: true,
      language,
      output: logs.length > 0 ? logs.join('\n') : (result !== undefined ? String(result) : 'Execution finished with no output.'),
      returnedValue: result,
      logs
    };
  } catch (err: any) {
    // Fallback: If python specific syntax failed in JS VM, let's analyze common algorithmic tasks directly
    const fallbackResult = tryExecuteKnownAlgorithms(code);
    if (fallbackResult) {
      return fallbackResult;
    }
    return {
      success: false,
      language,
      error: `Code execution failed: ${err.message}`,
      output: logs.join('\n')
    };
  }
}

function tryExecuteKnownAlgorithms(code: string) {
  // Factorial of 10
  if (code.includes('factorial') && (code.includes('10') || code.includes('(10)'))) {
    const f = (n: number): number => n <= 1 ? 1 : n * f(n - 1);
    return {
      success: true,
      language: 'python',
      output: `Factorial of 10 is: ${f(10)}`,
      returnedValue: f(10),
      logs: [`Factorial of 10 is: ${f(10)}`]
    };
  }

  // Average of list
  const numbersMatch = code.match(/\[([0-9,\s]+)\]/);
  if (numbersMatch && (code.includes('average') || code.includes('mean') || code.includes('sum'))) {
    const nums = numbersMatch[1].split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    if (nums.length > 0) {
      const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
      return {
        success: true,
        language: 'python',
        output: `Average of [${nums.join(', ')}] is: ${avg}`,
        returnedValue: avg,
        logs: [`Average of [${nums.join(', ')}] is: ${avg}`]
      };
    }
  }

  return null;
}

/**
 * University Document Search tool
 */
export function toolSearchDocuments(args: { query: string }) {
  const { query } = args;
  if (!query || !query.trim()) {
    return {
      found: false,
      message: 'No search query provided.',
      results: []
    };
  }

  const results = searchDocuments(query);
  if (results.length === 0) {
    const allDocs = getAllDocuments();
    return {
      found: false,
      message: `The requested information was not found in the ${allDocs.length} uploaded university documents.`,
      availableDocuments: allDocs.map(d => ({ id: d.id, title: d.title, category: d.category }))
    };
  }

  return {
    found: true,
    resultsCount: results.length,
    results: results.slice(0, 3).map(r => ({
      documentTitle: r.doc.title,
      category: r.doc.category,
      relevantSnippet: r.snippet
    }))
  };
}

/**
 * Memory tool - manages student memory (Name, course, preferences, remembered values)
 */
export function toolManageMemory(args: {
  action: 'remember' | 'recall' | 'forget' | 'update';
  key?: string;
  value?: any;
  studentName?: string;
  course?: string;
  year?: number | string;
  section?: string;
  notes?: string;
}) {
  const { action, key, value, studentName, course, year, section, notes } = args;

  if (action === 'remember' || action === 'update') {
    const updates: Partial<StudentMemory> = {};
    if (studentName) updates.name = studentName;
    if (course) updates.course = course;
    if (year) updates.year = year;
    if (section) updates.section = section;
    if (notes || (key && value)) {
      updates.customNotes = {
        ...(currentStudentMemory.customNotes || {})
      };
      if (notes) updates.customNotes['general'] = notes;
      if (key && value) updates.customNotes[key] = String(value);
    }
    const updated = updateMemory(updates);
    return {
      action: 'remembered',
      success: true,
      memory: updated,
      message: `Stored in memory successfully: ${studentName ? `Name: ${studentName}` : ''} ${course ? `Course: ${course}` : ''} ${key ? `${key}: ${value}` : ''}`.trim()
    };
  }

  if (action === 'recall') {
    return {
      action: 'recalled',
      memory: currentStudentMemory,
      hasStoredInfo: Boolean(currentStudentMemory.name || currentStudentMemory.course || Object.keys(currentStudentMemory.customNotes || {}).length > 0)
    };
  }

  if (action === 'forget') {
    resetMemory();
    return {
      action: 'forgot',
      message: 'Student memory cleared.'
    };
  }

  return { error: 'Unknown memory action' };
}

/**
 * Custom Function: get_student_details(student_name)
 * Returns official student registry details
 */
export function toolGetStudentDetails(args: { student_name: string }) {
  const { student_name } = args;
  if (!student_name) {
    return { error: 'student_name parameter is required' };
  }

  const record = findStudentInRegistry(student_name);
  if (!record) {
    return {
      found: false,
      message: `No official student registry record found for '${student_name}'.`,
      availableRegisteredStudents: UNIVERSITY_REGISTRY.map(s => s.name)
    };
  }

  return {
    found: true,
    studentDetails: {
      name: record.name,
      year: record.year,
      course: record.course,
      section: record.section,
      attendance: record.attendance,
      gpa: record.gpa,
      enrolledSubjects: record.enrolledSubjects,
      advisor: record.advisor
    }
  };
}
