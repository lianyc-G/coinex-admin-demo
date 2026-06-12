import { useEffect } from 'react';
import type { Channel } from '../data/types';
import { CHANNEL_LABEL, CHANNEL_COLOR } from '../data/types';
import HighlightBody from './HighlightBody';

interface UnlinkedKeyItem {
  key: string;
  title: string;
  body: string;
  channel: Channel;
}

interface UnlinkedKeysModalProps {
  open: boolean;
  onClose: () => void;
  keys: UnlinkedKeyItem[];
  onAddNow: (key: string, channel: Channel) => void;
}

export default function UnlinkedKeysModal({
  open,
  onClose,
  keys,
  onAddNow,
}: UnlinkedKeysModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/45 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl w-[520px] max-h-[75vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">待补充元数据的 key</h2>
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
          <div className="px-6 py-4 overflow-y-auto flex-1 space-y-3">
            {keys.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">暂无未关联的 key</p>
            ) : (
              keys.map((item) => (
                <div
                  key={item.key}
                  className="border border-gray-200 rounded-lg p-4 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-xs font-mono text-[#1677ff]">{item.key}</code>
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${CHANNEL_COLOR[item.channel]}`}
                      >
                        {CHANNEL_LABEL[item.channel]}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      <HighlightBody text={item.title} />
                    </div>
                  </div>
                  <button
                    onClick={() => onAddNow(item.key, item.channel)}
                    className="shrink-0 px-3 py-1.5 bg-[#1677ff] text-white text-xs rounded-md hover:bg-[#1677ff]/90 transition-colors"
                  >
                    立即新增
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="px-6 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              以上 key 已在代码中定义，但尚未配置业务元数据。建议在发布后及时补充，以便在触达管理中可见。
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
