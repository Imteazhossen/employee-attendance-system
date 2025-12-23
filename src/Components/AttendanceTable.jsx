import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Search, Download, Users, Clock } from "lucide-react";

const AttendanceTable = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const initialEmployees = [
        { id: 1, name: "John Smith", salaryRange: "$1,245" },
        { id: 2, name: "Sarah Johnson", salaryRange: "$890" },
        { id: 3, name: "Mike Davis", salaryRange: "$2,520" },
        { id: 4, name: "Emily Wilson", salaryRange: "$495" },
        { id: 5, name: "David Brown", salaryRange: "$1,340" },
    ];

    const [searchTerm, setSearchTerm] = useState("");
    
    // Initialize with dynamic daysInMonth
    const [attendance, setAttendance] = useState(
        initialEmployees.reduce((acc, emp) => {
            acc[emp.id] = Array(daysInMonth).fill(0);
            return acc;
        }, {})
    );

    const toggleAttendance = (employeeId, dateIndex, empName) => {
        const currentStates = [...attendance[employeeId]];
        const nextState = (currentStates[dateIndex] + 1) % 4;
        currentStates[dateIndex] = nextState;

        setAttendance({ ...attendance, [employeeId]: currentStates });

        if (nextState !== 0) {
            const statusLabels = ["Initial", "Present", "Absent", "Late"];
            // Construct exact date for storage logic
            const specificDate = new Date(year, month, dateIndex + 1);
            console.log(`Stored: ${empName} | Date: ${specificDate.toDateString()} | Status: ${statusLabels[nextState]}`);
        }
    };

    const filteredEmployees = initialEmployees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (state) => {
        switch (state) {
            case 1: return "bg-green-600 border-green-500 text-white";
            case 2: return "bg-red-600 border-red-500 text-white";
            case 3: return "bg-yellow-500 border-yellow-400 text-black";
            default: return "bg-[#262626] border-neutral-700 text-transparent hover:border-neutral-500";
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-semibold flex items-center gap-2">
                        <Users className="text-red-600" /> Attendance Management
                    </h1>
                    <p className="text-gray-400 text-sm uppercase tracking-widest">
                        {now.toLocaleString('default', { month: 'long' })} {year}
                    </p>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium">
                    <Download size={18} /> Export Report
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-[#141414] p-4 rounded-xl border border-neutral-800 mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by employee name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-neutral-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-red-600 transition-colors text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#141414] rounded-xl border border-neutral-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-800 bg-[#1a1a1a]">
                                <th className="p-4 text-gray-400 font-medium text-sm sticky left-0 bg-[#1a1a1a] z-10 border-r border-neutral-800">Employee Name</th>
                                {Array.from({ length: daysInMonth }, (_, i) => (
                                    <th key={i} className="p-2 text-gray-400 font-medium text-xs text-center border-l border-neutral-800/50 ">{i + 1}</th>
                                ))}
                                <th className="p-4 text-gray-400 font-medium text-sm text-right">Salary</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((employee) => (
                                <tr key={employee.id} className="border-b border-neutral-800 hover:bg-[#1c1c1c] transition-colors group">
                                    <td className="p-4 font-medium whitespace-nowrap sticky left-0 bg-[#141414] group-hover:bg-[#1c1c1c] transition-colors border-r border-neutral-800">
                                        {employee.name}
                                    </td>
                                    {attendance[employee.id].map((state, dateIdx) => (
                                        <td key={dateIdx} className="p-1 border-l border-neutral-800/30">
                                            <div className="flex justify-center">
                                                <motion.button
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => toggleAttendance(employee.id, dateIdx, employee.name)}
                                                    className={`w-6 h-6 rounded flex items-center justify-center border transition-all duration-200 ${getStatusStyle(state)}`}
                                                >
                                                    <AnimatePresence mode="wait">
                                                        <motion.div
                                                            key={state}
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.5 }}
                                                            transition={{ duration: 0.1 }}
                                                        >
                                                            {state === 1 && <Check size={14} strokeWidth={3} />}
                                                            {state === 2 && <X size={14} strokeWidth={3} />}
                                                            {state === 3 && <Clock size={14} strokeWidth={3} />}
                                                        </motion.div>
                                                    </AnimatePresence>
                                                </motion.button>
                                            </div>
                                        </td>
                                    ))}
                                    <td className="p-4 text-right font-mono text-gray-400 text-sm whitespace-nowrap">
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