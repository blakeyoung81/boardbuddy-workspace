'use client';

import React, { Suspense } from 'react';
import { CoursePurchaseCard } from '@/components/CoursePurchaseCard';
import { allCrashCourses } from '@/lib/crashCourses';
import { getEnabledCourses } from '@/lib/courses/config';
import {
  BookOpen,
  Loader2,
  Sparkles,
  Shield,
  Clock,
  Award
} from 'lucide-react';

function CoursesContent() {
  // Filter to only show enabled courses
  const enabledCourseIds = getEnabledCourses().map(c => c.id);
  const availableCourses = allCrashCourses.filter(course => 
    enabledCourseIds.includes(course.id)
  );

  // Debug logging (remove in production)
  if (typeof window !== 'undefined') {
    console.log('Enabled course IDs:', enabledCourseIds);
    console.log('All crash courses:', allCrashCourses.length);
    console.log('All crash course IDs:', allCrashCourses.map(c => c.id));
    console.log('Available courses:', availableCourses.length);
    console.log('Available course IDs:', availableCourses.map(c => c.id));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Course Marketplace
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-2">
            Choose from our proven study courses designed by medical education experts.
          </p>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            Each course includes comprehensive study plans, daily schedules, and 90 days of access
          </p>
        </div>

        {/* Course Grid */}
        {availableCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-5xl mx-auto">
            {availableCourses.map((course) => (
              <CoursePurchaseCard
                key={course.id}
                course={course}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg">No courses available at this time.</p>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="p-3 bg-blue-50 rounded-xl w-fit mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">90-Day Access</h3>
            <p className="text-sm text-gray-600">
              Get full access to your course for 90 days from purchase date. Study at your own pace with our comprehensive materials.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="p-3 bg-green-50 rounded-xl w-fit mb-4">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Daily Schedules</h3>
            <p className="text-sm text-gray-600">
              Follow structured daily study plans with specific activities, resources, and practice questions tailored to your timeline.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="p-3 bg-purple-50 rounded-xl w-fit mb-4">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Proven Results</h3>
            <p className="text-sm text-gray-600">
              Courses designed by medical education experts and used by thousands of successful Step 1 students.
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">What's Included</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Comprehensive daily or weekly study schedules</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Integration with practice questions, medical library, and flashcards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Progress tracking and completion status</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Access to all course resources and materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>90 days of full access from purchase date</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-700 text-lg font-medium">Loading Courses...</p>
          <p className="text-gray-500 text-sm mt-2">Preparing course marketplace</p>
        </div>
      </div>
    }>
      <CoursesContent />
    </Suspense>
  );
}
