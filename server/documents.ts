import { UniversityDocument } from '../src/types.ts';

// Initial pre-loaded university documents
let documentsStore: UniversityDocument[] = [
  {
    id: 'doc-attendance-policy-2026',
    title: 'University Attendance Policy & Academic Regulations 2025-2026',
    category: 'policy',
    isSystemDefault: true,
    uploadedAt: Date.now() - 86400000 * 30,
    summary: 'Official institutional attendance requirements, 75% minimum threshold, medical leave condonation, and exam eligibility criteria.',
    content: `UNIVERSITY ATTENDANCE & ACADEMIC REGULATIONS (2025-2026)
Section 1: General Attendance Mandate
1.1. Minimum Requirement: All undergraduate and postgraduate students must maintain a minimum attendance of 75% in each registered course (lectures, tutorials, and laboratory sessions combined) to be eligible to appear for the End-Semester Final Examinations.
1.2. Attendance Formula:
Attendance Percentage = (Number of Classes Attended / Total Number of Classes Conducted) × 100

Section 2: Condonation & Medical Exemption
2.1. Medical Leave (65% to 74%): Students having an attendance between 65% and 74.9% may apply for attendance condonation on valid medical grounds or official university representation (sports/hackathons/conferences).
2.2. Supporting Documentation: Medical certificates issued by a registered medical practitioner must be submitted to the Academic Dean's Office within 7 working days of returning to campus.
2.3. Debarment (<65%): Any student with attendance below 65% in a subject is strictly debarred from sitting in the end-semester examination for that subject and must re-register during the subsequent summer or regular semester.

Section 3: Calculation Rules & Remedial Classes
3.1. Consecutive Absences: Missing more than 3 consecutive lectures without prior intimation triggers an automated warning notice to the student's advisor and parents.
3.2. Compensatory/Remedial Sessions: Remedial lectures conducted by course instructors count towards total classes conducted and may be attended to boost the cumulative percentage.`
  },
  {
    id: 'doc-cs301-ai-syllabus',
    title: 'CS301: Artificial Intelligence & Autonomous Agents - Course Handout',
    category: 'syllabus',
    isSystemDefault: true,
    uploadedAt: Date.now() - 86400000 * 15,
    summary: 'Course structure, lecture modules on Generative AI & AI Agents, grading breakdown, and lab schedule.',
    content: `CS301: ARTIFICIAL INTELLIGENCE & AUTONOMOUS AGENTS (Fall 2025/2026)
Instructor: Prof. Alan Turing | Credits: 4.0 | Prerequisites: Data Structures & Algorithms (CS204)

Course Objectives:
This course provides a comprehensive exploration of classic search algorithms, machine learning paradigms, modern generative AI, and autonomous agent architectures (ReAct, Planning, Tool Integration).

Lecture Schedule & Major Topics:
- Unit 1: Foundations of AI, State-Space Search (A*, Minimax with Alpha-Beta Pruning).
- Unit 2: Machine Learning Fundamentals (Supervised vs Unsupervised, Loss Functions, Gradient Descent).
- Unit 3: Generative AI & Large Language Models (Transformer architectures, Attention mechanisms, Prompt Engineering, Grounding).
- Unit 4: AI Agents & Autonomous Workflows (Agent loop: Understand -> Plan -> Tool Use -> Check Result, Tool Calling, Multi-agent collaboration, Memory systems).
- Unit 5: AI Ethics, Alignment, and Safety in University & Industrial Deployments.

Grading Weightage:
- Midterm Examination: 30%
- Final Capstone Agent Project: 25%
- Lab Assignments & Programming Quizzes: 20%
- Continuous Quizzes & Homework: 15%
- Class Participation & Attendance (>=75% required): 10%`
  },
  {
    id: 'doc-cs204-dsa-guide',
    title: 'CS204: Data Structures & Algorithms Lab Reference Guide',
    category: 'notes',
    isSystemDefault: true,
    uploadedAt: Date.now() - 86400000 * 7,
    summary: 'Sorting algorithm complexities, recursion formulas, and time complexity comparisons.',
    content: `CS204: DATA STRUCTURES & ALGORITHMS LAB GUIDE
Key Topics & Complexity Summaries:

1. Sorting Algorithms Comparison:
- Bubble Sort:
  * Best Case: O(n) (when already sorted)
  * Average & Worst Case: O(n^2)
  * Space Complexity: O(1)
  * Swaps/Comparisons: Performs up to n*(n-1)/2 comparisons.
- Merge Sort:
  * Best, Average, and Worst Case: O(n log n)
  * Space Complexity: O(n) (auxiliary array)
  * Stable: Yes. Divide and Conquer strategy.
- Quick Sort:
  * Best & Average Case: O(n log n)
  * Worst Case: O(n^2) (poor pivot selection)
  * Space: O(log n) call stack.

2. Recursion & Tree Depth:
- Factorial(n) = n * Factorial(n-1), with base case Factorial(0) = 1. Takes n recursive calls.
- Binary Search Tree: Search time is O(log n) for balanced tree, O(n) for skewed tree.`
  }
];

export function getAllDocuments(): UniversityDocument[] {
  return documentsStore;
}

export function getDocumentById(id: string): UniversityDocument | undefined {
  return documentsStore.find(d => d.id === id);
}

export function addDocument(doc: Omit<UniversityDocument, 'id' | 'uploadedAt'>): UniversityDocument {
  const newDoc: UniversityDocument = {
    ...doc,
    id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    uploadedAt: Date.now(),
    isSystemDefault: false
  };
  documentsStore.push(newDoc);
  return newDoc;
}

export function deleteDocument(id: string): boolean {
  const initialLen = documentsStore.length;
  documentsStore = documentsStore.filter(d => d.id !== id);
  return documentsStore.length < initialLen;
}

export function searchDocuments(query: string): { doc: UniversityDocument; snippet: string; score: number }[] {
  if (!query || !query.trim()) return [];
  const qTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  const results: { doc: UniversityDocument; snippet: string; score: number }[] = [];

  for (const doc of documentsStore) {
    let score = 0;
    const lowerContent = doc.content.toLowerCase();
    const lowerTitle = doc.title.toLowerCase();

    for (const term of qTerms) {
      if (lowerTitle.includes(term)) score += 5;
      const occurrences = lowerContent.split(term).length - 1;
      score += Math.min(occurrences, 10);
    }

    if (score > 0) {
      // Find relevant snippet
      let snippet = '';
      const firstTerm = qTerms.find(t => lowerContent.includes(t));
      if (firstTerm) {
        const idx = lowerContent.indexOf(firstTerm);
        const start = Math.max(0, idx - 100);
        const end = Math.min(doc.content.length, idx + 300);
        snippet = doc.content.slice(start, end).trim();
      } else {
        snippet = doc.content.slice(0, 300).trim();
      }

      results.push({
        doc,
        snippet: snippet.length < doc.content.length ? snippet + '...' : snippet,
        score
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
