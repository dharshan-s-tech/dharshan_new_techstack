import React from 'react';

interface FiltersSidemenuProps {
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  selectedSector: string;
  setSelectedSector: (sector: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
}

export default function FiltersSidemenu({
  selectedLevel,
  setSelectedLevel,
  selectedSector,
  setSelectedSector,
  selectedType,
  setSelectedType,
}: FiltersSidemenuProps) {
  const levels = ['All', 'Union', 'States', 'Local Bodies'];
  const sectors = ['All', 'Finance', 'Social Welfare', 'Transport', 'Defence', 'Environment'];
  const types = ['All', 'Compliance', 'Performance', 'Financial'];

  return (
    <div className="bg-white border border-[#d7d7d7] rounded-xl p-5 shadow-sm space-y-6">
      <div>
        <h3 className="text-sm font-bold text-[#2a2a2a] border-b border-[#e6e6e6] pb-2 mb-3">
          Administrative Level
        </h3>
        <div className="space-y-2">
          {levels.map((lvl) => (
            <label key={lvl} className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
              <input
                type="radio"
                name="level"
                checked={selectedLevel === lvl}
                onChange={() => setSelectedLevel(lvl)}
                className="text-[#0a3d30] focus:ring-[#0a3d30]"
              />
              {lvl}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-[#2a2a2a] border-b border-[#e6e6e6] pb-2 mb-3">
          Audit Sector
        </h3>
        <div className="space-y-2">
          {sectors.map((sec) => (
            <label key={sec} className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
              <input
                type="radio"
                name="sector"
                checked={selectedSector === sec}
                onChange={() => setSelectedSector(sec)}
                className="text-[#0a3d30] focus:ring-[#0a3d30]"
              />
              {sec}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-[#2a2a2a] border-b border-[#e6e6e6] pb-2 mb-3">
          Report Type
        </h3>
        <div className="space-y-2">
          {types.map((tp) => (
            <label key={tp} className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
              <input
                type="radio"
                name="type"
                checked={selectedType === tp}
                onChange={() => setSelectedType(tp)}
                className="text-[#0a3d30] focus:ring-[#0a3d30]"
              />
              {tp}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
