import { useState, useEffect } from 'react';
import type { Channel, Notification } from '../data/types';
import { TABS, CHANNEL_LABEL } from '../data/types';
import { MOCK_CODE_KEYS } from '../data/mockCodeKeys';
import HighlightBody from './HighlightBody';

interface AddSceneModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (record: Notification) => void;
  /** Pre-filled template key */
  prefillKey?: string | null;
  /** Pre-filled channel */
  prefillChannel?: Channel | null;
}

const MODULE_OPTIONS = TABS.filter((t) => t !== '已停用/不确定');

export default function AddSceneModal({
  open,
  onClose,
  onSave,
  prefillKey,
  prefillChannel,
}: AddSceneModalProps) {
  const [channel, setChannel] = useState<Channel>('email');
  const [templateKey, setTemplateKey] = useState('');
  const [sceneName, setSceneName] = useState('');
  const [module, setModule] = useState('');
  const [subModule, setSubModule] = useState('');
  const [triggerCondition, setTriggerCondition] = useState('');
  const [pushTarget, setPushTarget] = useState('');
  const [pushTiming, setPushTiming] = useState('');

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

  // Apply prefill values when modal opens
  useEffect(() => {
    if (open) {
      if (prefillChannel) setChannel(prefillChannel);
      if (prefillKey) setTemplateKey(prefillKey);
    } else {
      // Reset form when closing
      setChannel('email');
      setTemplateKey('');
      setSceneName('');
      setModule('');
      setSubModule('');
      setTriggerCondition('');
      setPushTarget('');
      setPushTiming('');
    }
  }, [open, prefillKey, prefillChannel]);

  const keyValidation = templateKey.trim()
    ? MOCK_CODE_KEYS[templateKey.trim()]
      ? 'found'
      : 'not-found'
    : 'empty';

  const keyData = keyValidation === 'found' ? MOCK_CODE_KEYS[templateKey.trim()] : null;

  const isSaveDisabled =
    !templateKey.trim() ||
    keyValidation !== 'found' ||
    !sceneName.trim() ||
    !module ||
    !subModule.trim() ||
    !triggerCondition.trim() ||
    !pushTarget.trim() ||
    !pushTiming.trim();

  const handleSave = () => {
    if (isSaveDisabled || !keyData) return;
    const record: Notification = {
      id: `${templateKey.trim()}_${channel}_${Date.now()}`,
      sceneId: 'NEW',
      sceneName: sceneName.trim(),
      module,
      subModule: subModule.trim(),
      channel,
      triggerCondition: triggerCondition.trim(),
      pushTarget: pushTarget.trim(),
      pushTiming: pushTiming.trim(),
      templateName: templateKey.trim(),
      title: keyData.title,
      body: keyData.body,
      codeReference: '（由代码动态读取）',
      status: 'active',
    };
    onSave(record);
  };

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
        <div className="bg-white rounded-xl shadow-xl w-[600px] max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">新增触达场景</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form body */}
          <div className="px-6 py-5 overflow-y-auto space-y-5 flex-1">
            {/* ① 渠道 */}
            <FormField label="渠道" required>
              <div className="flex gap-6">
                {(['email', 'inbox', 'push'] as Channel[]).map((ch) => (
                  <label key={ch} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="channel"
                      value={ch}
                      checked={channel === ch}
                      onChange={() => setChannel(ch)}
                      className="accent-[#1677ff]"
                    />
                    <span className="text-sm text-gray-700">{CHANNEL_LABEL[ch]}</span>
                  </label>
                ))}
              </div>
            </FormField>

            {/* ② template_key */}
            <FormField label="template_key" required>
              <input
                type="text"
                value={templateKey}
                onChange={(e) => setTemplateKey(e.target.value)}
                placeholder="如 RESET_PASSWORD（站内信）或 edit_login_password（邮件）"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1677ff] focus:ring-1 focus:ring-[#1677ff]"
              />
              {keyValidation === 'found' && keyData && (
                <div className="mt-1.5">
                  <p className="text-xs text-green-600">✅ 已找到，预览如下</p>
                  <div className="mt-1.5 bg-[#f6f8fa] rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">{keyData.title}</div>
                    <div className="font-mono text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                      <HighlightBody text={keyData.body} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">以上内容直接来源于代码，保存后页面将实时展示最新版本</p>
                </div>
              )}
              {keyValidation === 'not-found' && (
                <p className="mt-1 text-xs text-red-500">❌ 该 key 在代码中未找到，请确认后再填写</p>
              )}
            </FormField>

            {/* ③ 场景名称 */}
            <FormField label="场景名称" required>
              <input
                type="text"
                value={sceneName}
                onChange={(e) => setSceneName(e.target.value)}
                placeholder="如「登录密码变更提醒」"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1677ff] focus:ring-1 focus:ring-[#1677ff]"
              />
            </FormField>

            {/* ④ 业务板块 */}
            <FormField label="业务板块" required>
              <select
                value={module}
                onChange={(e) => setModule(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-700 outline-none focus:border-[#1677ff] focus:ring-1 focus:ring-[#1677ff]"
              >
                <option value="">请选择</option>
                {MODULE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </FormField>

            {/* ⑤ 子分类 */}
            <FormField label="子分类" required>
              <input
                type="text"
                value={subModule}
                onChange={(e) => setSubModule(e.target.value)}
                placeholder="如「安全设置」"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1677ff] focus:ring-1 focus:ring-[#1677ff]"
              />
            </FormField>

            {/* ⑥ 触发条件 */}
            <FormField label="触发条件" required>
              <textarea
                value={triggerCondition}
                onChange={(e) => setTriggerCondition(e.target.value)}
                placeholder="描述触发此通知的业务条件"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1677ff] focus:ring-1 focus:ring-[#1677ff] resize-none"
              />
            </FormField>

            {/* ⑦ 推送对象 */}
            <FormField label="推送对象" required>
              <input
                type="text"
                value={pushTarget}
                onChange={(e) => setPushTarget(e.target.value)}
                placeholder="描述推送的目标用户"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1677ff] focus:ring-1 focus:ring-[#1677ff]"
              />
            </FormField>

            {/* ⑧ 推送时间 */}
            <FormField label="推送时间" required>
              <input
                type="text"
                value={pushTiming}
                onChange={(e) => setPushTiming(e.target.value)}
                placeholder="如「结果产生后实时」"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-[#1677ff] focus:ring-1 focus:ring-[#1677ff]"
              />
            </FormField>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-white text-gray-600 text-sm rounded-md border border-gray-300 hover:border-gray-400 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={isSaveDisabled}
              className={`px-5 py-2 text-sm rounded-md transition-colors ${
                isSaveDisabled
                  ? 'bg-[#1677ff]/50 text-white opacity-50 cursor-not-allowed'
                  : 'bg-[#1677ff] text-white hover:bg-[#1677ff]/90'
              }`}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </div>
      {children}
    </div>
  );
}
