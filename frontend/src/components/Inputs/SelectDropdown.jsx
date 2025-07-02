// components/common/SelectDropdown.jsx
import React, { useEffect, useRef, useState } from "react";
import { LuChevronDown } from "react-icons/lu";

/**
 * Props
 *  - label: string              // optional label text
 *  - name:  string              // optional name/id for accessibility
 *  - value: string | number     // current selected value
 *  - onChange: (newValue) => {} // callback when selection changes
 *  - options: [{label, value}]  // dropdown options
 *  - placeholder: string        // placeholder text when no value
 *  - className: string          // extra classes for the outer wrapper
 *  - disabled: boolean          // disable interaction
 */
const SelectDropdown = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // ───── Close on click outside ─────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ───── Toggle dropdown ─────
  const toggleOpen = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  // ───── Select an option ─────
  const handleSelect = (optionValue) => {
    if (disabled) return;
    onChange(optionValue);
    setIsOpen(false);
  };

  // ───── Keyboard accessibility ─────
  const handleKeyDown = (e) => {
    if (e.key === "Escape") setIsOpen(false);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleOpen();
    }
  };

  // ───── Find label for current value ─────
  const currentLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <div className={`relative w-full ${className}`} ref={wrapperRef}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      {/* Button */}
      <button
        id={name}
        type="button"
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`flex w-full items-center justify-between rounded-xl border px-4 py-2 transition
          ${
            disabled
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "cursor-pointer bg-gradient-to-tr from-indigo-50 to-pink-50 hover:from-indigo-100"
          }`}
      >
        <span
          className={`truncate ${
            value ? "text-gray-800" : "text-gray-400 italic"
          }`}
        >
          {currentLabel}
        </span>
        <LuChevronDown
          className={`ml-2 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Menu */}
      {isOpen && (
        <ul
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border bg-white shadow-lg"
          role="listbox"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              onClick={() => handleSelect(opt.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSelect(opt.value)}
              tabIndex={0}
              className={`px-4 py-2 cursor-pointer transition
                ${
                  value === opt.value
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-indigo-50"
                }`}
            >
              {opt.label}
            </li>
          ))}

          {options.length === 0 && (
            <li className="px-4 py-2 text-gray-500 italic">No options</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SelectDropdown;
