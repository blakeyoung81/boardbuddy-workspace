/**
 * Step 1 Crash Course Data
 * Predefined study plans for intensive Step 1 preparation
 */

export interface CrashCourseDay {
  day: number;
  title: string;
  focus: string;
  systems: string[];
  subjects: string[];
  resources: string[];
  studyHours: number;
  videoLessons?: Array<{
    id: string;
    title: string;
    topic: string;
    duration?: string;
    description?: string;
  }>;
  schedule: Array<{
    time: string;
    duration: number; // minutes
    activity: string;
    resource?: string;
    description?: string;
    videoLessonId?: string; // Link to video lesson if applicable
  }>;
  practiceQuestions: {
    count: number;
    focus: string[];
    difficulty: 'mixed' | 'easy' | 'medium' | 'hard';
  };
  keyPoints: string[];
}

export interface CrashCourseWeek {
  week: number;
  title: string;
  focus: string;
  systems: string[];
  subjects: string[];
  resources: string[];
  studyHoursPerDay: number;
  videoLessons?: Array<{
    id: string;
    title: string;
    topic: string;
    duration?: string;
    description?: string;
  }>;
  dailySchedule: Array<{
    time: string;
    duration: number; // minutes
    activity: string;
    resource?: string;
    description?: string;
    videoLessonId?: string;
  }>;
  practiceQuestions: {
    countPerDay: number;
    focus: string[];
    difficulty: 'mixed' | 'easy' | 'medium' | 'hard';
  };
  weeklyGoals: string[];
  keyTopics: string[];
}

export interface CrashCourse {
  id: string;
  title: string;
  duration: string;
  description: string;
  targetAudience: string;
  prerequisites: string[];
  totalStudyHours: number;
  difficulty: 'intensive' | 'moderate' | 'comprehensive';
  resources: string[];
  dailyPlan?: CrashCourseDay[];
  weeklyPlan?: CrashCourseWeek[];
  tips: string[];
  warnings: string[];
  videoLessons?: Array<{
    id: string;
    title: string;
    topic: string;
    day?: number;
    duration?: string;
    description?: string;
  }>;
}

