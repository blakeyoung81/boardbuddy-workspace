/**
 * Course Configuration System
 * Defines course catalog with pricing, Stripe price IDs, and metadata
 */

export interface CourseConfig {
  id: string;
  stripePriceId: string;
  price: number; // in cents (e.g., 35000 = $350.00)
  accessDays: number; // Days of access from purchase (90 days)
  enabled: boolean;
  name: string; // Display name
  description?: string; // Optional description
}

/**
 * Course Catalog Configuration
 * Maps course IDs to their payment and access configurations
 */
export const COURSE_CONFIGS: Record<string, CourseConfig> = {
  '7-day-crash': {
    id: '7-day-crash',
    name: '7-Day Step 1 Intensive Crash Course',
    stripePriceId: process.env.STRIPE_COURSE_7DAY_PRICE_ID || 'price_1SPpt1Hnz3YdTZ9ePPkxQZLy',
    price: 35000, // $350.00 in cents
    accessDays: 90,
    enabled: true,
    description: 'An intensive 7-day review with 19 expert video lessons covering all major systems. Includes Biochemistry, Cardiology, Respiratory, Pharmacology, Microbiology, and more. Perfect for students 1 week before their exam.',
  },
  '6-week-crash': {
    id: '6-week-crash',
    name: '6-Week Step 1 Comprehensive Crash Course',
    stripePriceId: process.env.STRIPE_COURSE_6WEEK_PRICE_ID || 'price_1SPpt1Hnz3YdTZ9ehYS4msLi',
    price: 120000, // $1,200.00 in cents
    accessDays: 90,
    enabled: true,
    description: 'A comprehensive 6-week study plan designed for students with 6 weeks before their exam.',
  },
  // The Match Guy Courses
  'research-course': {
    id: 'research-course',
    name: 'Research Course',
    stripePriceId: process.env.STRIPE_COURSE_RESEARCH_PRICE_ID || 'price_placeholder_research',
    price: 4900, // $49.00 in cents
    accessDays: 90,
    enabled: true,
    description: 'This in-depth course will teach you how to take a research project from idea to publication. 14hr 33m, 13 lessons.',
  },
  'how-to-study-exams': {
    id: 'how-to-study-exams',
    name: 'How to Study for Exams',
    stripePriceId: process.env.STRIPE_COURSE_STUDY_EXAMS_PRICE_ID || 'price_placeholder_study_exams',
    price: 2500, // $25.00 in cents
    accessDays: 90,
    enabled: true,
    description: 'This course will teach you study techniques that will boost your performance on exams! 3hr 11m, 8 lessons.',
  },
  'find-research-positions': {
    id: 'find-research-positions',
    name: 'How to Find Research Positions',
    stripePriceId: process.env.STRIPE_COURSE_FIND_RESEARCH_PRICE_ID || 'price_placeholder_find_research',
    price: 4900, // $49.00 in cents
    accessDays: 90,
    enabled: true,
    description: 'This course will demonstrate how to find research positions in the US! 3hr 00m, live session.',
  },
  'usmle-biostatistics': {
    id: 'usmle-biostatistics',
    name: 'USMLE Biostatistics',
    stripePriceId: process.env.STRIPE_COURSE_BIOSTATS_PRICE_ID || 'price_placeholder_biostats',
    price: 2500, // $25.00 in cents
    accessDays: 90,
    enabled: true,
    description: 'This course will teach you the high yield biostatistical concepts. 12hr 33m, 7 lessons.',
  },
  'medical-statistics': {
    id: 'medical-statistics',
    name: 'Medical Statistics',
    stripePriceId: process.env.STRIPE_COURSE_MED_STATS_PRICE_ID || 'price_placeholder_med_stats',
    price: 9900, // $99.00 in cents
    accessDays: 90,
    enabled: true,
    description: 'This course will show you how to independently do your own statistical analysis for research projects. 12hr 33m, 9 lessons.',
  },
  'step3-ccs': {
    id: 'step3-ccs',
    name: 'Step 3 CCS',
    stripePriceId: process.env.STRIPE_COURSE_STEP3_CCS_PRICE_ID || 'price_placeholder_step3_ccs',
    price: 4900, // $49.00 in cents
    accessDays: 90,
    enabled: true,
    description: 'This course teaches you how to solve real CCS cases of the USMLE STEP3 exam. 3hr 00m, 7 lessons.',
  },
  'step1-live-bootcamp': {
    id: 'step1-live-bootcamp',
    name: 'Step 1 Live Bootcamp',
    stripePriceId: process.env.STRIPE_COURSE_STEP1_BOOTCAMP_PRICE_ID || 'price_placeholder_step1_bootcamp',
    price: 49900, // $499.00 in cents
    accessDays: 90,
    enabled: true,
    description: 'This course will teach you every high-yield Step 1 concepts. 51hr 15m, 7 sessions.',
  },
  'step2ck-live-bootcamp': {
    id: 'step2ck-live-bootcamp',
    name: 'Step 2 CK Live Bootcamp',
    stripePriceId: process.env.STRIPE_COURSE_STEP2CK_BOOTCAMP_PRICE_ID || 'price_placeholder_step2ck_bootcamp',
    price: 75000, // $750.00 in cents
    accessDays: 90,
    enabled: true,
    description: 'This course will teach you every high-yield Step 2 CK concepts. 42hr, 7 sessions.',
  },
  'step3-live-bootcamp': {
    id: 'step3-live-bootcamp',
    name: 'Step 3 Live Bootcamp',
    stripePriceId: process.env.STRIPE_COURSE_STEP3_BOOTCAMP_PRICE_ID || 'price_placeholder_step3_bootcamp',
    price: 99900, // $999.00 in cents
    accessDays: 90,
    enabled: true,
    description: 'This course will teach you every high-yield Step 3 concepts. 42hr, 7 sessions.',
  },
};

/**
 * Get course configuration by ID
 */
export function getCourseConfig(courseId: string): CourseConfig | undefined {
  return COURSE_CONFIGS[courseId];
}

/**
 * Check if a course is enabled and available for purchase
 */
export function isCourseEnabled(courseId: string): boolean {
  const config = getCourseConfig(courseId);
  return config?.enabled === true && !!config.stripePriceId;
}

/**
 * Get all enabled courses
 */
export function getEnabledCourses(): CourseConfig[] {
  return Object.values(COURSE_CONFIGS).filter(course => course.enabled);
}

/**
 * Format price in cents to display string (e.g., 35000 -> "$350.00")
 */
export function formatCoursePrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toFixed(2)}`;
}

/**
 * Get course price as formatted string
 */
export function getCoursePriceString(courseId: string): string {
  const config = getCourseConfig(courseId);
  if (!config) return 'N/A';
  return formatCoursePrice(config.price);
}

