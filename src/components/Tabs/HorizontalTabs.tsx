import React from "react";

export interface HorizontalTab {
  key: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
  countable?: boolean;
}

interface HorizontalTabsProps {
  tabs: HorizontalTab[];
  activeTab: string;
  onChange: (key: string) => void;
  className?: string;
}

export default function HorizontalTabs({
  tabs,
  activeTab,
  onChange,
  className = "",
}: HorizontalTabsProps) {
  return (
    <div
      className={`flex gap-8 px-3 pt-4 border-b border-gray-50 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`pb-3 flex items-center gap-2 text-sm transition-colors relative
              ${
                isActive
                  ? "text-[#2D3394] font-semibold"
                  : "text-gray-500 hover:text-gray-700 font-medium"
              }`}
          >
            {tab.icon && (
              <span
                className={`text-base transition-colors ${
                  isActive ? "text-[#2D3394]" : "text-gray-400"
                }`}
              >
                {tab.icon}
              </span>
            )}

            <span className="hidden md:inline">
              {tab.label}
              {tab.countable && typeof tab.count === "number" && (
                <span className="ml-1">({tab.count})</span>
              )}
            </span>

            {isActive && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#2D3394] rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
