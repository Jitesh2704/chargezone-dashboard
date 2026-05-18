import { useState, useRef, useEffect } from "react";

interface DropDownProps {
  values: string[];
  width?: number;
  height?: number;
  selectedValue: string | number | null;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

const CustomDropdown = (props: DropDownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative" style={{ width: props.width || 160 }}>
      <button
        type="button"
        className="flex justify-between items-center w-full rounded-md border border-gray-300 bg-white gap-2 px-3 py-2 text-sm cursor-pointer"
        onClick={() => setOpen(!open)}
        style={{ height: props.height || 40 }}
      >
        <span
          className={`font-medium ${
            props.selectedValue ? "text-gray-700" : "text-gray-400"
          }`}
        >
          {props.selectedValue ?? props.placeholder ?? "Select an option"}
        </span>

        <svg
          className={`h-4 w-4 transform transition-transform duration-500 ${
            open ? "rotate-180" : "rotate-0"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <ul className="absolute z-15000! w-full rounded-b-md border-gray-200 border bg-white text-sm max-h-76.25 overflow-y-auto">
          {props.values.map((item, index) => (
            <li
              key={index}
              style={{ padding: "0.2rem 0.75rem" }}
              className={`cursor-pointer
                ${
                  props.selectedValue === item
                    ? "bg-[#2D3394] text-white"
                    : "hover:bg-[#f0f4ff] hover:text-[#2D3394] text-gray-600"
                }`}
              onClick={() => {
                props.onValueChange(item);
                setOpen(false);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
