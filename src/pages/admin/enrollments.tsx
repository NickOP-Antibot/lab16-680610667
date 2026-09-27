import { useState } from "react";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X, Plus, Check } from "lucide-react";

export default function EnrollmentsPage() {
  const { students, courses, enrollStudents, dropStudent } =
    useEnrollmentStore();
  const [open, setOpen] = useState(false);

  // Dialog State
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentInput, setStudentInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter State
  const [searchType, setSearchType] = useState<"course" | "student">("course");
  const [filterValue, setFilterValue] = useState<string>("all");

  const handleSearchTypeChange = (type: "course" | "student") => {
    setSearchType(type);
    setFilterValue("all");
  };

  const handleCourseChange = (val: string) => {
    if (!val) return;
    setSelectedCourse(val);
    setSelectedStudents([]);
    setStudentInput("");
  };

  const handleEnroll = () => {
    if (!selectedCourse || selectedStudents.length === 0) return;
    enrollStudents(selectedCourse, selectedStudents);
    setOpen(false);
    setSelectedCourse("");
    setSelectedStudents([]);
    setStudentInput("");
  };

  const toggleStudentSelection = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
    setStudentInput("");
  };

  const availableStudents = students.filter(
    (s) => !s.enrolledCourses.includes(selectedCourse),
  );

  const displayCourses = courses.filter((course) => {
    if (filterValue === "all") return true;
    if (searchType === "course") {
      return course.courseCode === filterValue;
    } else {
      const student = students.find((s) => s.id === filterValue);
      return student?.enrolledCourses.includes(course.courseCode);
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">
            จัดการการลงทะเบียน
          </h2>
          <p className="text-sm text-muted-foreground">
            Admin ลงทะเบียนและยกเลิกการลงทะเบียนให้นักศึกษาได้ทุกคน
          </p>
        </div>

        <Dialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) {
              setSelectedCourse("");
              setSelectedStudents([]);
              setStudentInput("");
              setIsDropdownOpen(false);
            }
          }}
        >
          <DialogTrigger>
            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2 cursor-pointer shadow-sm">
              <Plus size={16} /> ลงทะเบียนให้นักศึกษา
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] overflow-visible">
            <DialogHeader>
              <DialogTitle>ลงทะเบียนให้นักศึกษา</DialogTitle>
              <DialogDescription>
                เลือกวิชาก่อน แล้วเลือกนักศึกษาที่ยังไม่ได้ลงทะเบียนวิชานั้น
                (เลือกได้มากกว่า 1 คน)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>วิชา</Label>
                <Select
                  value={selectedCourse}
                  onValueChange={(val) => handleCourseChange(val as string)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="เลือกวิชา">
                      {(() => {
                        const c = courses.find(
                          (course) => course.courseCode === selectedCourse,
                        );
                        return c ? `${c.courseCode} — ${c.title}` : "เลือกวิชา";
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c.courseCode} value={c.courseCode}>
                        {c.courseCode} — {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 relative">
                <Label>นักศึกษา</Label>
                {!selectedCourse ? (
                  <div className="text-muted-foreground flex flex-wrap items-center gap-1.5 px-3 py-1.5 border border-input rounded-md focus-within:outline-none focus-within:ring-1 focus-within:ring-ring bg-transparent min-h-[30px] cursor-text transition-colors">
                    เลือกวิชาก่อน
                  </div>
                ) : (
                  <>
                    <div
                      className="flex flex-wrap items-center gap-1.5 px-3 py-1.5 border border-input rounded-md focus-within:outline-none focus-within:ring-1 focus-within:ring-ring bg-transparent min-h-[30px] cursor-text transition-colors"
                      onClick={() =>
                        document.getElementById("student-input")?.focus()
                      }
                    >
                      {selectedStudents.map((studentId) => {
                        const student = students.find(
                          (s) => s.id === studentId,
                        );
                        if (!student) return null;
                        return (
                          <Badge
                            key={student.id}
                            variant="secondary"
                            className="px-2 py-0.5 text-sm font-normal rounded-md border bg-muted/50"
                          >
                            {student.firstName} {student.lastName}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStudentSelection(student.id);
                              }}
                              className="ml-1 text-muted-foreground hover:text-foreground focus:outline-none"
                            >
                              <X size={14} />
                            </button>
                          </Badge>
                        );
                      })}
                      <input
                        id="student-input"
                        className="flex-1 bg-transparent outline-none min-w-[120px] text-sm placeholder:text-muted-foreground"
                        value={studentInput}
                        onChange={(e) => {
                          setStudentInput(e.target.value);
                          setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        onBlur={() =>
                          setTimeout(() => setIsDropdownOpen(false), 200)
                        }
                        placeholder={
                          selectedStudents.length === 0
                            ? "ค้นหา/เลือกนักศึกษา"
                            : ""
                        }
                        onKeyDown={(e) => {
                          if (
                            e.key === "Backspace" &&
                            studentInput === "" &&
                            selectedStudents.length > 0
                          ) {
                            const newSelected = [...selectedStudents];
                            newSelected.pop();
                            setSelectedStudents(newSelected);
                          }
                        }}
                      />
                    </div>

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 w-full mt-1 border-in rounded-md bg-background shadow-md z-50 py-1 max-h-48 overflow-y-auto">
                        {availableStudents
                          .filter((s) =>
                            (s.id + s.firstName + s.lastName)
                              .toLowerCase()
                              .includes(studentInput.toLowerCase()),
                          )
                          .map((student) => (
                            <div
                              key={student.id}
                              className="flex items-center justify-between px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                toggleStudentSelection(student.id);
                              }}
                            >
                              <span>
                                {student.id} — {student.firstName}{" "}
                                {student.lastName}
                              </span>
                              {selectedStudents.includes(student.id) && (
                                <Check size={16} />
                              )}
                            </div>
                          ))}
                        {availableStudents.filter((s) =>
                          (s.id + s.firstName + s.lastName)
                            .toLowerCase()
                            .includes(studentInput.toLowerCase()),
                        ).length === 0 && (
                          <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                            ไม่พบรายชื่อนักศึกษา
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleEnroll}
                disabled={!selectedCourse || selectedStudents.length === 0}
                className="w-full gap-2"
              >
                <Plus size={16} /> ลงทะเบียน ({selectedStudents.length} คน)
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 mt-6">
        <div className="inline-flex h-9 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground w-fit">
          <button
            onClick={() => handleSearchTypeChange("course")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all ${searchType === "course" ? "bg-background text-foreground shadow-sm" : "hover:text-foreground"}`}
          >
            ค้นหาตามวิชา
          </button>
          <button
            onClick={() => handleSearchTypeChange("student")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all ${searchType === "student" ? "bg-background text-foreground shadow-sm" : "hover:text-foreground"}`}
          >
            ค้นหาตามนักศึกษา
          </button>
        </div>

        <Select
          value={filterValue}
          onValueChange={(val) => setFilterValue(val as string)}
        >
          <SelectTrigger className="w-full bg-background">
            <SelectValue
              placeholder={searchType === "course" ? "ทุกวิชา" : "ทุกคน"}
            >
              {filterValue === "all"
                ? searchType === "course"
                  ? "ทุกวิชา"
                  : "ทุกคน"
                : searchType === "course"
                  ? (() => {
                      const c = courses.find(
                        (course) => course.courseCode === filterValue,
                      );
                      return c ? `${c.courseCode} — ${c.title}` : filterValue;
                    })()
                  : (() => {
                      const s = students.find(
                        (student) => student.id === filterValue,
                      );
                      return s
                        ? `${s.id} — ${s.firstName} ${s.lastName}`
                        : filterValue;
                    })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {searchType === "course" ? (
              <>
                <SelectItem value="all">ทุกวิชา</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.courseCode} value={c.courseCode}>
                    {c.courseCode} — {c.title}
                  </SelectItem>
                ))}
              </>
            ) : (
              <>
                <SelectItem value="all">ทุกคน</SelectItem>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.id} — {s.firstName} {s.lastName}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัสวิชา</TableHead>
              <TableHead>ชื่อวิชา</TableHead>
              <TableHead>จำนวน นศ.</TableHead>
              <TableHead>นักศึกษาที่ลงทะเบียน</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayCourses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center h-24 text-muted-foreground"
                >
                  ไม่มีข้อมูลวิชาเรียน
                </TableCell>
              </TableRow>
            ) : (
              displayCourses.map((course) => {
                const enrolledStudents = students.filter((s) =>
                  s.enrolledCourses.includes(course.courseCode),
                );
                return (
                  <TableRow key={course.courseCode}>
                    <TableCell className="font-medium">
                      {course.courseCode}
                    </TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{enrolledStudents.length}</TableCell>
                    <TableCell>
                      {enrolledStudents.length === 0 ? (
                        <span className="text-sm text-muted-foreground">
                          ยังไม่มีนักศึกษาลงทะเบียน
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {enrolledStudents.map((student) => (
                            <Badge
                              key={student.id}
                              variant="outline"
                              className="pr-1 font-normal text-blue-600 border-blue-200 bg-blue-50/50 dark:text-blue-300 dark:border-blue-800 dark:bg-blue-900/30"
                            >
                              {student.firstName} {student.lastName}
                              <button
                                onClick={() =>
                                  dropStudent(course.courseCode, student.id)
                                }
                                className="ml-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800 p-[1px]"
                              >
                                <X size={12} />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
