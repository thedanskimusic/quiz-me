interface SystemHealthChartProps {
  healthData: number[]; // Array of health values (0-100)
}

const getBarColor = (value: number) => {
  if (value >= 80) return 'bg-emerald-500';
  if (value >= 60) return 'bg-amber-500';
  return 'bg-rose-500';
};

export function SystemHealthChart({ healthData }: SystemHealthChartProps) {
  const maxValue = 100;
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100">
      <h2 className="text-lg font-semibold text-zinc-900 mb-6">System Health (Last 15 Minutes)</h2>
      <div className="flex items-end justify-between gap-2 h-48">
        {healthData.map((value, index) => (
          <div
            key={index}
            className="flex-1 flex flex-col items-center group"
            role="img"
            aria-label={`Time slot ${index + 1}: ${value}% health`}
          >
            <div
              className={`w-full ${getBarColor(value)} rounded-t transition-all duration-500 ease-in-out min-h-[4px]`}
              style={{
                height: `${(value / maxValue) * 100}%`,
              }}
              aria-hidden="true"
            />
            <div className="mt-2 text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
              {value}%
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
        <span>15m ago</span>
        <span>Now</span>
      </div>
    </div>
  );
}

