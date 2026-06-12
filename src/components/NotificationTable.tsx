import type { Notification } from '../data/types';
import { CHANNEL_LABEL, CHANNEL_COLOR, STATUS_LABEL, STATUS_COLOR } from '../data/types';

interface NotificationTableProps {
  notifications: Notification[];
  onView: (item: Notification) => void;
  highlightedId?: string | null;
}

export default function NotificationTable({ notifications, onView, highlightedId }: NotificationTableProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-base mb-1">未找到匹配的触达场景</p>
        <p className="text-sm">请尝试清空筛选条件或更换关键词</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/80">
            <th className="text-left py-3 px-4 font-medium text-gray-600 text-xs uppercase tracking-wider">场景编号</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600 text-xs uppercase tracking-wider">标准场景归类</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600 text-xs uppercase tracking-wider">子分类</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600 text-xs uppercase tracking-wider">推送方式</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600 text-xs uppercase tracking-wider" style={{ minWidth: 200 }}>触发条件</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600 text-xs uppercase tracking-wider">推送对象</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600 text-xs uppercase tracking-wider">代码依据</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600 text-xs uppercase tracking-wider">状态</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600 text-xs uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((item, idx) => (
            <tr
              key={item.id}
              className={`border-b border-gray-100 hover:bg-gray-50/60 transition-colors ${
                item.id === highlightedId
                  ? 'bg-blue-50'
                  : idx % 2 === 1
                    ? 'bg-[#fafafa]'
                    : ''
              }`}
            >
              <td className="py-3 px-4 text-gray-700 font-mono text-xs">{item.sceneId}</td>
              <td className="py-3 px-4 text-gray-800">{item.sceneName}</td>
              <td className="py-3 px-4 text-gray-600">{item.subModule}</td>
              <td className="py-3 px-4">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${CHANNEL_COLOR[item.channel]}`}>
                  {CHANNEL_LABEL[item.channel]}
                </span>
              </td>
              <td className="py-3 px-4 max-w-[240px] group relative">
                <div className="line-clamp-2 text-gray-700 text-xs leading-relaxed">
                  {item.triggerCondition}
                </div>
                <div className="absolute left-4 top-full mt-1 z-10 hidden group-hover:block bg-gray-900 text-white text-xs rounded-md px-3 py-2 max-w-sm whitespace-normal shadow-lg">
                  {item.triggerCondition}
                </div>
              </td>
              <td className="py-3 px-4 text-gray-600 text-xs">{item.pushTarget}</td>
              <td className="py-3 px-4 max-w-[180px] group relative">
                <div className="font-mono text-gray-400 text-xs truncate">{item.codeReference.replace(/;/g, '; ')}</div>
                <div className="absolute left-4 top-full mt-1 z-10 hidden group-hover:block bg-gray-900 text-white text-xs rounded-md px-3 py-2 max-w-sm whitespace-normal shadow-lg font-mono">
                  {item.codeReference.split(';').map((ref, i) => (
                    <div key={i}>{ref.trim()}</div>
                  ))}
                </div>
              </td>
              <td className="py-3 px-4">
                <span className={`inline-block px-2 py-0.5 rounded text-xs border ${STATUS_COLOR[item.status]}`}>
                  {STATUS_LABEL[item.status]}
                </span>
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => onView(item)}
                  className="text-[#1677ff] text-xs hover:text-[#1677ff]/80 transition-colors"
                >
                  查看
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
