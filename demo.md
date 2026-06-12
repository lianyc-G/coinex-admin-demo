请帮我用 React + Tailwind CSS 构建一个前端原型 Demo（单页 Vite 项目），
实现 CoinEx Admin 后台的"自动化触达内容可视化"功能。

## 目标

这是一个只读查询页面，让运营/产品可以按业务板块浏览所有自动化触达场景
（邮件、站内信、App Push），无需查代码。

## 技术要求

- Vite + React 18 + TypeScript
- Tailwind CSS（样式）
- 数据直接硬编码在前端 mock 文件中（data/notifications.ts）
- 不需要后端，不需要路由，单页即可

## 页面结构

### 1. 顶部 Header
- 标题：「自动化触达内容管理」
- 副标题：「V1.0 · 只读查询」
- 右上角展示总记录数

### 2. Tab 导航栏
共 12 个 Tab，固定顺序：
安全 / 账户 / 资产 / 合约 / 现货 / 法币 / 理财 / 权益与特色 / 活动 / 行情 / 市场 / 已停用/不确定

- 当前 Tab 下划线高亮
- 每个 Tab 右上角小数字气泡，显示该 Tab 的记录总数
- 切换 Tab 时搜索条件自动重置

### 3. 搜索栏（在 Tab 下方）
三个筛选项横排：
- 「子分类」下拉框（选项根据当前 Tab 动态生成）
- 「推送方式」下拉框（固定选项：全部 / 邮件 / 站内信 / App Push）
- 「关键词」文本输入框（placeholder: 搜索场景名称、触发条件、正文内容...）
- 「查询」按钮（蓝色）
- 「重置」按钮（灰色）
- 搜索结果右侧显示「共 N 条记录」

### 4. 场景列表

每行字段：
| 场景编号 | 标准场景归类 | 子分类 | 推送方式 | 触发条件 | 推送对象 | 代码依据 | 状态 | 操作 |

- 推送方式用 Badge 展示（邮件=蓝色, 站内信=绿色, App Push=橙色）
- 触发条件超过 2 行时截断 + hover tooltip 显示全文
- 代码依据显示为等宽灰色小字，超出省略 + hover 展示完整路径
- 状态：正常=绿色标签, 已停用=灰色标签, 待确认=橙色标签
- 操作列：「查看」文字按钮
- 支持 hover 行高亮

### 5. 详情抽屉（右侧 Drawer）

点击「查看」后，从右侧滑入宽 580px 的详情面板，包含：
- 顶部：场景编号 + 标准场景归类标题，右上角关闭按钮
- 面包屑：业务板块 > 子分类
- 字段区（标签+内容上下布局）：
  - 推送方式（Badge）
  - 触发条件（完整）
  - 推送对象
  - 推送时间
  - 模板名称（等宽字体）
  - 标题
  - 正文内容（等宽字体代码块，动态变量 %(xxx)s 用黄色背景高亮）
  - 代码依据（每条独占一行，等宽字体）
  - 状态
- 底部说明文字（灰色小字）：「正文为代码模板原文，%(变量名)s 为运行时动态替换的值」
- 底部导航：「← 上一条」「下一条 →」按钮，边界时禁用

### 6. 空态

搜索无结果时，列表中央展示「未找到匹配的触达场景」+ 建议清空筛选的提示

---

## Mock 数据

数据文件：src/data/notifications.ts，导出 NOTIFICATIONS 数组。

字段结构：
```ts
interface Notification {
  id: string;           // 唯一ID，如 "S108_email"
  sceneId: string;      // 场景编号，如 "S108"
  sceneName: string;    // 标准场景归类
  module: string;       // 大业务板块
  subModule: string;    // 子分类
  channel: 'email' | 'inbox' | 'push';
  triggerCondition: string;
  pushTarget: string;
  pushTiming: string;
  templateName: string;
  title: string;
  body: string;
  codeReference: string;  // 多个用 ; 分隔
  status: 'active' | 'disabled' | 'unconfirmed';
}
```

请填充以下真实数据（至少覆盖 4 个 Tab，每 Tab 至少 4 条）：

