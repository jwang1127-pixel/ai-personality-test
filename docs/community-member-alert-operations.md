# AI CoCreate Life 社区新会员审核邮件通知 v1.0

## 已实现
- 触发点：Supabase Auth 的 `auth.users.email_confirmed_at` 首次变为非空；首次插入即完成验证的账户也适用。
- 仅当用户的 `public.profiles` 存在、`approved=false` 且 `suspended=false` 时通知。
- 私有表 `private.community_member_alert_log` 的 `user_id` 唯一，避免数据库重复排队。
- Supabase `pg_net` 将带有HMAC-SHA256签名与5分钟时间窗口的事件发送给 Vercel `/api/community-member-alert`。
- Vercel验证签名后调用已有的 `RESEND_API_KEY`，通知只发送给 `jwang1127@gmail.com`，不会给普通会员发送通知邮件。
- 共享签名密钥仅在Supabase Vault与Vercel加密环境变量中保存；网页和GitHub均无密钥。
- 原有的审核流程仍为人工批准：管理员确认注册邮箱和用户身份，改 `public.profiles.approved=true`。
- 失败排查：Supabase SQL `select user_id,queued_at,request_id from private.community_member_alert_log order by queued_at desc;` 和最近6小时 `net._http_response`；Vercel Runtime Logs及Resend发送日志。
- 邮件发送属于异步操作，不应将排队视为已投递；故障或服务商限制时需人工查看待审核者。
- 不对已有两位已批准的测试用户补发。邮件提供的是邮箱验证后待审核通知，不代表会员已获得批准。

## 运营
1. 收到“【待审核】AI CoCreate Life 社区新会员注册”邮件。
2. Supabase → Authentication → Users核验账号及邮箱验证状态。
3. Table Editor → `public.profiles` 找到相同ID，确认合规后人工批准。
4. 若收不到邮件，可直接查 `public.profiles` 中 `approved=false` 的账户；不要仅依赖邮件。
5. 可通过受控管理员操作另行调用内部测试事件向自己的邮箱发送测试邮件，不伪造真实会员。

## 数据保护
- Vercel接口拒绝未经签名的请求，并且只有固定管理员邮箱是收件人，无法通过POST指定其他收件人。
- 不允许网页用户调用私有触发函数；签名密钥未进入浏览器。
- 通知邮件包含已验证注册邮箱、用户UUID，供管理员核对；不得转发到公共群。
- 密钥轮换：同时更换Supabase Vault与Vercel环境变量，之后重新部署Vercel项目。
