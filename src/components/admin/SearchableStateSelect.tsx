'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface StateOptionItem {
  id: string | number;
  name: string;
  code?: string;
}

// Complete master list of 28 States and 8 Union Territories in India
export const ALL_INDIAN_STATES_MASTER: StateOptionItem[] = [
  { id: '1', name: 'Andhra Pradesh', code: 'AP' },
  { id: '2', name: 'Arunachal Pradesh', code: 'AR' },
  { id: '3', name: 'Assam', code: 'AS' },
  { id: '4', name: 'Bihar', code: 'BR' },
  { id: '5', name: 'Chhattisgarh', code: 'CG' },
  { id: '6', name: 'Goa', code: 'GA' },
  { id: '7', name: 'Gujarat', code: 'GJ' },
  { id: '8', name: 'Haryana', code: 'HR' },
  { id: '9', name: 'Himachal Pradesh', code: 'HP' },
  { id: '10', name: 'Jharkhand', code: 'JH' },
  { id: '11', name: 'Karnataka', code: 'KA' },
  { id: '12', name: 'Kerala', code: 'KL' },
  { id: '13', name: 'Madhya Pradesh', code: 'MP' },
  { id: '14', name: 'Maharashtra', code: 'MH' },
  { id: '15', name: 'Manipur', code: 'MN' },
  { id: '16', name: 'Meghalaya', code: 'ML' },
  { id: '17', name: 'Mizoram', code: 'MZ' },
  { id: '18', name: 'Nagaland', code: 'NL' },
  { id: '19', name: 'Odisha', code: 'OD' },
  { id: '20', name: 'Punjab', code: 'PB' },
  { id: '21', name: 'Rajasthan', code: 'RJ' },
  { id: '22', name: 'Sikkim', code: 'SK' },
  { id: '23', name: 'Tamil Nadu', code: 'TN' },
  { id: '24', name: 'Telangana', code: 'TS' },
  { id: '25', name: 'Tripura', code: 'TR' },
  { id: '26', name: 'Uttar Pradesh', code: 'UP' },
  { id: '27', name: 'Uttarakhand', code: 'UK' },
  { id: '28', name: 'West Bengal', code: 'WB' },
  { id: '29', name: 'Andaman & Nicobar Islands', code: 'AN' },
  { id: '30', name: 'Chandigarh', code: 'CH' },
  { id: '31', name: 'Dadra & Nagar Haveli and Daman & Diu', code: 'DN' },
  { id: '32', name: 'Delhi (NCT)', code: 'DL' },
  { id: '33', name: 'Jammu & Kashmir', code: 'JK' },
  { id: '34', name: 'Ladakh', code: 'LA' },
  { id: '35', name: 'Lakshadweep', code: 'LD' },
  { id: '36', name: 'Puducherry', code: 'PY' },
];