// 7-Day Intensive Crash Course - Updated with Video Lessons
export const sevenDayCrashCourse: CrashCourse = {
  id: '7-day-crash',
  title: '7-Day Step 1 Intensive Crash Course',
  duration: '7 days',
  description: 'An intensive 7-day review covering all major systems with expert video lessons, comprehensive study plans, and practice questions. Includes access to 19 video lessons covering Biochemistry, Cardiology, Respiratory, Pharmacology, and more.',
  targetAudience: 'Students 1 week before exam with solid foundation',
  prerequisites: [
    'Completed First Aid at least once',
    'Basic understanding of all major systems',
    'Previous question bank experience',
    '8-10 hours daily availability'
  ],
  totalStudyHours: 56,
  difficulty: 'intensive',
  resources: ['Video Lessons', 'First Aid', 'UWorld', 'Pathoma', 'Sketchy Medical', 'Anki'],
  videoLessons: [
    { id: 'biochemistry', title: 'Biochemistry', topic: 'Biochemistry', day: 1, description: 'Comprehensive biochemistry review' },
    { id: 'cardiology', title: 'Cardiology', topic: 'Cardiology', day: 1, description: 'Cardiovascular system deep dive' },
    { id: 'respiratory', title: 'Respiratory/Pulmonology', topic: 'Respiratory/Pulmonology', day: 1, description: 'Pulmonary system review' },
    { id: 'renal', title: 'Renal', topic: 'Renal', day: 2, description: 'Renal and urinary systems' },
    { id: 'gastroenterology', title: 'Gastroenterology', topic: 'Gastroenterology', day: 2, description: 'GI system comprehensive review' },
    { id: 'endocrine', title: 'Endocrine', topic: 'Endocrine', day: 3, description: 'Endocrine system and metabolism' },
    { id: 'neurology', title: 'Neurology', topic: 'Neurology', day: 3, description: 'Nervous system review' },
    { id: 'musculoskeletal', title: 'Musculoskeletal', topic: 'Musculoskeletal', day: 4, description: 'MSK system review' },
    { id: 'msk-derm', title: 'MSK/Dermatology', topic: 'MSK/Dermatology', day: 4, description: 'Musculoskeletal and dermatology' },
    { id: 'hematology-oncology', title: 'Hematology/Oncology', topic: 'Hematology/Oncology', day: 4, description: 'Blood disorders and oncology' },
    { id: 'microbiology', title: 'Microbiology', topic: 'Microbiology', day: 5, description: 'Infectious diseases and microbiology' },
    { id: 'immunology', title: 'Immunology', topic: 'Immunology', day: 5, description: 'Immune system review' },
    { id: 'general-pathology', title: 'General Pathology', topic: 'General Pathology', day: 5, description: 'Foundational pathology concepts' },
    { id: 'pharmacology', title: 'Pharmacology', topic: 'Pharmacology', day: 5, description: 'Comprehensive pharmacology review' },
    { id: 'reproductive', title: 'Reproductive', topic: 'Reproductive', day: 6, description: 'Reproductive system review' },
    { id: 'psychiatry', title: 'Psychiatry', topic: 'Psychiatry', day: 6, description: 'Psychiatric disorders and treatment' },
    { id: 'biostatistics', title: 'Biostatistics', topic: 'Biostatistics', day: 6, description: 'Statistics and research methods' },
    { id: 'ethics', title: 'Ethics', topic: 'Ethics', day: 6, description: 'Medical ethics and professionalism' },
  ],
  dailyPlan: [
    {
      day: 1,
      title: 'Cardiovascular, Respiratory & Biochemistry',
      focus: 'High-yield cardiovascular, pulmonary, and biochemistry fundamentals',
      systems: ['Cardiovascular System', 'Pulmonary & Critical Care', 'Biochemistry'],
      subjects: ['Pathology', 'Physiology', 'Pharmacology', 'Biochemistry'],
      resources: ['Video Lessons', 'First Aid', 'UWorld', 'Pathoma'],
      studyHours: 8,
      videoLessons: [
        { id: 'biochemistry', title: 'Biochemistry', topic: 'Biochemistry' },
        { id: 'cardiology', title: 'Cardiology', topic: 'Cardiology' },
        { id: 'respiratory', title: 'Respiratory/Pulmonology', topic: 'Respiratory/Pulmonology' },
      ],
      schedule: [
        { time: '08:00', duration: 90, activity: 'Video Lesson: Biochemistry', resource: 'Video Lessons', description: 'Watch Biochemistry video lesson', videoLessonId: 'biochemistry' },
        { time: '09:45', duration: 15, activity: 'Break' },
        { time: '10:00', duration: 90, activity: 'Video Lesson: Cardiology', resource: 'Video Lessons', description: 'Watch Cardiology video lesson', videoLessonId: 'cardiology' },
        { time: '11:45', duration: 60, activity: 'Lunch Break' },
        { time: '13:00', duration: 90, activity: 'Video Lesson: Respiratory/Pulmonology', resource: 'Video Lessons', description: 'Watch Respiratory/Pulmonology video lesson', videoLessonId: 'respiratory' },
        { time: '14:45', duration: 15, activity: 'Break' },
        { time: '15:00', duration: 90, activity: 'UWorld Questions', resource: 'UWorld', description: 'Cardiovascular & Respiratory - 50 questions' },
        { time: '16:45', duration: 15, activity: 'Break' },
        { time: '17:00', duration: 60, activity: 'First Aid Review', resource: 'First Aid', description: 'Cardiovascular, Respiratory & Biochemistry chapters' },
        { time: '18:00', duration: 30, activity: 'Anki Review', resource: 'Anki', description: 'Day 1 topics' }
      ],
      practiceQuestions: {
        count: 50,
        focus: ['Cardiovascular', 'Respiratory', 'Biochemistry'],
        difficulty: 'mixed'
      },
      keyPoints: [
        'Heart failure pathophysiology and treatment',
        'Arrhythmias and EKG interpretation',
        'Pneumonia vs. other lung diseases',
        'COPD and asthma management',
        'Essential biochemistry pathways'
      ]
    },
    {
      day: 2,
      title: 'Gastrointestinal & Renal Systems',
      focus: 'GI pathology and renal physiology',
      systems: ['Gastrointestinal & Nutrition', 'Renal, Urinary Systems & Electrolytes'],
      subjects: ['Pathology', 'Physiology', 'Pharmacology'],
      resources: ['Video Lessons', 'First Aid', 'UWorld', 'Pathoma'],
      studyHours: 8,
      videoLessons: [
        { id: 'renal', title: 'Renal', topic: 'Renal' },
        { id: 'gastroenterology', title: 'Gastroenterology', topic: 'Gastroenterology' },
      ],
      schedule: [
        { time: '08:00', duration: 90, activity: 'Video Lesson: Renal', resource: 'Video Lessons', description: 'Watch Renal video lesson', videoLessonId: 'renal' },
        { time: '09:45', duration: 15, activity: 'Break' },
        { time: '10:00', duration: 90, activity: 'Video Lesson: Gastroenterology', resource: 'Video Lessons', description: 'Watch Gastroenterology video lesson', videoLessonId: 'gastroenterology' },
        { time: '11:45', duration: 60, activity: 'Lunch Break' },
        { time: '13:00', duration: 90, activity: 'UWorld Questions', resource: 'UWorld', description: 'GI & Renal - 50 questions' },
        { time: '14:45', duration: 15, activity: 'Break' },
        { time: '15:00', duration: 90, activity: 'First Aid Review', resource: 'First Aid', description: 'GI and Renal chapters' },
        { time: '16:45', duration: 15, activity: 'Break' },
        { time: '17:00', duration: 60, activity: 'Pathoma Videos', resource: 'Pathoma', description: 'GI and Renal pathology' },
        { time: '18:00', duration: 30, activity: 'Anki Review', resource: 'Anki', description: 'GI and Renal cards' }
      ],
      practiceQuestions: {
        count: 50,
        focus: ['Gastrointestinal', 'Renal'],
        difficulty: 'mixed'
      },
      keyPoints: [
        'IBD vs. IBS differentiation',
        'Liver function tests and hepatitis',
        'Acute kidney injury causes',
        'Electrolyte imbalances',
        'Nephrotic vs. nephritic syndromes'
      ]
    },
    {
      day: 3,
      title: 'Endocrine & Nervous Systems',
      focus: 'Endocrine disorders and neuropathology',
      systems: ['Endocrine, Diabetes & Metabolism', 'Nervous System'],
      subjects: ['Pathology', 'Physiology', 'Pharmacology'],
      resources: ['Video Lessons', 'First Aid', 'UWorld', 'Pathoma'],
      studyHours: 8,
      videoLessons: [
        { id: 'endocrine', title: 'Endocrine', topic: 'Endocrine' },
        { id: 'neurology', title: 'Neurology', topic: 'Neurology' },
      ],
      schedule: [
        { time: '08:00', duration: 90, activity: 'Video Lesson: Endocrine', resource: 'Video Lessons', description: 'Watch Endocrine video lesson', videoLessonId: 'endocrine' },
        { time: '09:45', duration: 15, activity: 'Break' },
        { time: '10:00', duration: 90, activity: 'Video Lesson: Neurology', resource: 'Video Lessons', description: 'Watch Neurology video lesson', videoLessonId: 'neurology' },
        { time: '11:45', duration: 60, activity: 'Lunch Break' },
        { time: '13:00', duration: 90, activity: 'UWorld Questions', resource: 'UWorld', description: 'Endocrine & Neurology - 50 questions' },
        { time: '14:45', duration: 15, activity: 'Break' },
        { time: '15:00', duration: 90, activity: 'First Aid Review', resource: 'First Aid', description: 'Endocrine and Neurology chapters' },
        { time: '16:45', duration: 15, activity: 'Break' },
        { time: '17:00', duration: 60, activity: 'Pathoma Videos', resource: 'Pathoma', description: 'Endocrine and Neuro pathology' },
        { time: '18:00', duration: 30, activity: 'Anki Review', resource: 'Anki', description: 'Endocrine and Neuro cards' }
      ],
      practiceQuestions: {
        count: 50,
        focus: ['Endocrine', 'Neurology'],
        difficulty: 'mixed'
      },
      keyPoints: [
        'Diabetes pathophysiology and complications',
        'Thyroid disorders',
        'Stroke types and localization',
        'Seizure disorders',
        'Neurodegenerative diseases'
      ]
    },
    {
      day: 4,
      title: 'Musculoskeletal, Dermatology & Hematology/Oncology',
      focus: 'MSK, skin, and blood disorders',
      systems: ['Musculoskeletal System', 'Dermatology', 'Hematology & Oncology'],
      subjects: ['Pathology', 'Physiology', 'Pharmacology'],
      resources: ['Video Lessons', 'First Aid', 'UWorld', 'Pathoma'],
      studyHours: 8,
      videoLessons: [
        { id: 'musculoskeletal', title: 'Musculoskeletal', topic: 'Musculoskeletal' },
        { id: 'msk-derm', title: 'MSK/Dermatology', topic: 'MSK/Dermatology' },
        { id: 'hematology-oncology', title: 'Hematology/Oncology', topic: 'Hematology/Oncology' },
      ],
      schedule: [
        { time: '08:00', duration: 90, activity: 'Video Lesson: Musculoskeletal', resource: 'Video Lessons', description: 'Watch Musculoskeletal video lesson', videoLessonId: 'musculoskeletal' },
        { time: '09:45', duration: 15, activity: 'Break' },
        { time: '10:00', duration: 60, activity: 'Video Lesson: MSK/Dermatology', resource: 'Video Lessons', description: 'Watch MSK/Dermatology video lesson', videoLessonId: 'msk-derm' },
        { time: '11:00', duration: 45, activity: 'Video Lesson: Hematology/Oncology', resource: 'Video Lessons', description: 'Watch Hematology/Oncology video lesson', videoLessonId: 'hematology-oncology' },
        { time: '11:45', duration: 60, activity: 'Lunch Break' },
        { time: '13:00', duration: 90, activity: 'UWorld Questions', resource: 'UWorld', description: 'MSK, Derm & Heme/Onc - 50 questions' },
        { time: '14:45', duration: 15, activity: 'Break' },
        { time: '15:00', duration: 90, activity: 'First Aid Review', resource: 'First Aid', description: 'MSK, Derm & Heme/Onc chapters' },
        { time: '16:45', duration: 15, activity: 'Break' },
        { time: '17:00', duration: 60, activity: 'Pathoma Videos', resource: 'Pathoma', description: 'MSK and Heme pathology' },
        { time: '18:00', duration: 30, activity: 'Anki Review', resource: 'Anki', description: 'Day 4 topics' }
      ],
      practiceQuestions: {
        count: 50,
        focus: ['Musculoskeletal', 'Dermatology', 'Hematology', 'Oncology'],
        difficulty: 'mixed'
      },
      keyPoints: [
        'Rheumatoid arthritis vs. osteoarthritis',
        'Bone disorders and fractures',
        'Anemias and bleeding disorders',
        'Oncologic emergencies',
        'Common skin conditions'
      ]
    },
    {
      day: 5,
      title: 'Microbiology, Immunology, Pathology & Pharmacology',
      focus: 'Infectious diseases, immune system, pathology fundamentals, and pharmacology',
      systems: ['Infectious Diseases', 'Immunology', 'General Pathology', 'Pharmacology'],
      subjects: ['Pathology', 'Microbiology', 'Immunology', 'Pharmacology'],
      resources: ['Video Lessons', 'First Aid', 'UWorld', 'Sketchy Medical'],
      studyHours: 8,
      videoLessons: [
        { id: 'microbiology', title: 'Microbiology', topic: 'Microbiology' },
        { id: 'immunology', title: 'Immunology', topic: 'Immunology' },
        { id: 'general-pathology', title: 'General Pathology', topic: 'General Pathology' },
        { id: 'pharmacology', title: 'Pharmacology', topic: 'Pharmacology' },
      ],
      schedule: [
        { time: '08:00', duration: 90, activity: 'Video Lesson: Microbiology', resource: 'Video Lessons', description: 'Watch Microbiology video lesson', videoLessonId: 'microbiology' },
        { time: '09:45', duration: 15, activity: 'Break' },
        { time: '10:00', duration: 90, activity: 'Video Lesson: Immunology', resource: 'Video Lessons', description: 'Watch Immunology video lesson', videoLessonId: 'immunology' },
        { time: '11:45', duration: 60, activity: 'Lunch Break' },
        { time: '13:00', duration: 90, activity: 'Video Lesson: General Pathology', resource: 'Video Lessons', description: 'Watch General Pathology video lesson', videoLessonId: 'general-pathology' },
        { time: '14:45', duration: 15, activity: 'Break' },
        { time: '15:00', duration: 90, activity: 'Video Lesson: Pharmacology', resource: 'Video Lessons', description: 'Watch Pharmacology video lesson', videoLessonId: 'pharmacology' },
        { time: '16:45', duration: 15, activity: 'Break' },
        { time: '17:00', duration: 60, activity: 'UWorld Questions', resource: 'UWorld', description: 'Microbiology, Immunology & Pharmacology - 40 questions' },
        { time: '18:00', duration: 30, activity: 'Sketchy Medical Review', resource: 'Sketchy Medical', description: 'Microbiology and Pharmacology' }
      ],
      practiceQuestions: {
        count: 40,
        focus: ['Microbiology', 'Immunology', 'Pharmacology'],
        difficulty: 'mixed'
      },
      keyPoints: [
        'High-yield pathogens and treatments',
        'Immune system disorders',
        'Pathology fundamentals',
        'Pharmacokinetics and pharmacodynamics',
        'Drug interactions and side effects'
      ]
    },
    {
      day: 6,
      title: 'Reproductive, Psychiatry, Biostatistics & Ethics',
      focus: 'Reproductive health, mental health, statistics, and medical ethics',
      systems: ['Reproductive System', 'Psychiatry', 'Biostatistics', 'Ethics'],
      subjects: ['Pathology', 'Physiology', 'Pharmacology', 'Biostatistics', 'Ethics'],
      resources: ['Video Lessons', 'First Aid', 'UWorld'],
      studyHours: 8,
      videoLessons: [
        { id: 'reproductive', title: 'Reproductive', topic: 'Reproductive' },
        { id: 'psychiatry', title: 'Psychiatry', topic: 'Psychiatry' },
        { id: 'biostatistics', title: 'Biostatistics', topic: 'Biostatistics' },
        { id: 'ethics', title: 'Ethics', topic: 'Ethics' },
      ],
      schedule: [
        { time: '08:00', duration: 90, activity: 'Video Lesson: Reproductive', resource: 'Video Lessons', description: 'Watch Reproductive video lesson', videoLessonId: 'reproductive' },
        { time: '09:45', duration: 15, activity: 'Break' },
        { time: '10:00', duration: 90, activity: 'Video Lesson: Psychiatry', resource: 'Video Lessons', description: 'Watch Psychiatry video lesson', videoLessonId: 'psychiatry' },
        { time: '11:45', duration: 60, activity: 'Lunch Break' },
        { time: '13:00', duration: 90, activity: 'Video Lesson: Biostatistics', resource: 'Video Lessons', description: 'Watch Biostatistics video lesson', videoLessonId: 'biostatistics' },
        { time: '14:45', duration: 15, activity: 'Break' },
        { time: '15:00', duration: 60, activity: 'Video Lesson: Ethics', resource: 'Video Lessons', description: 'Watch Ethics video lesson', videoLessonId: 'ethics' },
        { time: '16:00', duration: 90, activity: 'UWorld Questions', resource: 'UWorld', description: 'Reproductive, Psychiatry & Mixed - 50 questions' },
        { time: '17:45', duration: 15, activity: 'Break' },
        { time: '18:00', duration: 60, activity: 'First Aid Review', resource: 'First Aid', description: 'Day 6 topics review' }
      ],
      practiceQuestions: {
        count: 50,
        focus: ['Reproductive', 'Psychiatry', 'Biostatistics', 'Ethics'],
        difficulty: 'mixed'
      },
      keyPoints: [
        'Menstrual cycle and reproductive hormones',
        'Pregnancy complications',
        'Psychiatric disorders and medications',
        'Statistical concepts and study design',
        'Medical ethics principles'
      ]
    },
    {
      day: 7,
      title: 'Final Review & Practice Test',
      focus: 'Comprehensive review and full-length practice test',
      systems: ['All Systems'],
      subjects: ['All Subjects'],
      resources: ['Video Lessons Review', 'First Aid', 'UWorld', 'NBME Practice Test'],
      studyHours: 8,
      schedule: [
        { time: '08:00', duration: 120, activity: 'Video Lessons Review', resource: 'Video Lessons', description: 'Review key video lessons (pick 2-3 weakest areas)' },
        { time: '10:15', duration: 15, activity: 'Break' },
        { time: '10:30', duration: 240, activity: 'Full-Length Practice Test', resource: 'NBME', description: 'Complete 200-question practice test' },
        { time: '14:30', duration: 60, activity: 'Lunch Break' },
        { time: '15:30', duration: 120, activity: 'Review Practice Test', resource: 'NBME', description: 'Go through all incorrect answers' },
        { time: '17:30', duration: 15, activity: 'Break' },
        { time: '17:45', duration: 75, activity: 'Final First Aid Review', resource: 'First Aid', description: 'Quick review of high-yield facts' },
        { time: '19:00', duration: 60, activity: 'Relaxation & Mental Prep', resource: 'Self-Care', description: 'Prepare for exam day' }
      ],
      practiceQuestions: {
        count: 200,
        focus: ['All Topics'],
        difficulty: 'mixed'
      },
      keyPoints: [
        'Comprehensive review of all systems',
        'Practice test timing and strategy',
        'Review weak areas',
        'Mental preparation for exam day',
        'Final high-yield facts review'
      ]
    }
  ],
  tips: [
    'Watch all video lessons actively - take notes and pause when needed',
    'Complete practice questions immediately after watching videos',
    'Review First Aid chapters related to each day\'s topics',
    'Use Anki daily to reinforce key concepts',
    'Take breaks every 90 minutes to maintain focus',
    'Stay hydrated and get adequate sleep',
    'Focus on understanding, not just memorization',
    'Review incorrect questions thoroughly',
    'Keep a study log of difficult concepts',
    'Practice time management during question blocks'
  ],
  warnings: [
    'This is an intensive course - ensure you have 8+ hours daily',
    'Do not skip video lessons - they are essential',
    'Focus on high-yield topics in each video',
    'Take practice tests under timed conditions',
    'Maintain a consistent sleep schedule',
    'If falling behind, prioritize video lessons over additional practice questions'
  ]
};

