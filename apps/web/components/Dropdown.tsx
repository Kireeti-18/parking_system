'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icons';

interface DropdownProps {
  label?: string;
  styles?: string;
  placeholder?: string;
  options: { value: string | number; name: string }[];
  defaultSelectedValue?: string | number;
  isDefault?: boolean;
  disabled?: boolean;
  onChange: (value: string | number) => void;
  labelstyles?: string;
  selectedTextStyles?: string;
}

export function Dropdown({
  label,
  styles = '',
  labelstyles = 'text-sm text-gray-700',
  placeholder = 'Select option',
  selectedTextStyles = '',
  options,
  defaultSelectedValue,
  isDefault = false,
  disabled = false,
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | number | undefined>(
    isDefault ? defaultSelectedValue : undefined,
  );
  const [hoverIdx, setHoverIdx] = useState<number>(-1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (isDefault && defaultSelectedValue !== undefined) {
       (defaultSelectedValue);
    }
  }, [defaultSelectedValue, isDefault]);

  const handleSelect = (value: string | number) => {
    if (disabled || value === selected) return;
    setSelected(value);
    onChange(value);
    setOpen(false);
  };

  const selectedLabel = options.find((o) => o.value === selected)?.name ?? '';
  const hasSelection = selected !== undefined && selected !== null;

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled || options.length === 0) return;

    if (!open && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setOpen(true);
      setHoverIdx(
        Math.max(
          0,
          options.findIndex((o) => o.value === selected),
        ),
      );
      return;
    }

    if (!open) return;

    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      let next = hoverIdx;

      for (let i = 0; i < options.length; i++) {
        next = (next + 1) % options.length;
        if (options[next]?.value !== selected) break;
      }

      setHoverIdx(next);
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      let prev = hoverIdx;

      for (let i = 0; i < options.length; i++) {
        prev = (prev - 1 + options.length) % options.length;
        if (options[prev]?.value !== selected) break;
      }

      setHoverIdx(prev);
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const opt = options[hoverIdx];
      if (opt && opt.value !== selected) {
        handleSelect(opt.value);
      }
    }
  };

  return (
    <div className={`w-full ${styles}`}>
      {label && <label className={`block mb-1 ${labelstyles}`}>{label}</label>}

      <div
        ref={ref}
        className="relative"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-disabled={disabled}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((v) => !v)}
          className={`w-full border rounded-xl px-3 py-3 text-left flex items-center justify-between focus:outline-none
            ${
              disabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                : 'bg-gray-50/50 border-gray-300/50 focus:border-gray-500'
            }
          `}
        >
          <span
            className={`${selectedTextStyles} ${
              hasSelection && !disabled ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            {hasSelection ? selectedLabel : placeholder}
          </span>
          <Icon
            name="down-arrow"
            styles={`${open ? 'rotate-180' : ''} ${
              disabled ? 'opacity-40' : ''
            }`}
          />
        </button>

        {open && !disabled && (
          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-56 overflow-auto">
            {options.map((opt, idx) => {
              const active = opt.value === selected;
              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => !active && setHoverIdx(idx)}
                  onClick={() => !active && handleSelect(opt.value)}
                  className={`px-3 py-2 select-none transition-colors hover:bg-primary/10 ${
                    active
                      ? 'text-primary bg-primary/10 pointer-events-none'
                      : 'text-gray-800 cursor-pointer'
                  }`}
                >
                  {opt.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
