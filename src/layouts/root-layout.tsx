import { Outlet } from "react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";

const Footer = ({
  firstName,
  lastName,
  studentId,
}: {
  firstName: string;
  lastName: string;
  studentId: string;
}) => (
  <footer className="border-t p-4 text-center text-sm text-muted-foreground mt-auto">
    จัดทำโดย {firstName} {lastName} รหัสนักศึกษา {studentId}
  </footer>
);

export default function RootLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex min-h-screen flex-1 flex-col transition-all duration-300 ease-in-out bg-background text-foreground">
        <header className="flex h-16 items-center justify-between border-b px-6 bg-background">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1>จัดการวิชาเรียนและสถานะนักศึกษา</h1>
          </div>
          <ModeToggle />
        </header>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
        <Footer
          firstName="Chitsanupat"
          lastName="Amornpiyapong"
          studentId="680610667"
        />
      </main>
    </SidebarProvider>
  );
}