// 6-Week Comprehensive Crash Course
export const sixWeekCrashCourse: CrashCourse = {
  id: '6-week-crash',
  title: '6-Week Step 1 Comprehensive Crash Course',
  duration: '6 weeks',
  description: 'A comprehensive 6-week study plan designed for students with 6 weeks before their exam. Covers all systems thoroughly with 6-8 hours of daily study.',
  targetAudience: 'Students 6 weeks before exam with basic foundation',
  prerequisites: [
    'Completed basic science coursework',
    'Some question bank experience',
    '6-8 hours daily availability',
    'Motivation for intensive study'
  ],
  totalStudyHours: 252,
  difficulty: 'comprehensive',
  resources: ['First Aid', 'UWorld', 'Pathoma', 'Sketchy Medical', 'Anki', 'Boards and Beyond'],
  weeklyPlan: [
    {
      week: 1,
      title: 'Cardiovascular & Respiratory Systems',
      focus: 'Master cardiovascular and pulmonary systems',
      systems: ['Cardiovascular System', 'Pulmonary & Critical Care'],
      subjects: ['Pathology', 'Physiology', 'Pharmacology', 'Anatomy'],
      resources: ['First Aid', 'UWorld', 'Pathoma', 'Boards and Beyond'],
      studyHoursPerDay: 6,
      dailySchedule: [
        { time: '08:00', duration: 90, activity: 'UWorld Questions', resource: 'UWorld', description: 'System-specific questions' },
        { time: '09:45', duration: 15, activity: 'Break' },
        { time: '10:00', duration: 90, activity: 'First Aid Review', resource: 'First Aid', description: 'System chapters' },
        { time: '11:45', duration: 60, activity: 'Lunch Break' },
        { time: '13:00', duration: 90, activity: 'Pathoma Videos', resource: 'Pathoma', description: 'System pathology' },
        { time: '14:45', duration: 15, activity: 'Break' },
        { time: '15:00', duration: 90, activity: 'Boards and Beyond', resource: 'Boards and Beyond', description: 'System review' },
        { time: '16:45', duration: 15, activity: 'Break' },
        { time: '17:00', duration: 60, activity: 'Anki Review', resource: 'Anki', description: 'System cards' }
      ],
      practiceQuestions: {
        countPerDay: 40,
        focus: ['Cardiovascular', 'Pulmonary'],
        difficulty: 'mixed'
      },
      weeklyGoals: [
        'Complete 200+ questions on cardiovascular system',
        'Complete 200+ questions on respiratory system',
        'Review all First Aid chapters for both systems',
        'Master high-yield pathology concepts'
      ],
      keyTopics: [
        'Heart failure',
        'Arrhythmias',
        'Valvular disease',
        'Pneumonia',
        'COPD',
        'Asthma'
      ]
    },
    {
      week: 2,
      title: 'Gastrointestinal & Renal Systems',
      focus: 'Master GI and renal systems',
      systems: ['Gastrointestinal & Nutrition', 'Renal, Urinary Systems & Electrolytes'],
      subjects: ['Pathology', 'Physiology', 'Pharmacology'],
      resources: ['First Aid', 'UWorld', 'Pathoma', 'Boards and Beyond'],
      studyHoursPerDay: 6,
      dailySchedule: [
        { time: '08:00', duration: 90, activity: 'UWorld Questions', resource: 'UWorld', description: 'System-specific questions' },
        { time: '09:45', duration: 15, activity: 'Break' },
        { time: '10:00', duration: 90, activity: 'First Aid Review', resource: 'First Aid', description: 'System chapters' },
        { time: '11:45', duration: 60, activity: 'Lunch Break' },
        { time: '13:00', duration: 90, activity: 'Pathoma Videos', resource: 'Pathoma', description: 'System pathology' },
        { time: '14:45', duration: 15, activity: 'Break' },
        { time: '15:00', duration: 90, activity: 'Boards and Beyond', resource: 'Boards and Beyond', description: 'System review' },
        { time: '16:45', duration: 15, activity: 'Break' },
        { time: '17:00', duration: 60, activity: 'Anki Review', resource: 'Anki', description: 'System cards' }
      ],
      practiceQuestions: {
        countPerDay: 40,
        focus: ['Gastrointestinal', 'Renal'],
        difficulty: 'mixed'
      },
      weeklyGoals: [
        'Complete 200+ questions on GI system',
        'Complete 200+ questions on renal system',
        'Review all First Aid chapters for both systems',
        'Master electrolyte imbalances'
      ],
      keyTopics: [
        'IBD vs IBS',
        'Liver disease',
        'Acute kidney injury',
        'Nephrotic vs nephritic',
        'Electrolyte disorders'
      ]
    },
    {
      week: 3,
      title: 'Endocrine & Nervous Systems',
      focus: 'Master endocrine and nervous systems',
      systems: ['Endocrine, Diabetes & Metabolism', 'Nervous System'],
      subjects: ['Pathology', 'Physiology', 'Pharmacology'],
      resources: ['First Aid', 'UWorld', 'Pathoma', 'Boards and Beyond'],
      studyHoursPerDay: 6,
      dailySchedule: [
        { time: '08:00', duration: 90, activity: 'UWorld Questions', resource: 'UWorld', description: 'System-specific questions' },
        { time: '09:45', duration: 15, activity: 'Break' },
        { time: '10:00', duration: 90, activity: 'First Aid Review', resource: 'First Aid', description: 'System chapters' },
        { time: '11:45', duration: 60, activity: 'Lunch Break' },
        { time: '13:00', duration: 90, activity: 'Pathoma Videos', resource: 'Pathoma', description: 'System pathology' },
        { time: '14:45', duration: 15, activity: 'Break' },
        { time: '15:00', duration: 90, activity: 'Boards and Beyond', resource: 'Boards and Beyond', description: 'System review' },
        { time: '16:45', duration: 15, activity: 'Break' },
        { time: '17:00', duration: 60, activity: 'Anki Review', resource: 'Anki', description: 'System cards' }
      ],
      practiceQuestions: {
        countPerDay: 40,
        focus: ['Endocrine', 'Neurology'],
        difficulty: 'mixed'
      },
      weeklyGoals: [
        'Complete 200+ questions on endocrine system',
        'Complete 200+ questions on nervous system',
        'Review all First Aid chapters for both systems',
        'Master localization patterns'
      ],
      keyTopics: [
        'Diabetes',
        'Thyroid disorders',
        'Stroke',
        'Seizures',
        'Neurodegenerative diseases'
      ]
    },
    {
      week: 4,
      title: 'Hematology, Oncology & Infectious Diseases',
      focus: 'Master blood disorders, cancer, and infectious diseases',
      systems: ['Hematology & Oncology', 'Infectious Diseases'],
      subjects: ['Pathology', 'Microbiology', 'Pharmacology'],
      resources: ['First Aid', 'UWorld', 'Sketchy Medical', 'Pathoma'],
      studyHoursPerDay: 6,
      dailySchedule: [
        { time: '08:00', duration: 90, activity: 'UWorld Questions', resource: 'UWorld', description: 'System-specific questions' },
        { time: '09:45', duration: 15, activity: 'Break' },
        { time: '10:00', duration: 90, activity: 'Sketchy Medical', resource: 'Sketchy Medical', description: 'Microbiology videos' },
        { time: '11:45', duration: 60, activity: 'Lunch Break' },
        { time: '13:00', duration: 90, activity: 'First Aid Review', resource: 'First Aid', description: 'System chapters' },
        { time: '14:45', duration: 15, activity: 'Break' },
        { time: '15:00', duration: 90, activity: 'Pathoma Videos', resource: 'Pathoma', description: 'System pathology' },
        { time: '16:45', duration: 15, activity: 'Break' },
        { time: '17:00', duration: 60, activity: 'Anki Review', resource: 'Anki', description: 'System cards' }
      ],
      practiceQuestions: {
        countPerDay: 40,
        focus: ['Hematology', 'Oncology', 'Microbiology'],
        difficulty: 'mixed'
      },
      weeklyGoals: [
        'Complete 200+ questions on hematology',
        'Complete 200+ questions on microbiology',
        'Review all Sketchy Medical videos',
        'Master high-yield pathogens'
      ],
      keyTopics: [
        'Anemias',
        'Bleeding disorders',
        'Oncologic emergencies',
        'High-yield pathogens',
        'Antibiotics'
      ]
    },
    {
      week: 5,
      title: 'Pathology, Pharmacology & Biochemistry',
      focus: 'Master foundational sciences',
      systems: ['General Pathology', 'Pharmacology', 'Biochemistry'],
      subjects: ['Pathology', 'Pharmacology', 'Biochemistry'],
      resources: ['First Aid', 'UWorld', 'Pathoma', 'Sketchy Medical'],
      studyHoursPerDay: 6,
      dailySchedule: [
        { time: '08:00', duration: 90, activity: 'UWorld Questions', resource: 'UWorld', description: 'System-specific questions' },
        { time: '09:45', duration: 15, activity: 'Break' },
        { time: '10:00', duration: 90, activity: 'First Aid Review', resource: 'First Aid', description: 'System chapters' },
        { time: '11:45', duration: 60, activity: 'Lunch Break' },
        { time: '13:00', duration: 90, activity: 'Pathoma Videos', resource: 'Pathoma', description: 'Pathology review' },
        { time: '14:45', duration: 15, activity: 'Break' },
        { time: '15:00', duration: 90, activity: 'Sketchy Medical', resource: 'Sketchy Medical', description: 'Pharmacology videos' },
        { time: '16:45', duration: 15, activity: 'Break' },
        { time: '17:00', duration: 60, activity: 'Anki Review', resource: 'Anki', description: 'System cards' }
      ],
      practiceQuestions: {
        countPerDay: 40,
        focus: ['Pathology', 'Pharmacology', 'Biochemistry'],
        difficulty: 'mixed'
      },
      weeklyGoals: [
        'Complete 200+ questions on pathology',
        'Complete 200+ questions on pharmacology',
        'Review all biochemistry pathways',
        'Master drug mechanisms'
      ],
      keyTopics: [
        'Pathology fundamentals',
        'Pharmacokinetics',
        'Pharmacodynamics',
        'Biochemistry pathways',
        'Enzyme kinetics'
      ]
    },
    {
      week: 6,
      title: 'Final Review & Practice Tests',
      focus: 'Comprehensive review and multiple practice tests',
      systems: ['All Systems'],
      subjects: ['All Subjects'],
      resources: ['First Aid', 'UWorld', 'NBME Practice Tests'],
      studyHoursPerDay: 8,
      dailySchedule: [
        { time: '08:00', duration: 240, activity: 'Full-Length Practice Test', resource: 'NBME', description: '200-question practice test' },
        { time: '12:15', duration: 60, activity: 'Lunch Break' },
        { time: '13:15', duration: 120, activity: 'Review Practice Test', resource: 'NBME', description: 'Go through all incorrect answers' },
        { time: '15:30', duration: 15, activity: 'Break' },
        { time: '15:45', duration: 90, activity: 'First Aid Rapid Review', resource: 'First Aid', description: 'High-yield facts' },
        { time: '17:30', duration: 15, activity: 'Break' },
        { time: '17:45', duration: 75, activity: 'Weak Areas Review', resource: 'UWorld', description: 'Focus on weak topics' }
      ],
      practiceQuestions: {
        countPerDay: 200,
        focus: ['All Topics'],
        difficulty: 'mixed'
      },
      weeklyGoals: [
        'Complete 3+ full-length practice tests',
        'Review all incorrect answers thoroughly',
        'Identify and strengthen weak areas',
        'Master timing and test-taking strategy'
      ],
      keyTopics: [
        'All high-yield topics',
        'Test-taking strategies',
        'Time management',
        'Weak area identification'
      ]
    }
  ],
  tips: [
    'Stick to the daily schedule consistently',
    'Complete all practice questions',
    'Review First Aid chapters multiple times',
    'Use Anki daily for spaced repetition',
    'Take breaks to avoid burnout',
    'Focus on understanding concepts, not just memorization',
    'Track your progress weekly',
    'Review incorrect questions thoroughly',
    'Practice time management',
    'Maintain a healthy lifestyle'
  ],
  warnings: [
    'This is a comprehensive course - requires dedication',
    'Do not skip practice questions',
    'Stay consistent with daily study hours',
    'Take practice tests under timed conditions',
    'Avoid cramming - spaced repetition is key',
    'Maintain work-life balance to prevent burnout'
  ]
};