安全 Tab（子分类：安全设置）
```
{ id:"S108_email", sceneId:"S108", sceneName:"登录密码变更提醒", module:"安全", subModule:"安全设置", channel:"email", triggerCondition:"用户修改或重置登录密码成功时", pushTarget:"修改或重置登录密码的用户", pushTiming:"结果产生后实时", templateName:"notice/edit_login_password", title:"【CoinEx】安全设置修改提醒", body:"您在CoinEx更改了登录密码，为了保障您的账号安全，24小时内禁止提现。\n\n如果此次活动不是您本人操作，请立即重设密码或禁用账户，并尽快提交工单联系CoinEx客服。", codeReference:"app/business/email.py:168;app/business/email.py:3021", status:"active" }

{ id:"S108_inbox", sceneId:"S108", sceneName:"登录密码变更提醒", module:"安全", subModule:"安全设置", channel:"inbox", triggerCondition:"用户修改或重置登录密码成功时", pushTarget:"修改或重置登录密码的用户", pushTiming:"结果产生后实时", templateName:"RESET_PASSWORD", title:"密码重置提醒", body:"你已成功重置登录密码。为了保障你的账号安全，24小时内禁止提现。\n\n如果不是你本人操作，请立即重设密码或禁用账户，并尽快提交工单联系CoinEx客服。", codeReference:"app/business/email.py:3064;app/business/self_service.py:10", status:"active" }

{ id:"S119_email", sceneId:"S119", sceneName:"登录提醒", module:"安全", subModule:"安全设置", channel:"email", triggerCondition:"用户账户安全设置或安全状态发生变化时", pushTarget:"账户安全相关用户", pushTiming:"结果产生后实时", templateName:"notice/sign_in", title:"【CoinEx】登录提醒", body:"登录提醒\n\n您在%(create_time)s登录了CoinEx。\n\n地点：%(location)s\n\n如果不是你本人操作，请立即重设密码或禁用账户，并尽快提交工单联系CoinEx客服。", codeReference:"app/business/email.py:1293;app/business/email.py:1327", status:"active" }

{ id:"S121_email", sceneId:"S121", sceneName:"异地登录提醒", module:"安全", subModule:"安全设置", channel:"email", triggerCondition:"用户账户出现异地登录或异常登录时", pushTarget:"账户安全相关用户", pushTiming:"结果产生后实时", templateName:"notice/sign_in_unusual", title:"【CoinEx】异地登录提醒", body:"异地登录提醒\n\n您的账号于%(create_time)s登录了CoinEx，我们发现您本次登录地点与上次不一致，请确认这是您本人的操作。\n本次登录 IP: %(ip)s\n本次登录地点: %(location)s\n\n如果此次行为不是您本人所为，请立即重设密码或禁用账户，并尽快提交工单联系CoinEx客服。", codeReference:"app/business/email.py:1252;app/business/email.py:1293", status:"active" }

{ id:"S120_email", sceneId:"S120", sceneName:"多次登录失败提醒", module:"安全", subModule:"安全设置", channel:"email", triggerCondition:"用户短时间内多次登录失败触发安全提醒时", pushTarget:"账户安全相关用户", pushTiming:"结果产生后实时", templateName:"notice/sign_in_fail", title:"【CoinEx】多次尝试登录提醒", body:"多次尝试登录提醒\n\n您的账号于%(create_time)s多次尝试登录CoinEx并失败。请确认这是您本人的操作。\n如果此次行为不是您本人所为，请立即重设密码或禁用账户，并尽快提交工单联系CoinEx客服。", codeReference:"app/business/email.py:1361;app/api/frontend/user.py:823", status:"active" }
```

