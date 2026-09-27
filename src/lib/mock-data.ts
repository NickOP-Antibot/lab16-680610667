import type { Student, Course } from "./types";

export const Students: Student[] = [
  {
    id: "650610001",
    firstName: "Matt",
    lastName: "Damon",
    email: "matt.d@example.com",
    status: "Active",
    enrolledCourses: ["CS101", "CS201"],
  },
  {
    id: "650610003",
    firstName: "Emily",
    lastName: "Blunt",
    email: "emily.b@example.com",
    status: "Active",
    enrolledCourses: ["ISNE101"],
  },
  {
    id: "650610004",
    firstName: "Florence",
    lastName: "Pugh",
    email: "florence.p@example.com",
    status: "Inactive",
    enrolledCourses: ["CPE301"],
  },
  {
    id: "650610005",
    firstName: "Robert",
    lastName: "Downey",
    email: "robert.d@example.com",
    status: "Active",
    enrolledCourses: [],
  },
  {
    id: "650610006",
    firstName: "Zendaya",
    lastName: "Coleman",
    email: "zendaya.c@example.com",
    status: "Active",
    enrolledCourses: ["CS101", "CPE301", "CPE302"],
  },
];

export const Courses: Course[] = [
  {
    courseCode: "CS101",
    title: "Introduction to Programming",
    credits: 3,
    instructors: ["Dome", "Somchai"],
  },
  {
    courseCode: "CS201",
    title: "Data Structures",
    credits: 3,
    instructors: ["Dome"],
  },
  {
    courseCode: "CPE301",
    title: "Basic Computer Engineering Lab",
    credits: 1,
    instructors: ["Dome", "Kenneth Con"],
  },
  {
    courseCode: "CPE302",
    title: "Full Stack Development",
    credits: 3,
    instructors: ["Dome", "Kenneth Con"],
  },
  {
    courseCode: "ISNE101",
    title: "Introduction to Information Systems and Network Engineering",
    credits: 3,
    instructors: ["Kenneth Con"],
  },
];