// The Match Guy - Research Course
export const researchCourse: CrashCourse = {
  id: 'research-course',
  title: 'Research Course',
  duration: '14hr 33m',
  description: 'This in-depth course will teach you how to take a research project from idea to publication.',
  targetAudience: 'Medical students and doctors interested in research',
  prerequisites: [
    'Basic understanding of research methodology',
    'Interest in conducting research projects'
  ],
  totalStudyHours: 14.5,
  difficulty: 'moderate',
  resources: ['Video Lessons', 'Research Templates', 'Publication Guides'],
  tips: [
    'Follow the structured approach from idea to publication',
    'Take notes during video lessons',
    'Use provided templates for your research projects',
    'Review examples of successful publications'
  ],
  warnings: [
    'This course requires active participation',
    'Complete all lessons in order for best results'
  ]
};

// The Match Guy - How to Study for Exams
export const howToStudyForExams: CrashCourse = {
  id: 'how-to-study-exams',
  title: 'How to Study for Exams',
  duration: '3hr 11m',
  description: 'This course will teach you study techniques that will boost your performance on exams!',
  targetAudience: 'Medical students preparing for exams',
  prerequisites: [
    'Willingness to learn new study techniques',
    'Basic study experience'
  ],
  totalStudyHours: 3.2,
  difficulty: 'moderate',
  resources: ['Video Lessons', 'Study Guides', 'Technique Templates'],
  tips: [
    'Practice the techniques as you learn them',
    'Adapt techniques to your learning style',
    'Review the course before major exams'
  ],
  warnings: [
    'Consistent practice is key to success',
    'Not all techniques work for everyone - find what works for you'
  ]
};

