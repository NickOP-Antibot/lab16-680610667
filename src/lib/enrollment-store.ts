import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Student, type Course } from "./types";
import { Students, Courses } from "./mock-data";

interface EnrollmentState {
  students: Student[];
  courses: Course[];

  // Actions สำหรับ Courses
  addCourse: (course: Course) => void;
  deleteCourse: (courseCode: string) => void;
  removeInstructor: (courseCode: string, instructorName: string) => void;

  // Actions สำหรับ Enrollments
  enrollStudents: (courseCode: string, studentIds: string[]) => void;
  dropStudent: (courseCode: string, studentId: string) => void;
}

export const useEnrollmentStore = create<EnrollmentState>()(
  persist(
    (set) => ({
      students: Students,
      courses: Courses,

      addCourse: (course) =>
        set((state) => ({ courses: [...state.courses, course] })),

      deleteCourse: (courseCode) =>
        set((state) => ({
          courses: state.courses.filter((c) => c.courseCode !== courseCode),
          students: state.students.map((s) => ({
            ...s,
            enrolledCourses: s.enrolledCourses.filter(
              (code) => code !== courseCode,
            ),
          })),
        })),

      removeInstructor: (courseCode, instructorName) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.courseCode === courseCode
              ? {
                  ...c,
                  instructors: c.instructors?.filter(
                    (name) => name !== instructorName,
                  ),
                }
              : c,
          ),
        })),

      enrollStudents: (courseCode, studentIds) =>
        set((state) => ({
          students: state.students.map((s) => {
            if (
              studentIds.includes(s.id) &&
              !s.enrolledCourses.includes(courseCode)
            ) {
              return {
                ...s,
                enrolledCourses: [...s.enrolledCourses, courseCode],
              };
            }
            return s;
          }),
        })),

      dropStudent: (courseCode, studentId) =>
        set((state) => ({
          students: state.students.map((s) =>
            s.id === studentId
              ? {
                  ...s,
                  enrolledCourses: s.enrolledCourses.filter(
                    (code) => code !== courseCode,
                  ),
                }
              : s,
          ),
        })),
    }),
    {
      name: "lab16-2569-680610667",
      partialize: (state) => ({
        students: state.students,
        courses: state.courses,
      }),
    },
  ),
);