interface SearchableStateSelectProps {
  value: string | number;
  onChange: (value: string, selectedOption?: StateOptionItem) => void;
  states?: StateOptionItem[];
  placeholder?: string;
  allowAll?: boolean;
  allLabel?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  id?: string;
  name?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function SearchableStateSelect({
  value,
  onChange,
  states = [],
  placeholder = 'All States',
  allowAll = true,
  allLabel = 'All States',
  disabled = false,
  className = '',
  buttonClassName = '',
  dropdownClassName = '',
  id,
  name,
  required = false,
  size = 'sm'
}: SearchableStateSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Combine passed states from DB with Master Indian states list to guarantee all states are present
  const mergedStatesList: StateOptionItem[] = React.useMemo(() => {
    if (states && states.length >= 28) {
      return states;
    }
    const map = new Map<string, StateOptionItem>();
    // First add DB states
    (states || []).forEach(s => {
      if (s && s.name) {
        map.set(s.name.toLowerCase().trim(), {
          id: s.id,
          name: s.name,
          code: s.code
        });
      }
    });
    // Fill in any missing Indian states
    ALL_INDIAN_STATES_MASTER.forEach(s => {
      const key = s.name.toLowerCase().trim();
      if (!map.has(key)) {
        map.set(key, s);
      }
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [states]);

  // Current string representation
  const currentValueStr = value !== undefined && value !== null ? value.toString() : '';

  // Find currently selected state item
  const selectedState = mergedStatesList.find(
    s => s.id?.toString() === currentValueStr || s.name?.toLowerCase() === currentValueStr.toLowerCase()
  );

  // Display label
  let displayLabel = placeholder;
  if (currentValueStr === 'All' || currentValueStr === '') {
    displayLabel = allowAll ? allLabel : placeholder;
  } else if (selectedState) {
    displayLabel = selectedState.name;
  } else if (currentValueStr) {
    displayLabel = `State #${currentValueStr}`;
  }

  // Filtered states based on live search query
  const filteredStates = mergedStatesList.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const nameMatch = (s.name || '').toLowerCase().includes(q);
    const codeMatch = (s.code || '').toLowerCase().includes(q);
    return nameMatch || codeMatch;
  });

  const toggleDropdown = () => {
    if (disabled) return;
    if (!isOpen) {
      setIsOpen(true);
      setSearchQuery('');
    } else {
      setIsOpen(false);
    }
  };

  // Auto-focus search input upon opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (val: string, option?: StateOptionItem) => {
    onChange(val, option);
    setIsOpen(false);
    setSearchQuery('');
  };

  const isSelected = (val: string | number) => {
    return currentValueStr === val?.toString();
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative inline-block w-full text-left font-['Inter',sans-serif] ${className}`}
    >
      {/* Hidden input for form compatibility */}
      {name && (
        <input 
          type="hidden" 
          name={name} 
          value={currentValueStr} 
          required={required} 
          id={id}
        />
      )}

      {/* Trigger Button - Matches admin select fields (rounded-lg) */}
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`w-full bg-white border border-zinc-200 rounded-lg px-3 text-zinc-800 flex items-center justify-between focus:outline-none focus:border-[#751639] focus:ring-2 focus:ring-[#751639]/15 transition-colors cursor-pointer disabled:bg-zinc-100 disabled:cursor-not-allowed ${
          size === 'lg' ? 'py-3 text-sm' : size === 'md' ? 'py-2.5 text-sm' : 'py-2.5 text-sm'
        } ${
          isOpen ? 'border-[#751639]' : 'hover:border-zinc-300'
        } ${buttonClassName}`}
      >
        <span className="truncate pr-2 font-normal">
          {displayLabel}
        </span>

        {/* Dropdown arrow matching native select */}
        <svg 
          width="10" 
          height="6" 
          viewBox="0 0 10 6" 
          fill="none" 
          className={`shrink-0 text-zinc-500 transition-transform duration-150 ${isOpen ? 'rotate-180 text-[#751639]' : ''}`}
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Popover Menu with Search Bar and All States */}
      {isOpen && (
        <div 
          className={`absolute left-0 top-full mt-1 w-full min-w-[260px] bg-white border border-zinc-200 shadow-xl z-50 rounded-lg overflow-hidden animate-fadeIn ${dropdownClassName}`}
          style={{ maxHeight: '380px' }}
        >
          {/* Search Bar Input inside Dropdown */}
          <div className="p-2 border-b border-zinc-100 bg-[#fafbfc] sticky top-0 z-10">
            <div className="relative flex items-center">
              <span className="absolute left-2.5 text-zinc-400 text-xs">🔍</span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search state..."
                className="w-full bg-white border border-zinc-200 rounded-lg pl-7 pr-6 py-1.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#751639]"
                onClick={e => e.stopPropagation()}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSearchQuery(''); searchInputRef.current?.focus(); }}
                  className="absolute right-2 text-zinc-400 hover:text-zinc-700 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* List Options */}
          <div className="max-h-[290px] overflow-y-auto divide-y divide-zinc-100">
            {/* "All States" option at top */}
            {allowAll && !searchQuery && (
              <button
                type="button"
                onClick={() => handleSelect('All')}
                className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected('All') || isSelected('')
                    ? 'bg-[#751639] text-white font-bold'
                    : 'text-zinc-800 hover:bg-[#751639] hover:text-white'
                }`}
              >
                <span>{allLabel}</span>
                {(isSelected('All') || isSelected('')) && <span>✓</span>}
              </button>
            )}

            {/* Empty Search Result */}
            {filteredStates.length === 0 ? (
              <div className="p-3 text-center text-xs text-zinc-400">
                No matching state found
              </div>
            ) : (
              filteredStates.map((st) => {
                const isItemActive = isSelected(st.id) || (currentValueStr && st.name.toLowerCase() === currentValueStr.toLowerCase());

                return (
                  <button
                    key={st.id || st.name}
                    type="button"
                    onClick={() => handleSelect(st.id.toString(), st)}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      isItemActive
                        ? 'bg-[#751639] text-white font-bold'
                        : 'text-zinc-800 hover:bg-[#751639] hover:text-white'
                    }`}
                  >
                    <span className="truncate">{st.name}</span>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {st.code && (
                        <span className={`text-[10px] font-mono px-1 py-0.2 rounded-none uppercase ${
                          isItemActive ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-500'
                        }`}>
                          {st.code}
                        </span>
                      )}
                      {isItemActive && <span>✓</span>}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