// The Match Guy - How to Find Research Positions
export const findResearchPositions: CrashCourse = {
  id: 'find-research-positions',
  title: 'How to Find Research Positions',
  duration: '3hr 00m',
  description: 'This course will demonstrate how to find research positions in the US!',
  targetAudience: 'Medical students seeking research opportunities',
  prerequisites: [
    'Interest in research',
    'Basic understanding of research types'
  ],
  totalStudyHours: 3,
  difficulty: 'moderate',
  resources: ['Live Sessions', 'Position Search Guides', 'Application Templates'],
  tips: [
    'Attend live sessions for Q&A',
    'Use provided templates for applications',
    'Network actively during the course'
  ],
  warnings: [
    'Research positions are competitive',
    'Start searching early'
  ]
};

// The Match Guy - USMLE Biostatistics
export const usmleBiostatistics: CrashCourse = {
  id: 'usmle-biostatistics',
  title: 'USMLE Biostatistics',
  duration: '12hr 33m',
  description: 'This course will teach you the high yield biostatistical concepts.',
  targetAudience: 'Medical students preparing for USMLE exams',
  prerequisites: [
    'Basic math skills',
    'USMLE preparation in progress'
  ],
  totalStudyHours: 12.5,
  difficulty: 'moderate',
  resources: ['Video Lessons', 'Practice Problems', 'Formula Sheets'],
  tips: [
    'Practice problems regularly',
    'Memorize key formulas',
    'Focus on high-yield concepts',
    'Review before exam day'
  ],
  warnings: [
    'Biostatistics requires consistent practice',
    'Don\'t skip practice problems'
  ]
};

