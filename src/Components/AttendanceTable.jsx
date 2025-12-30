import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Search,
  Download,
  Users,
  Clock,
  CalendarOff,
  FileDown,
} from "lucide-react";
// PDF Imports
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AttendanceTable = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = now.toLocaleString("default", { month: "long" });

  const isFriday = (dateIdx) => {
    const checkDate = new Date(year, month, dateIdx + 1);
    return checkDate.getDay() === 5;
  };

  const [employees, setEmployees] = useState([
    { id: 1, name: "John Smith", salaryRange: "$1,245", absent: [], late: [], present: [] },
    { id: 2, name: "Sarah Johnson", salaryRange: "$890", absent: [], late: [], present: [] },
    { id: 3, name: "Mike Davis", salaryRange: "$2,520", absent: [], late: [], present: [] },
    { id: 4, name: "Emily Wilson", salaryRange: "$495", absent: [], late: [], present: [] },
    { id: 5, name: "David Brown", salaryRange: "$1,340", absent: [], late: [], present: [] },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const [attendance, setAttendance] = useState(
    employees.reduce((acc, emp) => {
      acc[emp.id] = Array(daysInMonth).fill(0);
      return acc;
    }, {})
  );

  // FIXED PDF GENERATION
  const generatePDF = (employee) => {
    const doc = new jsPDF();

    // 1. Add Header Information
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("EMPLOYEE ATTENDANCE REPORT", 14, 22);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Employee Name: ${employee.name}`, 14, 32);
    doc.text(`Reporting Month: ${monthName} ${year}`, 14, 40);
    doc.text(`Salary Range: ${employee.salaryRange}`, 14, 48);

    // 2. Prepare Table Data
    const tableColumn = ["Status", "Total Days", "Specific Dates"];
    const tableRows = [
      ["Present", employee.present.length, employee.present.join(", ") || "No records"],
      ["Absent", employee.absent.length, employee.absent.join(", ") || "No records"],
      ["Late", employee.late.length, employee.late.join(", ") || "No records"],
    ];

    // 3. Call autoTable directly
    autoTable(doc, {
      startY: 55,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 5 },
      columnStyles: {
        0: { fontStyle: 'bold', width: 30 },
        1: { halign: 'center', width: 30 },
        2: { cellWidth: 'auto' }
      }
    });

    // 4. Save
    doc.save(`${employee.name.replace(/\s+/g, '_')}_Report.pdf`);
  };

  const toggleAttendance = (employeeId, dateIndex) => {
    if (isFriday(dateIndex)) return;

    const currentStates = [...attendance[employeeId]];
    const nextState = (currentStates[dateIndex] + 1) % 4;
    currentStates[dateIndex] = nextState;

    setAttendance({ ...attendance, [employeeId]: currentStates });

    const dateString = new Date(year, month, dateIndex + 1).toLocaleDateString();

    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) => {
        if (emp.id === employeeId) {
          const present = emp.present.filter((d) => d !== dateString);
          const absent = emp.absent.filter((d) => d !== dateString);
          const late = emp.late.filter((d) => d !== dateString);

          if (nextState === 1) present.push(dateString);
          if (nextState === 2) absent.push(dateString);
          if (nextState === 3) late.push(dateString);

          return { ...emp, present, absent, late };
        }
        return emp;
      })
    );
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (state, dateIdx) => {
    if (isFriday(dateIdx)) {
      return "bg-indigo-900/40 border-indigo-500/50 text-indigo-300 cursor-not-allowed opacity-80";
    }
    switch (state) {
      case 1: return "bg-green-600 border-green-500 text-white";
      case 2: return "bg-red-600 border-red-500 text-white";
      case 3: return "bg-yellow-500 border-yellow-400 text-black";
      default: return "bg-[#262626] border-neutral-700 text-transparent hover:border-neutral-500";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Users className="text-red-600" /> Attendance Management
          </h1>
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            {monthName} {year}
          </p>
        </div>
      </div>

      <div className="bg-[#141414] p-4 rounded-xl border border-neutral-800 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by employee name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-neutral-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-red-600"
          />
        </div>
      </div>

      <div className="bg-[#141414] rounded-xl border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1a1a1a] border-b border-neutral-800">
                <th className="p-4 sticky left-0 bg-[#1a1a1a] border-r border-neutral-800 text-left text-xs font-medium text-gray-400 uppercase">
                  Employee Name
                </th>
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <th
                    key={i}
                    className={`p-2 text-xs text-center border-l border-neutral-800/50 ${
                      isFriday(i) ? "text-indigo-400 bg-indigo-950/30" : "text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </th>
                ))}
                <th className="p-4 text-right text-xs font-medium text-gray-400 uppercase">Salary</th>
                <th className="p-4 text-center text-xs font-medium text-gray-400 uppercase">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="border-b border-neutral-800 hover:bg-[#1c1c1c] transition-colors">
                  <td className="p-4 sticky left-0 bg-[#141414] border-r border-neutral-800 font-medium whitespace-nowrap">
                    {employee.name}
                  </td>

                  {attendance[employee.id].map((state, dateIdx) => (
                    <td key={dateIdx} className="p-1 border-l border-neutral-800/30">
                      <div className="flex justify-center">
                        <motion.button
                          whileTap={!isFriday(dateIdx) ? { scale: 0.9 } : {}}
                          onClick={() => toggleAttendance(employee.id, dateIdx)}
                          className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${getStatusStyle(
                            state,
                            dateIdx
                          )}`}
                        >
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={isFriday(dateIdx) ? "holiday" : state}
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ duration: 0.1 }}
                            >
                              {isFriday(dateIdx) ? (
                                <CalendarOff size={14} strokeWidth={2.5} />
                              ) : (
                                <>
                                  {state === 1 && <Check size={14} strokeWidth={3} />}
                                  {state === 2 && <X size={14} strokeWidth={3} />}
                                  {state === 3 && <Clock size={14} strokeWidth={3} />}
                                </>
                              )}
                            </motion.div>
                          </AnimatePresence>
                        </motion.button>
                      </div>
                    </td>
                  ))}

                  <td className="p-4 text-right font-mono text-sm text-gray-300">
                    {employee.salaryRange}
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => generatePDF(employee)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Download PDF"
                    >
                      <FileDown size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;