interface SchoolSelectorProps {
  selectedSchool: string;
  onSchoolChange: (school: string) => void;
}

export function SchoolSelector({ selectedSchool, onSchoolChange }: SchoolSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="school-select" className="text-sm font-medium text-zinc-700">
        School:
      </label>
      <select
        id="school-select"
        value={selectedSchool}
        onChange={(e) => onSchoolChange(e.target.value)}
        className="px-4 py-2 bg-white border border-zinc-300 rounded-lg text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        aria-label="Select school to view data"
      >
        <option value="School A">School A</option>
        <option value="School B">School B</option>
      </select>
    </div>
  );
}