// The Match Guy - Medical Statistics
export const medicalStatistics: CrashCourse = {
  id: 'medical-statistics',
  title: 'Medical Statistics',
  duration: '12hr 33m',
  description: 'This course will show you how to independently do your own statistical analysis for research projects',
  targetAudience: 'Medical students and doctors conducting research',
  prerequisites: [
    'Basic understanding of research',
    'Access to statistical software'
  ],
  totalStudyHours: 12.5,
  difficulty: 'comprehensive',
  resources: ['Video Lessons', 'Statistical Software Guides', 'Analysis Templates'],
  tips: [
    'Follow along with software tutorials',
    'Practice with sample datasets',
    'Review statistical concepts regularly',
    'Apply techniques to your own projects'
  ],
  warnings: [
    'Statistical analysis requires careful attention to detail',
    'Practice is essential for mastery'
  ]
};

// The Match Guy - Step 3 CCS
export const step3CCS: CrashCourse = {
  id: 'step3-ccs',
  title: 'Step 3 CCS',
  duration: '3hr 00m',
  description: 'This course teaches you how to solve real CCS cases of the USMLE STEP3 exam.',
  targetAudience: 'Medical students preparing for USMLE Step 3',
  prerequisites: [
    'Completed Step 1 and Step 2 CK',
    'Basic clinical knowledge'
  ],
  totalStudyHours: 3,
  difficulty: 'intensive',
  resources: ['Video Lessons', 'CCS Cases', 'Practice Scenarios'],
  tips: [
    'Practice CCS cases regularly',
    'Learn the case format',
    'Focus on time management',
    'Review common case patterns'
  ],
  warnings: [
    'CCS cases require practice',
    'Time management is crucial'
  ]
};

