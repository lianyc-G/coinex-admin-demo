import type { Tab } from '../data/types';
import { TABS } from '../data/types';

interface TabNavProps {
  activeTab: Tab;
  tabCounts: Record<string, number>;
  onTabChange: (tab: Tab) => void;
}

export default function TabNav({ activeTab, tabCounts, onTabChange }: TabNavProps) {
  return (
    <div className="flex border-b border-gray-200 gap-0 overflow-x-auto">
      {TABS.map((tab) => {
        const count = tabCounts[tab] || 0;
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`
              relative px-5 py-3 text-sm whitespace-nowrap transition-colors
              ${isActive ? 'text-[#1677ff] font-medium' : 'text-gray-600 hover:text-gray-900'}
            `}
          >
            {tab}
            {count > 0 && (
              <span
                className={`
                  inline-flex items-center justify-center ml-1.5 min-w-[18px] h-[18px] px-1
                  text-[11px] leading-none rounded-full
                  ${isActive ? 'bg-[#1677ff] text-white' : 'bg-gray-200 text-gray-600'}
                `}
              >
                {count}
              </span>
            )}
            {isActive && (
              <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1677ff] rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
