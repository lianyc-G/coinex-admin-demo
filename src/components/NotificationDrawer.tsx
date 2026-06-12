import { useEffect } from 'react';
import type { Notification } from '../data/types';
import { CHANNEL_LABEL, CHANNEL_COLOR, STATUS_LABEL, STATUS_COLOR } from '../data/types';
import HighlightBody from './HighlightBody';

interface NotificationDrawerProps {
  item: Notification | null;
  onClose: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export default function NotificationDrawer({
  item,
  onClose,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}: NotificationDrawerProps) {
  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [item]);

  if (!item) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/45 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-[580px] bg-white z-50 shadow-[-4px_0_16px_rgba(0,0,0,0.08)] flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-mono">{item.sceneId}</span>
              <span className="text-base font-medium text-gray-900">{item.sceneName}</span>
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {item.module} &gt; {item.subModule}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 px-6 py-5 space-y-5">
          {/* 推送方式 */}
          <FieldRow label="推送方式">
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${CHANNEL_COLOR[item.channel]}`}>
              {CHANNEL_LABEL[item.channel]}
            </span>
          </FieldRow>

          {/* 触发条件 */}
          <FieldRow label="触发条件">
            <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{item.triggerCondition}</div>
          </FieldRow>

          {/* 推送对象 */}
          <FieldRow label="推送对象">
            <div className="text-sm text-gray-800">{item.pushTarget}</div>
          </FieldRow>

          {/* 推送时间 */}
          <FieldRow label="推送时间">
            <div className="text-sm text-gray-800">{item.pushTiming}</div>
          </FieldRow>

          {/* 模板名称 */}
          <FieldRow label="模板名称">
            <code className="text-sm text-gray-700 font-mono bg-gray-100 px-2 py-0.5 rounded">{item.templateName}</code>
          </FieldRow>

          {/* 标题 */}
          <FieldRow label="标题">
            <div className="text-sm text-gray-800">{item.title || <span className="text-gray-400 italic">无</span>}</div>
          </FieldRow>

          {/* 正文内容 */}
          <FieldRow label="正文内容">
            <div className="bg-[#f6f8fa] rounded-lg p-3 font-mono text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
              <HighlightBody text={item.body} />
            </div>
          </FieldRow>

          {/* 代码依据 */}
          <FieldRow label="代码依据">
            <div className="space-y-1">
              {item.codeReference.split(';').map((ref, i) => (
                <code key={i} className="block text-xs text-gray-500 font-mono">
                  {ref.trim()}
                </code>
              ))}
            </div>
          </FieldRow>

          {/* 状态 */}
          <FieldRow label="状态">
            <span className={`inline-block px-2 py-0.5 rounded text-xs border ${STATUS_COLOR[item.status]}`}>
              {STATUS_LABEL[item.status]}
            </span>
          </FieldRow>
        </div>

        {/* Footer note */}
        <div className="px-6 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            正文为代码模板原文，%(变量名)s 为运行时动态替换的值
          </p>
        </div>

        {/* Bottom navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className={`text-sm transition-colors ${hasPrev ? 'text-[#1677ff] hover:text-[#1677ff]/80' : 'text-gray-300 cursor-not-allowed'}`}
          >
            ← 上一条
          </button>
          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`text-sm transition-colors ${hasNext ? 'text-[#1677ff] hover:text-[#1677ff]/80' : 'text-gray-300 cursor-not-allowed'}`}
          >
            下一条 →
          </button>
        </div>
      </div>
    </>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div>{children}</div>
    </div>
  );
}