// The Match Guy - Step 1 Live Bootcamp
export const step1LiveBootcamp: CrashCourse = {
  id: 'step1-live-bootcamp',
  title: 'Step 1 Live Bootcamp',
  duration: '51hr 15m',
  description: 'This course will teach you every high-yield Step 1 concepts.',
  targetAudience: 'Medical students preparing for USMLE Step 1',
  prerequisites: [
    'Completed basic science coursework',
    '7 sessions availability'
  ],
  totalStudyHours: 51.25,
  difficulty: 'intensive',
  resources: ['Live Sessions', 'Video Recordings', 'Study Materials', 'Practice Questions'],
  tips: [
    'Attend all live sessions',
    'Review recordings if you miss sessions',
    'Complete all practice questions',
    'Follow the structured schedule',
    'Take notes during sessions'
  ],
  warnings: [
    'This is an intensive bootcamp',
    'Requires full commitment',
    'Attend live sessions for best results'
  ]
};

// The Match Guy - Step 2 CK Live Bootcamp
export const step2CKLiveBootcamp: CrashCourse = {
  id: 'step2ck-live-bootcamp',
  title: 'Step 2 CK Live Bootcamp',
  duration: '42hr',
  description: 'This course will teach you every high-yield Step 2 CK concepts.',
  targetAudience: 'Medical students preparing for USMLE Step 2 CK',
  prerequisites: [
    'Completed Step 1',
    'Basic clinical knowledge',
    '7 sessions availability'
  ],
  totalStudyHours: 42,
  difficulty: 'intensive',
  resources: ['Live Sessions', 'Video Recordings', 'Clinical Cases', 'Practice Questions'],
  tips: [
    'Attend all live sessions',
    'Review clinical cases thoroughly',
    'Complete practice questions',
    'Focus on clinical reasoning',
    'Review recordings for missed content'
  ],
  warnings: [
    'This is an intensive bootcamp',
    'Requires full commitment',
    'Clinical knowledge is essential'
  ]
};

