"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ✅ Define a proper Student type
type Student = {
  name: string;
  marks: string;
};

export default function TeacherReportPage() {
  // ✅ Tell useState it's an array of Student
  const [students, setStudents] = useState<Student[]>([{ name: "", marks: "" }]);

  const handleAddRow = () => {
    setStudents([...students, { name: "", marks: "" }]);
  };

  // ✅ Restrict 'field' to only valid keys of Student
  const handleChange = (index: number, field: keyof Student, value: string) => {
    const newStudents = [...students];
    newStudents[index][field] = value;
    setStudents(newStudents);
  };

  const calculateGrade = (marks: number) => {
    if (marks >= 90) return "A";
    if (marks >= 80) return "B";
    if (marks >= 70) return "C";
    if (marks >= 60) return "D";
    return "F";
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    const tableData = students.map(s => [s.name, s.marks, calculateGrade(Number(s.marks))]);
    autoTable(doc, {
      head: [["Name", "Marks", "Grade"]],
      body: tableData
    });
    doc.save("report.pdf");
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="font-headline">Teacher Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      placeholder="Student Name"
                      value={student.name}
                      onChange={(e) => handleChange(index, "name", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Marks"
                      type="number"
                      value={student.marks}
                      onChange={(e) => handleChange(index, "marks", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    {student.marks ? calculateGrade(Number(student.marks)) : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex gap-4 mt-6">
            <Button onClick={handleAddRow}>Add Student</Button>
            <Button onClick={handleDownload} variant="outline">
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
