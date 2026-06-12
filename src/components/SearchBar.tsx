import { useState, useEffect } from 'react';
import { CHANNEL_OPTIONS } from '../data/types';

interface SearchBarProps {
  subModuleOptions: string[];
  onSearch: (params: { subModule: string; channel: string; keyword: string }) => void;
}

export default function SearchBar({ subModuleOptions, onSearch }: SearchBarProps) {
  const [subModule, setSubModule] = useState('');
  const [channel, setChannel] = useState('');
  const [keyword, setKeyword] = useState('');

  // Reset filters when subModuleOptions change (tab switch)
  useEffect(() => {
    setSubModule('');
    setChannel('');
    setKeyword('');
  }, [subModuleOptions]);

  const handleSearch = () => {
    onSearch({ subModule, channel, keyword });
  };

  const handleReset = () => {
    setSubModule('');
    setChannel('');
    setKeyword('');
    onSearch({ subModule: '', channel: '', keyword: '' });
  };

  return (
    <div className="flex items-center gap-3 py-4 flex-wrap">
      <select
        value={subModule}
        onChange={(e) => setSubModule(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-700 outline-none focus:border-[#1677ff] focus:ring-1 focus:ring-[#1677ff]"
      >
        <option value="">全部子分类</option>
        {subModuleOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <select
        value={channel}
        onChange={(e) => setChannel(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-700 outline-none focus:border-[#1677ff] focus:ring-1 focus:ring-[#1677ff]"
      >
        {CHANNEL_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="搜索场景名称、触发条件、正文内容..."
        className="flex-1 min-w-[240px] px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1677ff] focus:ring-1 focus:ring-[#1677ff]"
      />

      <button
        onClick={handleSearch}
        className="px-5 py-2 bg-[#1677ff] text-white text-sm rounded-md hover:bg-[#1677ff]/90 transition-colors"
      >
        查询
      </button>

      <button
        onClick={handleReset}
        className="px-5 py-2 bg-white text-gray-600 text-sm rounded-md border border-gray-300 hover:border-gray-400 transition-colors"
      >
        重置
      </button>
    </div>
  );
}
