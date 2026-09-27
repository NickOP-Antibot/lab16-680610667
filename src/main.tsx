import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ThemeProvider } from "@/components/theme-provider"; // <-- อิมพอร์ต ThemeProvider
import "./index.css";

import RootLayout from "./layouts/root-layout";
import HomePage from "./pages/home";
import EnrollmentsPage from "./pages/admin/enrollments";
import CoursesPage from "./pages/admin/courses";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "admin/courses",
        element: <CoursesPage />,
      },
      {
        path: "admin/enrollments",
        element: <EnrollmentsPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
