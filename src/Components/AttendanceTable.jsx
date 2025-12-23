import React, { useState } from "react";
import { motion } from "framer-motion"; // Import Framer Motion for animations

const AttendanceTable = () => {
    // Dummy employee data
    const employees = [
        { name: "John Doe", salaryRange: "$50,000" },
        { name: "Jane Smith", salaryRange: "$45,000" },
        { name: "Samuel Green", salaryRange: "$60,000" },
        { name: "John Doe", salaryRange: "$50,000" },
        { name: "Jane Smith", salaryRange: "$45,000" },
        { name: "Samuel Green", salaryRange: "$60,000" },
        { name: "John Doe", salaryRange: "$50,000" },
        { name: "Jane Smith", salaryRange: "$45,000" },
        { name: "Samuel Green", salaryRange: "$60,000" },
        { name: "John Doe", salaryRange: "$50,000" },
        { name: "Jane Smith", salaryRange: "$45,000" },
        { name: "Samuel Green", salaryRange: "$60,000" },
    ];

    // Initialize attendance state (an array for each employee's attendance)
    const [attendance, setAttendance] = useState(
        employees.map(() => Array(31).fill(true)) // Default 'true' (red) for each checkbox
    );

    // Handle checkbox toggle
    const toggleAttendance = (employeeIndex, dateIndex) => {
        const newAttendance = [...attendance];
        newAttendance[employeeIndex][dateIndex] = !newAttendance[employeeIndex][dateIndex];
        setAttendance(newAttendance);

        // For 'false' (green) values, store the date in the backend (or dummy array for now)
        if (!newAttendance[employeeIndex][dateIndex]) {
            console.log(`Employee: ${employees[employeeIndex].name} missed on: ${dateIndex + 1}`);
        }
    };

    return (
        <div className="bg-gray-900 text-white p-1 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-6">Employee Attendance</h1>

            <table className=" table-auto">
                <thead>
                    <tr>
                        <th className="p-1">Employee Name</th>
                        {Array.from({ length: 31 }, (_, index) => (
                            <th key={index} className="p-1">{index + 1}</th>
                        ))}
                        <th className="p-1">Salary <br /> Range</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee, employeeIndex) => (
                        <tr key={employee.name} className="border-b border-gray-700">
                            <td className="p-1">{employee.name}</td>
                            {attendance[employeeIndex].map((isPresent, dateIndex) => (
                                <td key={dateIndex} className="p-1 text-center">
                                    <motion.div
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={!isPresent}
                                            onChange={() => toggleAttendance(employeeIndex, dateIndex)}
                                            className={`w-6 h-6 checkbox transition-colors duration-300 rounded-full ${isPresent ? "bg-slate-600 " : "bg-green-600"
                                                }`}
                                        />
                                    </motion.div>
                                </td>
                            ))}
                            <td className="p-1">{employee.salaryRange}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceTable;
