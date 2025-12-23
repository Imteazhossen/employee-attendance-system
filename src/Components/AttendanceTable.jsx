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
} from "lucide-react";

const AttendanceTable = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Helper: Identify Friday
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

  const toggleAttendance = (employeeId, dateIndex) => {
    // Disable for Friday
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
      case 1:
        return "bg-green-600 border-green-500 text-white";
      case 2:
        return "bg-red-600 border-red-500 text-white";
      case 3:
        return "bg-yellow-500 border-yellow-400 text-black";
      default:
        return "bg-[#262626] border-neutral-700 text-transparent hover:border-neutral-500";
    }
  };
console.log(employees);
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Users className="text-red-600" /> Attendance Management
          </h1>
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            {now.toLocaleString("default", { month: "long" })} {year}
          </p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2">
          <Download size={18} /> Export Report
        </button>
      </div>

      {/* Search */}
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

      {/* Table */}
      <div className="bg-[#141414] rounded-xl border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1a1a1a] border-b border-neutral-800">
                <th className="p-4 sticky left-0 bg-[#1a1a1a] border-r border-neutral-800">
                  Employee Name
                </th>
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <th
                    key={i}
                    className={`p-2 text-xs text-center border-l border-neutral-800/50 ${
                      isFriday(i) ? "text-indigo-400 bg-indigo-950/30" : ""
                    }`}
                  >
                    {i + 1}
                  </th>
                ))}
                <th className="p-4 text-right">Salary</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="border-b border-neutral-800 hover:bg-[#1c1c1c]">
                  <td className="p-4 sticky left-0 bg-[#141414] border-r border-neutral-800">
                    {employee.name}
                  </td>

                  {attendance[employee.id].map((state, dateIdx) => (
                    <td key={dateIdx} className="p-1 border-l border-neutral-800/30">
                      <div className="flex justify-center">
                        <motion.button
                          whileTap={!isFriday(dateIdx) ? { scale: 0.9 } : {}}
                          onClick={() => toggleAttendance(employee.id, dateIdx)}
                          className={`w-6 h-6 rounded border flex items-center justify-center ${getStatusStyle(
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

                  <td className="p-4 text-right font-mono text-sm">
                    {employee.salaryRange}
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
