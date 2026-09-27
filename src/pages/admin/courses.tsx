import { useState, useMemo } from "react";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, X, Plus, Check } from "lucide-react";

export default function CoursesPage() {
  const { courses, addCourse, deleteCourse, removeInstructor } =
    useEnrollmentStore();

  // Dialog & Form State
  const [open, setOpen] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newInstructors, setNewInstructors] = useState<string[]>([]);
  const [instructorInput, setInstructorInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Validation
  const isDuplicateCode = useMemo(() => {
    if (!newCode) return false;
    return courses.some(
      (c) => c.courseCode.toLowerCase() === newCode.trim().toLowerCase(),
    );
  }, [newCode, courses]);

  const existingInstructors = useMemo(() => {
    const all = courses.flatMap((c) => c.instructors || []);
    return Array.from(new Set(all));
  }, [courses]);

  const filteredInstructors = existingInstructors.filter((inst) =>
    inst.toLowerCase().includes(instructorInput.toLowerCase()),
  );

  const handleAddInstructor = (name: string) => {
    if (name.trim() && !newInstructors.includes(name.trim())) {
      setNewInstructors([...newInstructors, name.trim()]);
    } else if (newInstructors.includes(name.trim())) {
      setNewInstructors(newInstructors.filter((i) => i !== name.trim()));
    }
    setInstructorInput("");
  };

  const handleSaveCourse = () => {
    if (isDuplicateCode || !newCode.trim() || !newTitle.trim()) return;
    addCourse({
      courseCode: newCode.trim().toUpperCase(),
      title: newTitle.trim(),
      credits: 3,
      instructors: newInstructors,
    });
    setOpen(false);

    // Reset Form
    setNewCode("");
    setNewTitle("");
    setNewInstructors([]);
    setInstructorInput("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">จัดการวิชาเรียน</h2>
          <p className="text-sm text-muted-foreground">
            {courses.length} วิชา — เพิ่มวิชาใหม่ที่นี่แล้วจะไปโผล่เป็นตัวเลือก
            ตอนลงทะเบียนให้นักศึกษาที่หน้า "จัดการการลงทะเบียน" ทันที
          </p>
        </div>

        <Dialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) {
              setNewCode("");
              setNewTitle("");
              setNewInstructors([]);
              setInstructorInput("");
            }
          }}
        >
          <DialogTrigger>
            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2 cursor-pointer shadow-sm">
              <Plus size={14} /> เพิ่มวิชา
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] overflow-visible">
            <DialogHeader>
              <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
              <DialogDescription>
                วิชาที่เพิ่มจะไปโผล่เป็นตัวเลือกตอนลงทะเบียนให้นักศึกษาได้ทันที
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>รหัสวิชา</Label>
                <Input
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className={
                    isDuplicateCode
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                  placeholder="เช่น CPE303"
                />
                {isDuplicateCode && (
                  <p className="text-sm text-red-500 font-medium mt-1">
                    มีรหัสวิชา {newCode.toUpperCase()} นี้แล้ว
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>ชื่อวิชา</Label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="เช่น Mobile Application Development"
                />
              </div>

              {/* ช่องกรอกผู้สอน */}
              <div className="space-y-2 relative">
                <Label>ผู้สอน</Label>
                <div
                  className="flex flex-wrap items-center gap-1.5 px-3 py-1.5 border border-input rounded-md focus-within:outline-none focus-within:ring-1 focus-within:ring-ring bg-transparent min-h-[30px] cursor-text transition-colors"
                  onClick={() =>
                    document.getElementById("instructor-input")?.focus()
                  }
                >
                  {newInstructors.map((inst) => (
                    <Badge
                      key={inst}
                      variant="secondary"
                      className="px-2 py-0.5 text-sm font-normal rounded-md border bg-muted/50"
                    >
                      {inst}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNewInstructors(
                            newInstructors.filter((i) => i !== inst),
                          );
                        }}
                        className="ml-1 text-muted-foreground hover:text-foreground focus:outline-none"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                  <input
                    id="instructor-input"
                    className="flex-1 bg-transparent outline-none min-w-[120px] text-sm placeholder:text-muted-foreground"
                    value={instructorInput}
                    onChange={(e) => {
                      setInstructorInput(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    onBlur={() =>
                      setTimeout(() => setIsDropdownOpen(false), 200)
                    }
                    placeholder={
                      newInstructors.length === 0
                        ? "เลือกหรือพิมพ์ชื่อผู้สอน (ได้หลายคน)"
                        : ""
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (instructorInput.trim())
                          handleAddInstructor(instructorInput.trim());
                      } else if (
                        e.key === "Backspace" &&
                        instructorInput === "" &&
                        newInstructors.length > 0
                      ) {
                        setNewInstructors(newInstructors.slice(0, -1));
                      }
                    }}
                  />
                </div>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-1 border-in rounded-md bg-background shadow-md z-50 py-1 max-h-48 overflow-y-auto">
                    {filteredInstructors.map((inst) => (
                      <div
                        key={inst}
                        className="flex items-center justify-between px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleAddInstructor(inst);
                        }}
                      >
                        <span>{inst}</span>
                        {newInstructors.includes(inst) && <Check size={16} />}
                      </div>
                    ))}

                    {instructorInput.trim() &&
                      !existingInstructors.some(
                        (i) =>
                          i.toLowerCase() ===
                          instructorInput.trim().toLowerCase(),
                      ) && (
                        <div
                          className="px-3 py-2 hover:bg-muted cursor-pointer text-sm flex items-center gap-2"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleAddInstructor(instructorInput.trim());
                          }}
                        >
                          <Plus size={14} className="text-muted-foreground" />{" "}
                          เพิ่มผู้สอน "{instructorInput.trim()}"
                        </div>
                      )}

                    {filteredInstructors.length === 0 &&
                      !instructorInput.trim() && (
                        <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                          ไม่มีข้อมูลผู้สอนในระบบ พิมพ์เพื่อเพิ่มใหม่
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleSaveCourse}
                disabled={
                  isDuplicateCode || !newCode.trim() || !newTitle.trim()
                }
              >
                บันทึก
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">รหัสวิชา</TableHead>
              <TableHead>ชื่อวิชา</TableHead>
              <TableHead>ผู้สอน</TableHead>
              <TableHead className="w-[80px] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center h-24 text-muted-foreground"
                >
                  ไม่มีข้อมูลวิชาเรียน
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.courseCode}>
                  <TableCell className="font-medium">
                    {course.courseCode}
                  </TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {course.instructors && course.instructors.length > 0 ? (
                        course.instructors.map((inst) => (
                          <Badge
                            key={inst}
                            variant="outline"
                            className="pr-1 font-normal text-blue-600 border-blue-200 bg-blue-50/50 dark:text-blue-300 dark:border-blue-800 dark:bg-blue-900/30"
                          >
                            {inst}
                            <button
                              onClick={() =>
                                removeInstructor(course.courseCode, inst)
                              }
                              className="ml-1 rounded-full hover:bg-blue-100 p-[2px]"
                            >
                              <X size={12} />
                            </button>
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          ยังไม่มีผู้สอน
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ลบวิชา {course.courseCode}?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            การกระทำนี้ไม่สามารถย้อนกลับได้
                            นักศึกษาที่ลงทะเบียนวิชานี้จะถูกลบออกด้วย
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteCourse(course.courseCode)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            ลบวิชา
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
