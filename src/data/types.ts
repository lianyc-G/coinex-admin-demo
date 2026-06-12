export type Channel = 'email' | 'inbox' | 'push';
export type Status = 'active' | 'disabled' | 'unconfirmed';

export interface Notification {
  id: string;
  sceneId: string;
  sceneName: string;
  module: string;
  subModule: string;
  channel: Channel;
  triggerCondition: string;
  pushTarget: string;
  pushTiming: string;
  templateName: string;
  title: string;
  body: string;
  codeReference: string;
  status: Status;
}

export const TABS = [
  '安全',
  '账户',
  '资产',
  '合约',
  '现货',
  '法币',
  '理财',
  '权益与特色',
  '活动',
  '行情',
  '市场',
  '已停用/不确定',
] as const;

export type Tab = (typeof TABS)[number];

export const CHANNEL_OPTIONS = [
  { value: '', label: '全部' },
  { value: 'email', label: '邮件' },
  { value: 'inbox', label: '站内信' },
  { value: 'push', label: 'App Push' },
] as const;

export const CHANNEL_LABEL: Record<Channel, string> = {
  email: '邮件',
  inbox: '站内信',
  push: 'App Push',
};

export const CHANNEL_COLOR: Record<Channel, string> = {
  email: 'bg-blue-100 text-blue-700',
  inbox: 'bg-green-100 text-green-700',
  push: 'bg-orange-100 text-orange-700',
};

export const STATUS_LABEL: Record<Status, string> = {
  active: '正常',
  disabled: '已停用',
  unconfirmed: '待确认',
};

export const STATUS_COLOR: Record<Status, string> = {
  active: 'bg-green-50 text-green-600 border-green-200',
  disabled: 'bg-gray-50 text-gray-500 border-gray-200',
  unconfirmed: 'bg-orange-50 text-orange-600 border-orange-200',
};
