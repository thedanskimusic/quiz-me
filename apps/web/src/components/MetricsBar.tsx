interface MetricsBarProps {
  totalStudents: number;
  avgLatency: number;
  queueDepth: number;
}

export function MetricsBar({ totalStudents, avgLatency, queueDepth }: MetricsBarProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 50) return 'text-emerald-600';
    if (latency < 100) return 'text-amber-600';
    return 'text-rose-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Students Active */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100">
        <div className="text-sm font-medium text-zinc-500 mb-2">Total Students Active</div>
        <div 
          className="text-3xl font-bold text-zinc-900 transition-all duration-300"
          aria-live="polite"
          aria-label={`${formatNumber(totalStudents)} students active`}
        >
          {formatNumber(totalStudents)}
        </div>
      </div>

      {/* Average Sync Latency */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100">
        <div className="text-sm font-medium text-zinc-500 mb-2">Average Sync Latency</div>
        <div 
          className={`text-3xl font-bold transition-all duration-300 ${getLatencyColor(avgLatency)}`}
          aria-live="polite"
          aria-label={`Average sync latency ${avgLatency} milliseconds`}
        >
          {avgLatency}ms
        </div>
      </div>

      {/* Messages in Pub/Sub Queue */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100">
        <div className="text-sm font-medium text-zinc-500 mb-2">Messages in Pub/Sub Queue</div>
        <div 
          className="text-3xl font-bold text-zinc-900 transition-all duration-300"
          aria-live="polite"
          aria-label={`${formatNumber(queueDepth)} messages in queue`}
        >
          {formatNumber(queueDepth)}
        </div>
      </div>
    </div>
  );
}

