"use client";

import { useState, useEffect } from 'react';
import { SchoolSelector } from './SchoolSelector';
import { MetricsBar } from './MetricsBar';
import { StudentFeed, Student } from './StudentFeed';
import { SystemHealthChart } from './SystemHealthChart';
import { Info } from 'lucide-react';

const generateStudentName = (id: number, school: string) => {
  const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Sage'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore'];
  const firstName = firstNames[id % firstNames.length];
  const lastName = lastNames[Math.floor(id / firstNames.length) % lastNames.length];
  return `${firstName} ${lastName}`;
};

const generateInitialStudents = (school: string, count: number): Student[] => {
  return Array.from({ length: count }, (_, i) => {
    const studentId = school === 'School A' ? i + 1 : i + 1000;
    const statuses: Student['status'][] = ['Writing', 'Writing', 'Writing', 'Completed', 'Offline'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const baseTime = Date.now() - Math.random() * 300000; // Random time in last 5 minutes
    
    return {
      id: `${school}-${studentId}`,
      name: generateStudentName(studentId, school),
      lastSynced: baseTime,
      status: randomStatus,
    };
  });
};

export function AdminDashboard() {
  const [selectedSchool, setSelectedSchool] = useState<string>('School A');
  const [totalStudents, setTotalStudents] = useState<number>(842000);
  const [avgLatency, setAvgLatency] = useState<number>(42);
  const [queueDepth, setQueueDepth] = useState<number>(1234);
  const [schoolAStudents, setSchoolAStudents] = useState<Student[]>(() => generateInitialStudents('School A', 50));
  const [schoolBStudents, setSchoolBStudents] = useState<Student[]>(() => generateInitialStudents('School B', 50));
  const [healthData, setHealthData] = useState<number[]>(() => 
    Array.from({ length: 15 }, () => Math.floor(Math.random() * 30 + 70)) // 70-100%
  );

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics with realistic fluctuations
      setTotalStudents((prev) => {
        const change = Math.floor(Math.random() * 400) - 200; // ±200 range
        return Math.max(800000, Math.min(900000, prev + change));
      });

      setAvgLatency((prev) => {
        const change = Math.floor(Math.random() * 20) - 10; // ±10ms range
        return Math.max(30, Math.min(70, prev + change));
      });

      setQueueDepth((prev) => {
        const change = Math.floor(Math.random() * 800) - 400; // ±400 range
        return Math.max(500, Math.min(2500, prev + change));
      });

      // Update student timestamps and occasional status changes for both schools
      const updateStudentList = (students: Student[]) =>
        students.map((student) => {
          const shouldUpdateTimestamp = Math.random() > 0.3; // 70% chance
          const shouldChangeStatus = Math.random() > 0.95; // 5% chance
          
          let newStatus = student.status;
          if (shouldChangeStatus && student.status === 'Writing') {
            newStatus = Math.random() > 0.8 ? 'Completed' : student.status;
          }

          return {
            ...student,
            lastSynced: shouldUpdateTimestamp
              ? Date.now() - Math.floor(Math.random() * 60000) // Update to recent time
              : student.lastSynced,
            status: newStatus,
          };
        });

      setSchoolAStudents((prev) => updateStudentList(prev));
      setSchoolBStudents((prev) => updateStudentList(prev));

      // Update health chart (shift array and add new value)
      setHealthData((prev) => {
        const newValue = Math.floor(Math.random() * 30 + 70); // 70-100%
        return [...prev.slice(1), newValue];
      });
    }, 2500); // Update every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Get students for the selected school
  const displayedStudents = selectedSchool === 'School A' ? schoolAStudents : schoolBStudents;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-8 p-8">
      {/* Header with School Selector */}
      <header className="flex items-center justify-between pb-6 border-b border-zinc-100">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Teacher Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Real-Time Exam Monitoring</p>
        </div>
        <SchoolSelector selectedSchool={selectedSchool} onSchoolChange={setSelectedSchool} />
      </header>

      {/* Metrics Bar */}
      <MetricsBar 
        totalStudents={totalStudents}
        avgLatency={avgLatency}
        queueDepth={queueDepth}
      />

      {/* Security Note */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-sm text-blue-700 leading-relaxed">
          <strong>Security Note:</strong> All data is filtered by JWT claims. {selectedSchool} cannot access other schools' student data. Multi-tenancy is enforced at the API layer.
        </div>
      </div>

      {/* Student Feed */}
      <StudentFeed students={displayedStudents.slice(0, 20)} />

      {/* System Health Chart */}
      <SystemHealthChart healthData={healthData} />

      {/* Footer */}
      <footer className="pt-8 border-t border-zinc-100 text-center text-zinc-400 text-xs">
        &copy; 2026 Quiz-Me High-Scale Prototype &bull; Gradeo Stack Simulation
      </footer>
    </div>
  );
}

