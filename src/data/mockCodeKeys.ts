import type { Channel } from './types';

export const MOCK_CODE_KEYS: Record<string, { title: string; body: string; channel: Channel }> = {
  // 已有元数据的 key（存在于 NOTIFICATIONS 中）
  "RESET_PASSWORD": {
    channel: "inbox",
    title: "密码重置提醒",
    body: "你已成功重置登录密码。为了保障你的账号安全，24小时内禁止提现。\n\n如果不是你本人操作，请立即重设密码或禁用账户，并尽快提交工单联系CoinEx客服。"
  },
  "edit_login_password": {
    channel: "email",
    title: "【CoinEx】安全设置修改提醒",
    body: "您在CoinEx更改了登录密码，为了保障您的账号安全，24小时内禁止提现。\n\n如果此次活动不是您本人操作，请立即重设密码或禁用账户，并尽快提交工单联系CoinEx客服。"
  },
  "DEPOSIT_SUCCESS": {
    channel: "inbox",
    title: "充值已到账",
    body: "%(coin)s 充值 %(amount)s 已成功到账，请查看资产。"
  },
  "KYC_RESULT": {
    channel: "inbox",
    title: "实名认证结果",
    body: "恭喜，你的实名认证已通过审核，系统已为你开启相关权益。"
  },
  // 未关联的 key（不在 NOTIFICATIONS 中，需要补充元数据）
  "COPY_TRADE_PROFIT_NOTICE": {
    channel: "inbox",
    title: "跟单收益通知",
    body: "你跟随的交易员 %(trader_name)s 本次收益为 %(profit)s USDT，已结算至你的账户。"
  },
  "PLEDGE_LIQ_WARNING": {
    channel: "inbox",
    title: "借贷补仓通知",
    body: "你的借贷仓位抵押率已低于警戒线（%(ratio)s），请及时补充抵押资产以避免强平。"
  },
  "auto_invest_deal_failed": {
    channel: "email",
    title: "【CoinEx】自动定投未成交通知",
    body: "您的自动定投计划（%(plan_name)s）于 %(time)s 未能成交。\n\n原因：%(reason)s\n\n请检查账户余额或调整定投设置。"
  },
};
