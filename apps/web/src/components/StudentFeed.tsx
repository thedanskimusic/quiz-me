export interface Student {
  id: string;
  name: string;
  lastSynced: number; // timestamp in ms
  status: 'Writing' | 'Completed' | 'Offline';
}

interface StudentFeedProps {
  students: Student[];
}

const getStatusBadgeClass = (status: Student['status']) => {
  switch (status) {
    case 'Writing':
      return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    case 'Completed':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Offline':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    default:
      return 'bg-zinc-100 text-zinc-700 border-zinc-200';
  }
};

const formatRelativeTime = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) {
    return `${seconds}s ago`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
};

export function StudentFeed({ students }: StudentFeedProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-100">
        <h2 className="text-lg font-semibold text-zinc-900">Live Student Feed</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" aria-label="Student activity feed">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Last Synced
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-zinc-100">
            {students.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-zinc-400 text-sm">
                  No students active
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-zinc-900">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div 
                      className="text-sm text-zinc-600"
                      aria-live="polite"
                      aria-label={`Last synced ${formatRelativeTime(student.lastSynced)}`}
                    >
                      {formatRelativeTime(student.lastSynced)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(student.status)}`}
                      aria-label={`Status: ${student.status}`}
                    >
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

