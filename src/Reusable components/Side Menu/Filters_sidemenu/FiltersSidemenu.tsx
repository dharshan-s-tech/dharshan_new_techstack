'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FiltersSidemenuProps {
  segment: 'reports' | 'accounts';
  setSegment: (segment: 'reports' | 'accounts') => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  clearAllFilters: () => void;
  selectedLevels: string[];
  toggleLevel: (level: string) => void;
  selectedSectors: string[];
  toggleSector: (sector: string) => void;
  selectedTypes: string[];
  toggleType: (type: string) => void;
  isHindi?: boolean;
}

export default function FiltersSidemenu({
  segment,
  setSegment,
  selectedYear,
  setSelectedYear,
  clearAllFilters,
  selectedLevels,
  toggleLevel,
  selectedSectors,
  toggleSector,
  selectedTypes,
  toggleType,
  isHindi = false,
}: FiltersSidemenuProps) {
  const router = useRouter();

  // Collapsible accordion states
  const [levelOpen, setLevelOpen] = useState(true);
  const [sectorOpen, setSectorOpen] = useState(true);
  const [typeOpen, setTypeOpen] = useState(true);

  const levels = ['All', 'Union', 'States', 'Local Bodies'];
  const sectors = ['All Sectors', 'IT Audit', 'Finance', 'Tax and Duties', 'Transport & Infrastructure'];
  const types = ['All', 'ADC Reports', 'Compliance', 'Financial'];

  const datePickerRef = React.useRef<HTMLDivElement>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('Today');
  
  // Single selection
  const [selectedDay, setSelectedDay] = useState<{ year: number; month: number; day: number } | null>({ year: 2026, month: 7, day: 8 });
  
  // Range selection for 'Between'
  const [rangeStart, setRangeStart] = useState<{ year: number; month: number; day: number } | null>(null);
  const [rangeEnd, setRangeEnd] = useState<{ year: number; month: number; day: number } | null>(null);

  // Calendar 1 (Left)
  const [viewMonth1, setViewMonth1] = useState(7); // August (0-indexed)
  const [viewYear1, setViewYear1] = useState(2026);

  // Calendar 2 (Right, for Between mode)
  const [viewMonth2, setViewMonth2] = useState(8); // September (0-indexed)
  const [viewYear2, setViewYear2] = useState(2026);

  const [displayDate, setDisplayDate] = useState<string>('');

  const presets = [
    { id: 'today', labelEn: 'Today', labelHi: 'आज' },
    { id: 'yesterday', labelEn: 'Yesterday', labelHi: 'कल' },
    { id: 'this-week', labelEn: 'This Week', labelHi: 'इस सप्ताह' },
    { id: 'last-week', labelEn: 'Last Week', labelHi: 'पिछले सप्ताह' },
    { id: 'is-equal', labelEn: 'Is Equal', labelHi: 'के बराबर' },
    { id: 'before', labelEn: 'Before', labelHi: 'पहले' },
    { id: 'after', labelEn: 'After', labelHi: 'बाद' },
    { id: 'between', labelEn: 'Between', labelHi: 'के बीच' },
  ];

  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthNamesHi = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  const weekdaysEn = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const weekdaysHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

  // Click outside listener to close date picker
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync display date if selectedYear is externally cleared
  React.useEffect(() => {
    if (!selectedYear) {
      setDisplayDate('');
      setSelectedDay(null);
      setRangeStart(null);
      setRangeEnd(null);
      setSelectedPreset('');
    }
  }, [selectedYear]);

  interface DateObj {
    year: number;
    month: number;
    day: number;
  }

  const isSameDay = (a: DateObj | null, b: DateObj | null) => {
    if (!a || !b) return false;
    return a.year === b.year && a.month === b.month && a.day === b.day;
  };

  const isBetween = (d: DateObj, start: DateObj | null, end: DateObj | null) => {
    if (!start || !end) return false;
    const time = new Date(d.year, d.month, d.day).getTime();
    const startTime = new Date(start.year, start.month, start.day).getTime();
    const endTime = new Date(end.year, end.month, end.day).getTime();
    return time > startTime && time < endTime;
  };

  const getMonthGrid = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    const prev: number[] = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      prev.push(daysInPrev - i);
    }

    const current: number[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      current.push(i);
    }

    const total = prev.length + current.length <= 35 ? 35 : 42;
    const next: number[] = [];
    const remaining = total - (prev.length + current.length);
    for (let i = 1; i <= remaining; i++) {
      next.push(i);
    }

    return { prev, current, next };
  };

  const formatDateShort = (year: number, month: number, day: number) => {
    const shortMonth = isHindi ? monthNamesHi[month] : monthNamesEn[month].slice(0, 3);
    return `${shortMonth} ${day}, ${year}`;
  };

  const handleDayClick = (year: number, month: number, day: number) => {
    if (selectedPreset === 'Between') {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart({ year, month, day });
        setRangeEnd(null);
        setDisplayDate(`${formatDateShort(year, month, day)} - ...`);
      } else {
        const clickedTime = new Date(year, month, day).getTime();
        const startTime = new Date(rangeStart.year, rangeStart.month, rangeStart.day).getTime();
        if (clickedTime < startTime) {
          setRangeEnd(rangeStart);
          setRangeStart({ year, month, day });
          setDisplayDate(`${formatDateShort(year, month, day)} - ${formatDateShort(rangeStart.year, rangeStart.month, rangeStart.day)}`);
        } else {
          setRangeEnd({ year, month, day });
          setDisplayDate(`${formatDateShort(rangeStart.year, rangeStart.month, rangeStart.day)} - ${formatDateShort(year, month, day)}`);
        }
        setSelectedYear(year.toString());
      }
    } else {
      setSelectedDay({ year, month, day });
      setDisplayDate(formatDateShort(year, month, day));
      setSelectedYear(year.toString());
      setIsDatePickerOpen(false);
    }
  };

  const handleSelectPreset = (preset: typeof presets[0]) => {
    setSelectedPreset(preset.labelEn);
    if (preset.id === 'between') {
      setRangeStart({ year: 2026, month: 7, day: 8 }); // Aug 8, 2026
      setRangeEnd({ year: 2026, month: 8, day: 9 });   // Sep 9, 2026
      setSelectedDay(null);
      setViewMonth1(7);
      setViewYear1(2026);
      setViewMonth2(8);
      setViewYear2(2026);
      setDisplayDate('Aug 8, 2026 - Sep 9, 2026');
      setSelectedYear('2026');
    } else if (preset.id === 'today') {
      setViewMonth1(7);
      setViewYear1(2026);
      setSelectedDay({ year: 2026, month: 7, day: 8 });
      setRangeStart(null);
      setRangeEnd(null);
      setDisplayDate('Aug 8, 2026');
      setSelectedYear('2026');
    } else if (preset.id === 'yesterday') {
      setViewMonth1(7);
      setViewYear1(2026);
      setSelectedDay({ year: 2026, month: 7, day: 7 });
      setRangeStart(null);
      setRangeEnd(null);
      setDisplayDate('Aug 7, 2026');
      setSelectedYear('2026');
    } else {
      setRangeStart(null);
      setRangeEnd(null);
      setDisplayDate(isHindi ? preset.labelHi : preset.labelEn);
      setSelectedYear('2026');
    }
  };

  const renderCalendar = (
    year: number,
    month: number,
    onPrev: () => void,
    onNext: () => void
  ) => {
    const { prev, current, next } = getMonthGrid(year, month);

    return (
      <div className="flex-1 flex flex-col min-w-[245px]">
        {/* Header Month / Year & Prev / Next */}
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="w-7 h-7 rounded-lg border border-[#e5e7eb] flex items-center justify-center text-gray-700 hover:bg-gray-50 bg-white cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="font-bold text-[14px] text-[#111827]">
            {isHindi ? `${monthNamesHi[month]} ${year}` : `${monthNamesEn[month]} ${year}`}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="w-7 h-7 rounded-lg border border-[#e5e7eb] flex items-center justify-center text-gray-700 hover:bg-gray-50 bg-white cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 mb-2 text-center text-[12px] font-semibold">
          {(isHindi ? weekdaysHi : weekdaysEn).map((day, idx) => (
            <span
              key={day}
              className={idx === 0 || idx === 6 ? 'text-[#751639]' : 'text-[#6b7280]'}
            >
              {day}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 text-center text-[12.5px]">
          {prev.map((d) => (
            <div key={`prev-${d}`} className="h-7 w-full flex items-center justify-center my-0.5">
              <span className="text-[#9ca3af] py-1 select-none text-[12.5px]">{d}</span>
            </div>
          ))}
          {current.map((d) => {
            const dateObj = { year, month, day: d };
            const isStart = isSameDay(dateObj, rangeStart);
            const isEnd = isSameDay(dateObj, rangeEnd);
            const isSingle = !rangeStart && isSameDay(dateObj, selectedDay);
            const inBetween = isBetween(dateObj, rangeStart, rangeEnd);

            if (isStart || isEnd || isSingle) {
              return (
                <div
                  key={`curr-${d}`}
                  className="h-7 w-full flex items-center justify-center my-0.5"
                >
                  <button
                    type="button"
                    onClick={() => handleDayClick(year, month, d)}
                    className="w-7 h-7 mx-auto rounded-full bg-[#751639] text-white font-bold shadow-sm flex items-center justify-center cursor-pointer border-none text-[12.5px]"
                  >
                    {d}
                  </button>
                </div>
              );
            }

            if (inBetween) {
              const dayOfWeek = new Date(year, month, d).getDay();
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const isRowStart = dayOfWeek === 0;
              const isRowEnd = dayOfWeek === 6;
              const isMonthStart = d === 1;
              const isMonthEnd = d === daysInMonth;
              const isDayAfterRangeStart =
                rangeStart &&
                rangeStart.year === year &&
                rangeStart.month === month &&
                d === rangeStart.day + 1;
              const isDayBeforeRangeEnd =
                rangeEnd &&
                rangeEnd.year === year &&
                rangeEnd.month === month &&
                d === rangeEnd.day - 1;

              const hasRoundedLeft = isRowStart || isMonthStart || isDayAfterRangeStart;
              const hasRoundedRight = isRowEnd || isMonthEnd || isDayBeforeRangeEnd;

              const roundClass =
                hasRoundedLeft && hasRoundedRight
                  ? 'rounded-md'
                  : hasRoundedLeft
                  ? 'rounded-l-md'
                  : hasRoundedRight
                  ? 'rounded-r-md'
                  : '';

              return (
                <div
                  key={`curr-${d}`}
                  className={`h-7 w-full bg-[#fdf2f4] flex items-center justify-center my-0.5 ${roundClass}`}
                >
                  <button
                    type="button"
                    onClick={() => handleDayClick(year, month, d)}
                    className="w-full h-full text-[#751639] font-bold flex items-center justify-center cursor-pointer border-none bg-transparent hover:opacity-80 text-[12.5px]"
                  >
                    {d}
                  </button>
                </div>
              );
            }

            return (
              <div key={`curr-${d}`} className="h-7 w-full flex items-center justify-center my-0.5">
                <button
                  type="button"
                  onClick={() => handleDayClick(year, month, d)}
                  className="w-7 h-7 mx-auto rounded-full text-[#111827] font-medium hover:bg-gray-100 flex items-center justify-center cursor-pointer border-none bg-transparent text-[12.5px]"
                >
                  {d}
                </button>
              </div>
            );
          })}
          {next.map((d) => (
            <div key={`next-${d}`} className="h-7 w-full flex items-center justify-center my-0.5">
              <span className="text-[#9ca3af] py-1 select-none text-[12.5px]">{d}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex flex-col"
      style={{ width: '255px', minWidth: '255px', maxWidth: '255px', minHeight: '920px', boxSizing: 'border-box' }}
    >
      {/* Title */}
      <h2 className="text-[18px] font-bold text-[#111827] m-0 mb-3.5 tracking-tight">
        {isHindi ? 'फ़िल्टर' : 'Filters'}
      </h2>

      <div className="border-t border-[#e5e7eb] my-3"></div>

      {/* Segmented Control [ Reports | Accounts ] */}
      <div className="flex bg-[#f3f4f6] p-1 rounded-md mb-4 gap-1">
        <button
          type="button"
          className={`flex-1 py-2 px-3 text-[12px] font-semibold rounded text-center transition-all cursor-pointer border-none ${
            segment === 'reports'
              ? 'bg-[#751639] text-white shadow-sm'
              : 'bg-transparent text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setSegment('reports')}
        >
          {isHindi ? 'रिपोर्ट' : 'Reports'}
        </button>
        <button
          type="button"
          className={`flex-1 py-2 px-3 text-[12px] font-semibold rounded text-center transition-all cursor-pointer border-none ${
            segment === 'accounts'
              ? 'bg-[#751639] text-white shadow-sm'
              : 'bg-transparent text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => {
            setSegment('accounts');
            router.push('/Reports/accounts');
          }}
        >
          {isHindi ? 'लेखा' : 'Accounts'}
        </button>
      </div>

      {/* Select Date with Custom Popover */}
      <div className="mb-2 relative" ref={datePickerRef}>
        <label className="block text-[12px] font-semibold text-[#374151] mb-2">
          {isHindi ? 'तारीख चुनें' : 'Select Date'}
        </label>
        
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          className={`w-full h-9 px-3 text-[12px] bg-white border ${
            isDatePickerOpen ? 'border-[#751639] ring-1 ring-[#751639]' : 'border-[#d1d5db]'
          } rounded flex items-center justify-between cursor-pointer transition-colors`}
        >
          <span className={displayDate ? 'text-gray-900 font-medium' : 'text-gray-500'}>
            {displayDate || (isHindi ? 'तारीख चुनें' : 'Select date')}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDatePickerOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Date Picker Popover */}
        {isDatePickerOpen && (
          <div
            className="absolute top-[calc(100%+6px)] left-0 z-50 bg-white rounded-2xl border border-[#e5e7eb] shadow-[0_12px_36px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06)] p-5 flex flex-row transition-all duration-200"
            style={{ width: selectedPreset === 'Between' ? '700px' : '440px' }}
          >
            {/* Left Column: Quick Presets */}
            <div className="w-[125px] flex flex-col gap-1 pr-4 border-r border-[#e5e7eb] shrink-0">
              {presets.map((preset) => {
                const isSelected = selectedPreset === preset.labelEn;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`w-full text-left py-1.5 px-3 text-[13px] rounded-lg transition-colors cursor-pointer border-none ${
                      isSelected
                        ? 'bg-[#fdf2f4] text-[#751639] font-bold'
                        : 'bg-transparent text-[#374151] font-semibold hover:bg-gray-50'
                    }`}
                  >
                    {isHindi ? preset.labelHi : preset.labelEn}
                  </button>
                );
              })}
            </div>

            {/* Right Column: Calendars */}
            <div className="flex-1 pl-5 flex flex-row">
              {/* Calendar 1 */}
              <div className={`flex-1 flex flex-col ${selectedPreset === 'Between' ? 'pr-5 border-r border-[#e5e7eb]' : ''}`}>
                {renderCalendar(
                  viewYear1,
                  viewMonth1,
                  () => {
                    if (viewMonth1 === 0) {
                      setViewMonth1(11);
                      setViewYear1((y) => y - 1);
                    } else {
                      setViewMonth1((m) => m - 1);
                    }
                  },
                  () => {
                    if (viewMonth1 === 11) {
                      setViewMonth1(0);
                      setViewYear1((y) => y + 1);
                    } else {
                      setViewMonth1((m) => m + 1);
                    }
                  }
                )}
              </div>

              {/* Calendar 2 (shown in Between mode) */}
              {selectedPreset === 'Between' && (
                <div className="flex-1 pl-5 flex flex-col">
                  {renderCalendar(
                    viewYear2,
                    viewMonth2,
                    () => {
                      if (viewMonth2 === 0) {
                        setViewMonth2(11);
                        setViewYear2((y) => y - 1);
                      } else {
                        setViewMonth2((m) => m - 1);
                      }
                    },
                    () => {
                      if (viewMonth2 === 11) {
                        setViewMonth2(0);
                        setViewYear2((y) => y + 1);
                      } else {
                        setViewMonth2((m) => m + 1);
                      }
                    }
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Clear All under Select Date */}
      <div className="flex justify-end mt-2 mb-3">
        <button
          type="button"
          onClick={() => {
            setDisplayDate('');
            setSelectedDay(null);
            setRangeStart(null);
            setRangeEnd(null);
            setSelectedPreset('');
            setIsDatePickerOpen(false);
            clearAllFilters();
          }}
          className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#0284c7] hover:underline bg-transparent border-none cursor-pointer p-0"
        >
          <span>✕</span>
          <span>{isHindi ? 'सभी साफ़ करें' : 'Clear All'}</span>
        </button>
      </div>

      <div className="border-t border-[#e5e7eb] my-3"></div>

      {/* Accordion 1: Administrative Level */}
      <div className="mb-3">
        <button
          type="button"
          onClick={() => setLevelOpen(!levelOpen)}
          className="w-full flex items-center justify-between py-1 bg-transparent border-none cursor-pointer text-left"
        >
          <span className="text-[13px] font-bold text-[#1f2937]">
            {isHindi ? 'प्रशासनिक स्तर' : 'Administrative Level'}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${levelOpen ? '' : 'rotate-180'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        {levelOpen && (
          <div className="mt-3 space-y-2.5">
            {levels.map((lvl) => {
              const isChecked = selectedLevels.includes(lvl);
              return (
                <label key={lvl} className="flex items-center gap-2.5 text-[12px] text-[#374151] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleLevel(lvl)}
                    className="w-4 h-4 rounded text-[#751639] accent-[#751639] cursor-pointer"
                  />
                  <span>{lvl}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-[#e5e7eb] my-3"></div>

      {/* Accordion 2: Sector */}
      <div className="mb-3">
        <button
          type="button"
          onClick={() => setSectorOpen(!sectorOpen)}
          className="w-full flex items-center justify-between py-1 bg-transparent border-none cursor-pointer text-left"
        >
          <span className="text-[13px] font-bold text-[#1f2937]">
            {isHindi ? 'क्षेत्र' : 'Sector'}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${sectorOpen ? '' : 'rotate-180'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        {sectorOpen && (
          <div className="mt-3 space-y-2.5 max-h-44 overflow-y-scroll filter-scrollbar pr-2">
            {sectors.map((sec) => {
              const isChecked = selectedSectors.includes(sec);
              return (
                <label key={sec} className="flex items-center gap-2.5 text-[12px] text-[#374151] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSector(sec)}
                    className="w-4 h-4 rounded text-[#751639] accent-[#751639] cursor-pointer"
                  />
                  <span>{sec}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-[#e5e7eb] my-3"></div>

      {/* Accordion 3: Report Type */}
      <div className="mb-2">
        <button
          type="button"
          onClick={() => setTypeOpen(!typeOpen)}
          className="w-full flex items-center justify-between py-1 bg-transparent border-none cursor-pointer text-left"
        >
          <span className="text-[13px] font-bold text-[#1f2937]">
            {isHindi ? 'रिपोर्ट प्रकार' : 'Report Type'}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${typeOpen ? '' : 'rotate-180'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        {typeOpen && (
          <div className="mt-3 space-y-2.5 max-h-36 overflow-y-scroll filter-scrollbar pr-2">
            {types.map((tp) => {
              const isChecked = selectedTypes.includes(tp);
              return (
                <label key={tp} className="flex items-center gap-2.5 text-[12px] text-[#374151] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleType(tp)}
                    className="w-4 h-4 rounded text-[#751639] accent-[#751639] cursor-pointer"
                  />
                  <span>{tp}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
