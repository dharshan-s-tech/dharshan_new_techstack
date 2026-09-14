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
  sectorsList?: string[];
  typesList?: string[];
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
  sectorsList,
  typesList,
}: FiltersSidemenuProps) {
  const router = useRouter();

  // Collapsible accordion states
  const [levelOpen, setLevelOpen] = useState(true);
  const [sectorOpen, setSectorOpen] = useState(true);
  const [typeOpen, setTypeOpen] = useState(true);

  const levels = ['All', 'Union', 'States', 'Local Bodies'];
  const sectors = sectorsList && sectorsList.length > 0
    ? sectorsList
    : ['All Sectors', 'IT Audit', 'Finance', 'Tax and Duties', 'Transport & Infrastructure', 'Education, Health & Family Welfare', 'Environment and Sustainable Development', 'Defence and National Security', 'Commercial', 'Agriculture and Rural Development'];
  const types = typesList && typesList.length > 0
    ? typesList
    : ['All', 'ADC reports', 'Compliance', 'Financial', 'Performance'];

  const sectorListRef = React.useRef<HTMLDivElement>(null);
  const [sectorScrollRatio, setSectorScrollRatio] = useState(0);

  const handleSectorScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll > 0) {
      setSectorScrollRatio(el.scrollTop / maxScroll);
    } else {
      setSectorScrollRatio(0);
    }
  };

  const handleScrollbarTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectorListRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const maxScroll = sectorListRef.current.scrollHeight - sectorListRef.current.clientHeight;
    const ratio = Math.max(0, Math.min(1, (clickY - 25) / (221 - 50)));
    sectorListRef.current.scrollTop = ratio * maxScroll;
  };

  const typeListRef = React.useRef<HTMLDivElement>(null);
  const [typeScrollRatio, setTypeScrollRatio] = useState(0);

  const handleTypeScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll > 0) {
      setTypeScrollRatio(el.scrollTop / maxScroll);
    } else {
      setTypeScrollRatio(0);
    }
  };

  const handleTypeScrollbarTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!typeListRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const maxScroll = typeListRef.current.scrollHeight - typeListRef.current.clientHeight;
    const ratio = Math.max(0, Math.min(1, (clickY - 25) / (176 - 50)));
    typeListRef.current.scrollTop = ratio * maxScroll;
  };

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

    const total = 42;
    const next: number[] = [];
    const remaining = total - (prev.length + current.length);
    for (let i = 1; i <= remaining; i++) {
      next.push(i);
    }

    const allCells: Array<{ type: 'prev' | 'current' | 'next'; day: number }> = [
      ...prev.map((d) => ({ type: 'prev' as const, day: d })),
      ...current.map((d) => ({ type: 'current' as const, day: d })),
      ...next.map((d) => ({ type: 'next' as const, day: d })),
    ];

    const rows: Array<Array<{ type: 'prev' | 'current' | 'next'; day: number }>> = [];
    for (let i = 0; i < allCells.length; i += 7) {
      rows.push(allCells.slice(i, i + 7));
    }

    return { prev, current, next, rows };
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
    const { rows } = getMonthGrid(year, month);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0px',
          gap: '16px',
          width: '336px',
          height: '360px',
          flex: 'none',
          flexGrow: 0,
        }}
      >
        {/* Calendar Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0px',
            width: '336px',
            height: '36px',
            flex: 'none',
            order: 0,
            alignSelf: 'stretch',
            flexGrow: 0,
          }}
        >
          {/* Nav Prev Month */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '8px',
              width: '36px',
              height: '36px',
              background: '#FFFFFF',
              border: '1px solid #E5E5EA',
              borderRadius: '8px',
              cursor: 'pointer',
              flex: 'none',
              order: 0,
              flexGrow: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E2E31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* August 2026 Title */}
          <span
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '22px',
              color: '#2E2E31',
              flex: 'none',
              order: 1,
              flexGrow: 0,
              textAlign: 'center',
            }}
          >
            {isHindi ? `${monthNamesHi[month]} ${year}` : `${monthNamesEn[month]} ${year}`}
          </span>

          {/* Nav Next Month */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '8px',
              width: '36px',
              height: '36px',
              background: '#FFFFFF',
              border: '1px solid #E5E5EA',
              borderRadius: '8px',
              cursor: 'pointer',
              flex: 'none',
              order: 2,
              flexGrow: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E2E31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Weekday Headers */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '0px',
            width: '336px',
            height: '32px',
            flex: 'none',
            order: 1,
            alignSelf: 'stretch',
            flexGrow: 0,
          }}
        >
          {(isHindi ? weekdaysHi : weekdaysEn).map((day, idx) => (
            <div
              key={day}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0px',
                width: '48px',
                height: '32px',
                flex: 'none',
                order: idx,
                flexGrow: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '13px',
                  lineHeight: '18px',
                  textAlign: 'center',
                  color: idx === 0 || idx === 6 ? '#751639' : '#8A8A8F',
                }}
              >
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Month Grid */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '0px',
            gap: '4px',
            width: '336px',
            height: '260px',
            flex: 'none',
            order: 2,
            alignSelf: 'stretch',
            flexGrow: 0,
          }}
        >
          {rows.map((row, rowIdx) => (
            <div
              key={`row-${rowIdx}`}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: '0px',
                width: '336px',
                height: '40px',
                flex: 'none',
                order: rowIdx,
                alignSelf: 'stretch',
                flexGrow: 0,
              }}
            >
              {row.map((cell, cellIdx) => {
                const cellYear = cell.type === 'prev' ? (month === 0 ? year - 1 : year) : cell.type === 'next' ? (month === 11 ? year + 1 : year) : year;
                const cellMonth = cell.type === 'prev' ? (month === 0 ? 11 : month - 1) : cell.type === 'next' ? (month === 11 ? 0 : month + 1) : month;
                const dateObj = { year: cellYear, month: cellMonth, day: cell.day };
                const isSelected = !rangeStart && isSameDay(dateObj, selectedDay);
                const isStart = isSameDay(dateObj, rangeStart);
                const isEnd = isSameDay(dateObj, rangeEnd);
                const inBetween = isBetween(dateObj, rangeStart, rangeEnd);

                return (
                  <div
                    key={`cell-${rowIdx}-${cellIdx}`}
                    onClick={() => handleDayClick(cellYear, cellMonth, cell.day)}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '0px',
                      width: '48px',
                      height: '40px',
                      flex: 'none',
                      order: cellIdx,
                      flexGrow: 0,
                      cursor: 'pointer',
                      position: 'relative',
                      background: inBetween
                        ? 'rgba(117, 22, 57, 0.08)'
                        : (isStart && rangeEnd)
                        ? 'rgba(117, 22, 57, 0.08)'
                        : (isEnd && rangeStart)
                        ? 'rgba(117, 22, 57, 0.08)'
                        : 'transparent',
                      borderRadius: (isStart && rangeEnd)
                        ? '20px 0px 0px 20px'
                        : (isEnd && rangeStart)
                        ? '0px 20px 20px 0px'
                        : '0px',
                    }}
                  >
                    {isSelected || isStart || isEnd ? (
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: '#751639',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontFamily: "'Noto Sans', sans-serif",
                          fontStyle: 'normal',
                          fontWeight: 700,
                          fontSize: '14px',
                          lineHeight: '19px',
                          textAlign: 'center',
                        }}
                      >
                        {cell.day}
                      </div>
                    ) : (
                      <span
                        style={{
                          fontFamily: "'Noto Sans', sans-serif",
                          fontStyle: 'normal',
                          fontWeight: inBetween ? 600 : 500,
                          fontSize: '14px',
                          lineHeight: '19px',
                          textAlign: 'center',
                          color: cell.type === 'current' ? (inBetween ? '#751639' : '#2E2E31') : '#8E8E93',
                        }}
                      >
                        {cell.day}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className="bg-white border border-[#E6E6E6] rounded-[8px] shadow-[4px_4px_20px_rgba(0,0,0,0.04)] flex flex-col"
      style={{
        position: 'relative',
        width: '320px',
        minWidth: '320px',
        maxWidth: '320px',
        height: '1043px',
        minHeight: '1043px',
        paddingTop: '24px',
        paddingBottom: '24px',
        paddingLeft: '24px',
        paddingRight: '24px',
        gap: '10px',
        borderRadius: '8px',
        borderWidth: '1px',
        borderColor: '#E6E6E6',
        boxSizing: 'border-box',
        opacity: 1,
        transform: 'rotate(0deg)',
        zIndex: isDatePickerOpen ? 1000 : 1
      }}
    >
      {/* Title */}
      <h2
        className="m-0 font-['Noto_Sans'] font-semibold text-[20px] leading-[27px] text-[#000000]"
        style={{
          width: '272px',
          height: '27px',
          fontFamily: "'Noto Sans', sans-serif",
          fontStyle: 'normal',
          fontWeight: 600,
          fontSize: '20px',
          lineHeight: '27px',
          color: '#000000',
          flex: 'none',
          alignSelf: 'stretch',
          flexGrow: 0,
        }}
      >
        {isHindi ? 'फ़िल्टर' : 'Filters'}
      </h2>

      {/* Line 1586 */}
      <div
        className="w-[272px] border-t border-[#D7D7D7]"
        style={{
          width: '272px',
          height: '0px',
          borderTop: '1px solid #D7D7D7',
          flex: 'none',
          alignSelf: 'stretch',
          flexGrow: 0,
          boxSizing: 'border-box',
          marginTop: '24px',
          marginBottom: '24px',
          opacity: 1,
          transform: 'rotate(0deg)'
        }}
      />

      {/* Segmented Control [ Reports | Accounts ] */}
      <div 
        className="w-[272px] h-[32px] bg-[#F5F4F7] border border-[#EDEDED] rounded-[8px] p-[2px] flex items-center box-border"
        style={{ width: '272px', height: '32px', boxSizing: 'border-box', flex: 'none', alignSelf: 'stretch', flexGrow: 0 }}
      >
        <button
          type="button"
          className={`flex-1 h-[28px] text-[14px] leading-[19px] rounded-[8px] flex items-center justify-center transition-all cursor-pointer border-none font-['Noto_Sans'] ${
            segment === 'reports'
              ? 'bg-[#751639] text-[#FFFFFF] font-semibold shadow-[0px_1px_10px_1px_rgba(0,0,0,0.03)]'
              : 'bg-transparent text-[#565656] font-normal hover:text-gray-900'
          }`}
          onClick={() => setSegment('reports')}
        >
          {isHindi ? 'रिपोर्ट' : 'Reports'}
        </button>
        <button
          type="button"
          className={`flex-1 h-[28px] text-[14px] leading-[19px] rounded-[8px] flex items-center justify-center transition-all cursor-pointer border-none font-['Noto_Sans'] ${
            segment === 'accounts'
              ? 'bg-[#751639] text-[#FFFFFF] font-semibold shadow-[0px_1px_10px_1px_rgba(0,0,0,0.03)]'
              : 'bg-transparent text-[#565656] font-normal hover:text-gray-900'
          }`}
          onClick={() => {
            setSegment('accounts');
            router.push('/Reports/accounts');
          }}
        >
          {isHindi ? 'लेखा' : 'Accounts'}
        </button>
      </div>

      {/* Select Year with Custom Popover */}
      <div
        ref={datePickerRef}
        className="relative"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0px',
          gap: '10px',
          width: '272px',
          height: '65px',
          boxSizing: 'border-box',
          flex: 'none',
          alignSelf: 'stretch',
          flexGrow: 0,
          marginTop: '14px',
          opacity: 1,
          transform: 'rotate(0deg)',
          zIndex: isDatePickerOpen ? 1000 : 1
        }}
      >
        <label
          style={{
            width: '66px',
            height: '15px',
            fontFamily: "'Inter', sans-serif",
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '12px',
            lineHeight: '15px',
            textTransform: 'capitalize',
            color: '#2E2E31',
            flex: 'none',
            order: 0,
            flexGrow: 0,
            display: 'block'
          }}
        >
          {isHindi ? 'वर्ष चुनें' : 'Select Year'}
        </label>
        
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            width: '272px',
            height: '40px',
            background: '#FFFFFF',
            border: isDatePickerOpen ? '1px solid #751639' : '1px solid #D7D7D7',
            borderRadius: '4px',
            flex: 'none',
            order: 1,
            alignSelf: 'stretch',
            flexGrow: 0,
            cursor: 'pointer'
          }}
        >
          <span
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '12px',
              lineHeight: '16px',
              color: displayDate ? '#2E2E31' : '#818181'
            }}
          >
            {displayDate || (isHindi ? 'वर्ष चुनें' : 'Select year')}
          </span>
          <svg
            className={`transition-transform duration-200 ${isDatePickerOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="#8A8A8F"
            viewBox="0 0 24 24"
            style={{
              width: '16px',
              height: '16px',
              flex: 'none',
              order: 1,
              flexGrow: 0
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Date Picker Popover */}
        {isDatePickerOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              padding: '24px',
              gap: '16px',
              position: 'absolute',
              width: selectedPreset === 'Between' ? '904px' : '536px',
              height: '408px',
              left: '0px',
              top: 'calc(100% + 6px)',
              background: '#FFFFFF',
              border: '1px solid #E5E5EA',
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.0627451)',
              borderRadius: '4px',
              zIndex: 99999,
            }}
          >
            {/* Preset List */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '8px',
                width: '120px',
                height: '344px',
                flex: 'none',
                flexGrow: 0,
              }}
            >
              {presets.map((preset) => {
                const isSelected = selectedPreset === preset.labelEn;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '8px 12px',
                      width: '120px',
                      height: '36px',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(117, 22, 57, 0.0784314)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                      flex: 'none',
                      alignSelf: 'stretch',
                      flexGrow: 0,
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Noto Sans', sans-serif",
                        fontStyle: 'normal',
                        fontWeight: isSelected ? 700 : 600,
                        fontSize: '14px',
                        lineHeight: '19px',
                        color: isSelected ? '#751639' : '#2E2E31',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isHindi ? preset.labelHi : preset.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Line (vertical divider between Presets and Calendar 1) */}
            <div
              style={{
                boxSizing: 'border-box',
                width: '0px',
                height: '360px',
                borderLeft: '1px solid #E5E5EA',
                flex: 'none',
                flexGrow: 0,
              }}
            />

            {/* Calendar 1 */}
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

            {/* Second Calendar with Divider in between (if Between mode) */}
            {selectedPreset === 'Between' && (
              <>
                {/* Line (vertical divider between Calendar 1 and Calendar 2) */}
                <div
                  style={{
                    boxSizing: 'border-box',
                    width: '0px',
                    height: '360px',
                    borderLeft: '1px solid #E5E5EA',
                    flex: 'none',
                    flexGrow: 0,
                  }}
                />
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
              </>
            )}
          </div>
        )}
      </div>

      {/* Clear All when filters active */}
      {(displayDate || selectedLevels.length > 0 || selectedSectors.length > 0 || selectedTypes.length > 0) && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '0px',
            gap: '10px',
            width: '272px',
            height: '16px',
            boxSizing: 'border-box',
            flex: 'none',
            alignSelf: 'stretch',
            flexGrow: 0,
            marginTop: '10px',
            marginBottom: '10px',
            opacity: 1,
            transform: 'rotate(0deg)'
          }}
        >
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
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '0px',
              gap: '6px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              height: '16px',
              flex: 'none',
              flexGrow: 0
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '14px', height: '14px', flex: 'none' }}
            >
              <path
                d="M4 4L12 12M12 4L4 12"
                stroke="#0D61AE"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '16px',
                textDecorationLine: 'underline',
                color: '#0D61AE'
              }}
            >
              {isHindi ? 'सभी साफ़ करें' : 'Clear All'}
            </span>
          </button>
        </div>
      )}

      {/* Accordion 1: Administrative Level */}
      <div className="w-[272px] flex flex-col">
        <button
          type="button"
          onClick={() => setLevelOpen(!levelOpen)}
          className="w-full flex items-center justify-between py-0 bg-transparent border-none cursor-pointer text-left"
        >
          <span className="text-[16px] font-semibold text-[#111827] font-['Noto_Sans'] leading-[22px]">
            {isHindi ? 'प्रशासनिक स्तर' : 'Administrative Level'}
          </span>
          <svg
            className={`w-4 h-4 text-[#111827] transition-transform ${levelOpen ? '' : 'rotate-180'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* Divider line directly below the title */}
        <div
          className="w-[272px] border-t border-[#D7D7D7] mt-3"
          style={{
            width: '272px',
            height: '0px',
            borderTop: '1px solid #D7D7D7',
            boxSizing: 'border-box'
          }}
        />

        {levelOpen && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '24px',
              width: '240px',
              boxSizing: 'border-box',
              marginTop: '16px'
            }}
          >
            {levels.map((lvl) => {
              const isChecked = selectedLevels.includes(lvl);
              return (
                <label
                  key={lvl}
                  onClick={() => toggleLevel(lvl)}
                  className="flex items-center gap-2 cursor-pointer select-none"
                  style={{
                    width: '240px',
                    height: '22px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '8px',
                    boxSizing: 'border-box'
                  }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      minWidth: '16px',
                      minHeight: '16px',
                      borderRadius: '2px',
                      backgroundColor: isChecked ? '#751639' : '#FFFFFF',
                      border: isChecked ? 'none' : '1px solid #717171',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    {isChecked && (
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="#FFFFFF"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    style={{
                      width: '216px',
                      height: '22px',
                      fontFamily: "'Noto Sans', sans-serif",
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '22px',
                      color: '#2E2E31',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {lvl}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion 2: Sector */}
      <div
        className="flex flex-col"
        style={{
          position: 'relative',
          width: '272px',
          height: sectorOpen ? '275px' : '38px',
          padding: '0px',
          gap: '16px',
          isolation: 'isolate',
          flex: 'none',
          alignSelf: 'stretch',
          flexGrow: 0,
          boxSizing: 'border-box'
        }}
      >
        <button
          type="button"
          onClick={() => setSectorOpen(!sectorOpen)}
          className="w-full flex items-center justify-between bg-transparent border-none cursor-pointer text-left"
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0px',
            width: '272px',
            height: '38px',
            borderBottom: '1px solid #D7D7D7',
            flex: 'none',
            order: 0,
            alignSelf: 'stretch',
            flexGrow: 0,
            zIndex: 0
          }}
        >
          <span
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '22px',
              color: '#2E2E31',
              flex: 'none',
              order: 0,
              flexGrow: 0
            }}
          >
            {isHindi ? 'क्षेत्र' : 'Sector'}
          </span>
          <div
            style={{
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
              order: 1,
              flexGrow: 0,
              marginRight: '-2px'
            }}
          >
            <svg
              className={`w-4 h-4 text-[#2A2A2A] transition-transform duration-200 ${sectorOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{
                width: '16px',
                height: '16px'
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {sectorOpen && (
          <>
            {/* Scrollbar Track & Thumb vertically aligned to Chevron arrow */}
            <div
              onClick={handleScrollbarTrackClick}
              style={{
                position: 'absolute',
                width: '4px',
                height: '221px',
                left: '264px',
                top: '54px',
                flex: 'none',
                order: 1,
                flexGrow: 0,
                zIndex: 1,
                cursor: 'pointer',
                opacity: 1,
                transform: 'rotate(0deg)'
              }}
            >
              {/* Scrollbar Track */}
              <div
                style={{
                  position: 'absolute',
                  width: '4px',
                  height: '221px',
                  left: '0px',
                  top: '0px',
                  backgroundColor: '#EBEBEB',
                  borderRadius: '2px'
                }}
              />

              {/* Scrollbar Thumb */}
              <div
                style={{
                  position: 'absolute',
                  width: '4px',
                  height: '50px',
                  left: '0px',
                  top: `${sectorScrollRatio * (221 - 50)}px`,
                  backgroundColor: '#BFBFBF',
                  borderRadius: '2px',
                  transition: 'top 0.05s ease-out'
                }}
              />
            </div>

            {/* Checkboxes List */}
            <div
              ref={sectorListRef}
              onScroll={handleSectorScroll}
              className="no-scrollbar"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px 0px 16px',
                gap: '24px',
                width: '240px',
                height: '221px',
                boxSizing: 'border-box',
                flex: 'none',
                order: 2,
                flexGrow: 0,
                zIndex: 2,
                overflowX: 'hidden',
                overflowY: 'auto'
              }}
            >
              {sectors.map((sec, idx) => {
                const isChecked = selectedSectors.includes(sec);
                return (
                  <label
                    key={sec}
                    onClick={() => toggleSector(sec)}
                    className="flex items-center gap-2 cursor-pointer select-none"
                    style={{
                      width: '100%',
                      maxWidth: '240px',
                      minHeight: '22px',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '8px',
                      boxSizing: 'border-box',
                      flex: 'none',
                      order: idx,
                      alignSelf: 'stretch',
                      flexGrow: 0
                    }}
                  >
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        minWidth: '16px',
                        minHeight: '16px',
                        borderRadius: '2px',
                        backgroundColor: isChecked ? '#751639' : '#FFFFFF',
                        border: isChecked ? 'none' : '1px solid #565656',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                        cursor: 'pointer',
                        flexShrink: 0,
                        flex: 'none',
                        order: 0,
                        flexGrow: 0
                      }}
                    >
                      {isChecked && (
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="#FFFFFF"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      style={{
                        width: '216px',
                        fontFamily: "'Noto Sans', sans-serif",
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '22px',
                        color: '#2E2E31',
                        display: 'flex',
                        alignItems: 'center',
                        flex: 'none',
                        order: 1,
                        flexGrow: 1,
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word'
                      }}
                    >
                      {sec}
                    </span>
                  </label>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Accordion 3: Report Type */}
      <div
        className="flex flex-col"
        style={{
          position: 'relative',
          width: '272px',
          height: typeOpen ? '230px' : '38px',
          padding: '0px',
          gap: '16px',
          isolation: 'isolate',
          flex: 'none',
          alignSelf: 'stretch',
          flexGrow: 0,
          boxSizing: 'border-box'
        }}
      >
        <button
          type="button"
          onClick={() => setTypeOpen(!typeOpen)}
          className="w-full flex items-center justify-between bg-transparent border-none cursor-pointer text-left"
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0px',
            gap: '96px',
            width: '272px',
            height: '38px',
            borderBottom: '1px solid #D7D7D7',
            flex: 'none',
            order: 0,
            alignSelf: 'stretch',
            flexGrow: 0,
            zIndex: 0
          }}
        >
          <span
            style={{
              width: '97px',
              height: '22px',
              fontFamily: "'Noto Sans', sans-serif",
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '22px',
              color: '#2E2E31',
              flex: 'none',
              order: 0,
              flexGrow: 0,
              whiteSpace: 'nowrap'
            }}
          >
            {isHindi ? 'रिपोर्ट प्रकार' : 'Report Type'}
          </span>
          <div
            style={{
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
              order: 1,
              flexGrow: 0,
              marginRight: '-2px'
            }}
          >
            <svg
              className={`w-4 h-4 text-[#2A2A2A] transition-transform duration-200 ${typeOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{
                width: '16px',
                height: '16px'
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {typeOpen && (
          <>
            {/* Scrollbar Track & Thumb vertically aligned to Chevron arrow */}
            <div
              onClick={handleTypeScrollbarTrackClick}
              style={{
                position: 'absolute',
                width: '4px',
                height: '176px',
                left: '264px',
                top: '54px',
                flex: 'none',
                order: 1,
                flexGrow: 0,
                zIndex: 1,
                cursor: 'pointer',
                opacity: 1,
                transform: 'rotate(0deg)'
              }}
            >
              {/* Scrollbar Track */}
              <div
                style={{
                  position: 'absolute',
                  width: '4px',
                  height: '176px',
                  left: '0px',
                  top: '0px',
                  backgroundColor: '#EBEBEB',
                  borderRadius: '2px'
                }}
              />

              {/* Scrollbar Thumb */}
              <div
                style={{
                  position: 'absolute',
                  width: '4px',
                  height: '50px',
                  left: '0px',
                  top: `${typeScrollRatio * (176 - 50)}px`,
                  backgroundColor: '#BFBFBF',
                  borderRadius: '2px',
                  transition: 'top 0.05s ease-out'
                }}
              />
            </div>

            {/* Checkboxes List */}
            <div
              ref={typeListRef}
              onScroll={handleTypeScroll}
              className="no-scrollbar"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px 0px 16px',
                gap: '24px',
                width: '240px',
                height: '176px',
                boxSizing: 'border-box',
                flex: 'none',
                order: 2,
                flexGrow: 0,
                zIndex: 2,
                overflowX: 'hidden',
                overflowY: 'auto'
              }}
            >
              {types.map((tp, idx) => {
                const isChecked = selectedTypes.includes(tp);
                return (
                  <label
                    key={tp}
                    onClick={() => toggleType(tp)}
                    className="flex items-center gap-2 cursor-pointer select-none"
                    style={{
                      width: '100%',
                      maxWidth: '240px',
                      minHeight: '22px',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '8px',
                      boxSizing: 'border-box',
                      flex: 'none',
                      order: idx,
                      alignSelf: 'stretch',
                      flexGrow: 0
                    }}
                  >
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        minWidth: '16px',
                        minHeight: '16px',
                        borderRadius: '2px',
                        backgroundColor: isChecked ? '#751639' : '#FFFFFF',
                        border: isChecked ? 'none' : '1px solid #565656',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                        cursor: 'pointer',
                        flexShrink: 0,
                        flex: 'none',
                        order: 0,
                        flexGrow: 0
                      }}
                    >
                      {isChecked && (
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="#FFFFFF"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      style={{
                        width: '216px',
                        fontFamily: "'Noto Sans', sans-serif",
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '22px',
                        color: '#2E2E31',
                        display: 'flex',
                        alignItems: 'center',
                        flex: 'none',
                        order: 1,
                        flexGrow: 1,
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word'
                      }}
                    >
                      {tp}
                    </span>
                  </label>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
