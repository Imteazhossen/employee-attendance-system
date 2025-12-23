import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Search, Download, Users } from "lucide-react"; // Using lucide-react for cleaner icons

const AttendanceTable = () => {
    const employees = [
        { name: "John Smith", salaryRange: "$1,245" },
        { name: "Sarah Johnson", salaryRange: "$890" },
        { name: "Mike Davis", salaryRange: "$2,520" },
        { name: "Emily Wilson", salaryRange: "$495" },
        { name: "David Brown", salaryRange: "$1,340" },
    ];

    const [attendance, setAttendance] = useState(
        employees.map(() => Array(31).fill(0))
    );

    const toggleAttendance = (employeeIndex, dateIndex) => {
        const newAttendance = [...attendance];
        const currentState = newAttendance[employeeIndex][dateIndex];
        const nextState = (currentState + 1) % 3;
        newAttendance[employeeIndex][dateIndex] = nextState;
        setAttendance(newAttendance);
    };

    const getStatusStyle = (state) => {
        switch (state) {
            case 1: return "bg-green-600 border-green-500 text-white";
            case 2: return "bg-red-600 border-red-500 text-white";
            default: return "bg-[#262626] border-neutral-700 text-transparent hover:border-neutral-500";
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-semibold flex items-center gap-2">
                        <Users className="text-red-600" /> Attendance Management
                    </h1>
                    <p className="text-gray-400 text-sm">Monitor and track daily employee presence</p>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium">
                    <Download size={18} /> Export Report
                </button>
            </div>

            {/* Filter Bar (Matches your image) */}
            <div className="bg-[#141414] p-4 rounded-xl border border-neutral-800 mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by employee name..." 
                        className="w-full bg-[#1a1a1a] border border-neutral-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-red-600 transition-colors text-sm"
                    />
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-[#141414] rounded-xl border border-neutral-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-800 bg-[#1a1a1a]">
                                <th className="p-4 text-gray-400 font-medium text-sm sticky left-0 bg-[#1a1a1a] z-10">Employee Name</th>
                                {Array.from({ length: 31 }, (_, i) => (
                                    <th key={i} className="p-2 text-gray-400 font-medium text-xs text-center border-l border-neutral-800/50">{i + 1}</th>
                                ))}
                                <th className="p-4 text-gray-400 font-medium text-sm text-right">Total Salary</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee, empIdx) => (
                                <tr key={empIdx} className="border-b border-neutral-800 hover:bg-[#1c1c1c] transition-colors group">
                                    <td className="p-4 font-medium whitespace-nowrap sticky left-0 bg-[#141414] group-hover:bg-[#1c1c1c] transition-colors">
                                        {employee.name}
                                    </td>
                                    {attendance[empIdx].map((state, dateIdx) => (
                                        <td key={dateIdx} className="p-1 border-l border-neutral-800/30">
                                            <div className="flex justify-center">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => toggleAttendance(empIdx, dateIdx)}
                                                    className={`w-7 h-7 rounded-md flex items-center justify-center border transition-all duration-200 ${getStatusStyle(state)}`}
                                                >
                                                    <AnimatePresence mode="wait">
                                                        {state === 1 && (
                                                            <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                                                <Check size={14} strokeWidth={3} />
                                                            </motion.div>
                                                        )}
                                                        {state === 2 && (
                                                            <motion.div key="cross" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                                                <X size={14} strokeWidth={3} />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.button>
                                            </div>
                                        </td>
                                    ))}
                                    <td className="p-4 text-right font-mono text-gray-300 text-sm">
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