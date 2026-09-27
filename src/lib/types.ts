interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "Active" | "Inactive";
  enrolledCourses: string[];
}

export type { Student };

interface Course {
  courseCode: string;
  title: string;
  credits: number;
  instructors?: string[];
}

export type { Course };