资产 Tab（子分类：提现、充值）
```
{ id:"S201_email", sceneId:"S201", sceneName:"提现申请成功通知", module:"资产", subModule:"提现", channel:"email", triggerCondition:"用户提交提现申请并审核通过时", pushTarget:"发起提现的用户", pushTiming:"提现申请通过后实时", templateName:"notice/withdraw_success", title:"【CoinEx】提现成功通知", body:"您的提现申请已成功处理。\n\n币种：%(coin)s\n数量：%(amount)s\n手续费：%(fee)s\n到账地址：%(address)s\n时间：%(create_time)s", codeReference:"app/business/email.py:520;app/business/withdraw.py:312", status:"active" } 8. { id:"S201_inbox", sceneId:"S201", sceneName:"提现申请成功通知", module:"资产", subModule:"提现", channel:"inbox", triggerCondition:"用户提交提现申请并审核通过时", pushTarget:"发起提现的用户", pushTiming:"提现申请通过后实时", templateName:"WITHDRAW_SUCCESS", title:"提现成功", body:"你的提现申请已成功处理。\n币种：%(coin)s，数量：%(amount)s\n请前往区块链浏览器确认到账情况。", codeReference:"app/business/withdraw.py:318", status:"active" } 9. { id:"S202_email", sceneId:"S202", sceneName:"充值到账通知", module:"资产", subModule:"充值", channel:"email", triggerCondition:"用户充值资产确认上链到账时", pushTarget:"充值用户", pushTiming:"链上确认后实时", templateName:"notice/deposit_success", title:"【CoinEx】充值到账通知", body:"您的充值已到账。\n\n币种：%(coin)s\n数量：%(amount)s\n时间：%(create_time)s\n\n请登录CoinEx查看您的资产。", codeReference:"app/business/email.py:615;app/business/deposit.py:201", status:"active" } 10. { id:"S202_inbox", sceneId:"S202", sceneName:"充值到账通知", module:"资产", subModule:"充值", channel:"inbox", triggerCondition:"用户充值资产确认上链到账时", pushTarget:"充值用户", pushTiming:"链上确认后实时", templateName:"DEPOSIT_SUCCESS", title:"充值已到账", body:"%(coin)s 充值 %(amount)s 已成功到账，请查看资产。", codeReference:"app/business/deposit.py:208", status:"active" }

```
```
合约 Tab（子分类：合约交易） 
{ id:"S301_email", sceneId:"S301", sceneName:"合约强平预警", module:"合约", subModule:"合约交易", channel:"email", triggerCondition:"用户合约持仓保证金率低于预警阈值时", pushTarget:"持有合约仓位的用户", pushTiming:"触发预警后实时", templateName:"notice/perpetual_liquidation_warning", title:"【CoinEx】合约强平预警通知", body:"【重要】合约强平预警\n\n您的合约持仓（%(symbol)s）保证金率已低于%(warning_ratio)s，存在强平风险。\n\n当前保证金率：%(margin_ratio)s\n请及时追加保证金或减仓，以避免强平损失。", codeReference:"app/business/perpetual/liquidation.py:88;app/business/email.py:2100", status:"active" } 12. { id:"S301_inbox", sceneId:"S301", sceneName:"合约强平预警", module:"合约", subModule:"合约交易", channel:"inbox", triggerCondition:"用户合约持仓保证金率低于预警阈值时", pushTarget:"持有合约仓位的用户", pushTiming:"触发预警后实时", templateName:"PERPETUAL_LIQUIDATION_WARNING", title:"合约强平预警", body:"你的 %(symbol)s 仓位保证金率已触及预警线（%(margin_ratio)s），请及时处理以避免强平。", codeReference:"app/business/perpetual/liquidation.py:95", status:"active" } 13. { id:"S302_email", sceneId:"S302", sceneName:"合约跟单成功通知", module:"合约", subModule:"合约跟单", channel:"email", triggerCondition:"用户跟单申请审核通过，成功加入跟单时", pushTarget:"发起跟单的用户", pushTiming:"审核通过后实时", templateName:"notice/copy_trade_success", title:"【CoinEx】跟单成功通知", body:"您已成功跟单交易员 %(trader_name)s。\n\n跟单金额：%(amount)s USDT\n跟单类型：%(trade_type)s\n开始时间：%(start_time)s\n\n祝您投资顺利！", codeReference:"app/business/copy_trade.py:156;app/business/email.py:2450", status:"active" }
```
```
安全 Tab（子分类：实名认证） 14. { id:"S401_email", sceneId:"S401", sceneName:"KYC初级认证通过", module:"安全", subModule:"实名认证", channel:"email", triggerCondition:"用户KYC初级认证审核通过时", pushTarget:"完成KYC初级认证的用户", pushTiming:"审核通过后实时", templateName:"notice/kyc_primary_pass", title:"【CoinEx】实名认证通过", body:"恭喜您！您已完成CoinEx初级实名认证。\n\n认证级别：初级认证\n通过时间：%(pass_time)s\n\n您现在可以享受更高的充提币额度。如需进一步提升，请完成高级认证。", codeReference:"app/business/kyc.py:312;app/business/email.py:1750", status:"active" } 15. { id:"S401_inbox", sceneId:"S401", sceneName:"KYC初级认证通过", module:"安全", subModule:"实名认证", channel:"inbox", triggerCondition:"用户KYC初级认证审核通过时", pushTarget:"完成KYC初级认证的用户", pushTiming:"审核通过后实时", templateName:"KYC_PRIMARY_PASS", title:"实名认证通过", body:"你已完成初级实名认证，充提币额度已提升，请查看资产页面了解最新限额。", codeReference:"app/business/kyc.py:318", status:"active" } 16. { id:"S402_email", sceneId:"S402", sceneName:"KYC认证审核不通过", module:"安全", subModule:"实名认证", channel:"email", triggerCondition:"用户KYC认证审核未通过时", pushTarget:"KYC审核不通过的用户", pushTiming:"审核结果产生后实时", templateName:"notice/kyc_fail", title:"【CoinEx】实名认证未通过", body:"您提交的实名认证未通过审核。\n\n未通过原因：%(reason)s\n\n请根据提示重新上传认证材料，如有疑问请联系客服。", codeReference:"app/business/kyc.py:285;app/business/email.py:1730", status:"active" }
```
```
已停用/不确定 Tab 17. { id:"S501_email", sceneId:"S501", sceneName:"红包发送通知", module:"已停用/不确定", subModule:"红包", channel:"email", triggerCondition:"用户发送红包时", pushTarget:"发送红包的用户", pushTiming:"发送成功后实时", templateName:"notice/red_packet_send", title:"【CoinEx】红包发送成功", body:"您已成功发送红包。\n\n红包金额：%(amount)s %(coin)s\n发送时间：%(create_time)s", codeReference:"app/business/red_packet.py:88", status:"disabled" } 18. { id:"S502_email", sceneId:"S502", sceneName:"卡券到期提醒", module:"已停用/不确定", subModule:"卡券中心", channel:"email", triggerCondition:"用户持有卡券临近到期时", pushTarget:"持有即将到期卡券的用户", pushTiming:"到期前48小时", templateName:"notice/coupon_expire", title:"【CoinEx】卡券即将到期提醒", body:"您有卡券即将到期，请尽快使用。\n\n卡券类型：%(coupon_type)s\n到期时间：%(expire_time)s", codeReference:"app/business/coupon.py:156", status:"disabled" } 19. { id:"S503_email", sceneId:"S503", sceneName:"未知模板通知", module:"已停用/不确定", subModule:"模板无内容", channel:"email", triggerCondition:"待确认", pushTarget:"待确认", pushTiming:"待确认", templateName:"notice/unknown_template", title:"", body:"", codeReference:"app/business/email.py:9999", status:"unconfirmed" }
```

## 设计风格
整体风格参考主流 Admin 后台（如 Ant Design Pro）：白色背景，浅灰分割线
配色：主色蓝 #1677ff，成功绿 #52c41a，警告橙 #fa8c16，中性灰 #8c8c8c
Tab 选中态：蓝色下划线 + 蓝色文字
列表斑马纹：偶数行 #fafafa 背景
抽屉遮罩层半透明黑色
正文代码块：等宽字体，浅灰背景 #f6f8fa，圆角 6px，padding 12px
动态变量高亮：%(xxx)s → 黄色背景 #fff3b0，圆角 2px


## 其他要求
所有交互都在前端完成，无需网络请求
搜索是实时过滤（输入即过滤，不需要点查询也可以看到结果变化），点「查询」只是显式触发一次
关键词搜索匹配范围：sceneName + triggerCondition + title + body
Drawer 打开时背景不滚动
页面整体有内边距，不要贴边
组件命名清晰，分文件组织（NotificationTable, NotificationDrawer, SearchBar, TabNav）
运行命令：pnpm dev，端口 5173

---