// The Match Guy - Step 3 Live Bootcamp
export const step3LiveBootcamp: CrashCourse = {
  id: 'step3-live-bootcamp',
  title: 'Step 3 Live Bootcamp',
  duration: '42hr',
  description: 'This course will teach you every high-yield Step 3 concepts.',
  targetAudience: 'Medical students preparing for USMLE Step 3',
  prerequisites: [
    'Completed Step 1 and Step 2 CK',
    'Clinical experience',
    '7 sessions availability'
  ],
  totalStudyHours: 42,
  difficulty: 'intensive',
  resources: ['Live Sessions', 'Video Recordings', 'CCS Cases', 'Practice Questions'],
  tips: [
    'Attend all live sessions',
    'Practice CCS cases regularly',
    'Focus on management strategies',
    'Review clinical guidelines',
    'Complete all practice questions'
  ],
  warnings: [
    'This is an intensive bootcamp',
    'Requires full commitment',
    'CCS practice is essential'
  ]
};

// Export all crash courses
export const allCrashCourses: CrashCourse[] = [
  sevenDayCrashCourse,
  sixWeekCrashCourse,
  researchCourse,
  howToStudyForExams,
  findResearchPositions,
  usmleBiostatistics,
  medicalStatistics,
  step3CCS,
  step1LiveBootcamp,
  step2CKLiveBootcamp,
  step3LiveBootcamp
];

// Helper functions
export function getCrashCourseById(id: string): CrashCourse | undefined {
  return allCrashCourses.find(course => course.id === id);
}

export function getCrashCourseByDuration(duration: string): CrashCourse | undefined {
  return allCrashCourses.find(course => course.duration === duration);
}
// Course marketplace updated
// Course marketplace updated Fri Nov  7 22:49:06 CST 2025
