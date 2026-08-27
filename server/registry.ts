import { StudentRegistryRecord } from '../src/types.ts';

export const UNIVERSITY_REGISTRY: StudentRegistryRecord[] = [
  {
    id: 'STD-2024-001',
    name: 'Rahul',
    year: 2,
    course: 'Computer Science',
    section: 'A',
    attendance: '84%',
    gpa: 3.85,
    enrolledSubjects: ['Data Structures & Algorithms', 'Artificial Intelligence', 'Operating Systems', 'Discrete Mathematics'],
    advisor: 'Dr. Evelyn Vance'
  },
  {
    id: 'STD-2024-002',
    name: 'Priya Sharma',
    year: 3,
    course: 'Data Science',
    section: 'B',
    attendance: '91%',
    gpa: 3.92,
    enrolledSubjects: ['Machine Learning', 'Big Data Analytics', 'Applied Statistics', 'Cloud Computing'],
    advisor: 'Prof. Alan Turing'
  },
  {
    id: 'STD-2024-003',
    name: 'Alex Rivera',
    year: 1,
    course: 'Software Engineering',
    section: 'C',
    attendance: '72%',
    gpa: 3.40,
    enrolledSubjects: ['Introduction to Programming', 'Linear Algebra', 'Computer Architecture', 'Technical Writing'],
    advisor: 'Dr. Sarah Connor'
  },
  {
    id: 'STD-2024-004',
    name: 'Sneha Patel',
    year: 4,
    course: 'Artificial Intelligence',
    section: 'A',
    attendance: '95%',
    gpa: 3.98,
    enrolledSubjects: ['Deep Learning', 'Reinforcement Learning', 'Natural Language Processing', 'AI Ethics'],
    advisor: 'Dr. Geoffrey Hinton'
  }
];

export function findStudentInRegistry(studentName: string): StudentRegistryRecord | null {
  if (!studentName) return null;
  const clean = studentName.trim().toLowerCase();
  const found = UNIVERSITY_REGISTRY.find(
    s => s.name.toLowerCase() === clean || s.name.toLowerCase().includes(clean)
  );
  return found || null;
}
