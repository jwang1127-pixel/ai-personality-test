# AI CoCreate Life 会员社区 MVP：认证及预览 v0.1

当前分支：`feature/community-auth-mvp`。未向生产发布，且不更改已经上线的报名系统。URL：`/community`。

## 当前实现
- Supabase Auth：邮箱注册、邮箱验证跳转、密码登录、退出、请求重设密码、重设密码页面。
- 已审核会员才可阅读/发布/评论；未审核成员可登录查看待审核状态。
- 资料：昵称修改；帖子与评论：纯文本发布、读取、删除自己的内容。
- 会员审核及管理员操作：暂时只能通过受控 Supabase Dashboard 操作；不在前端授予权限。
- Supabase 表：`profiles`、`posts`、`comments`；三表 RLS 开启；浏览器仅使用公开 publishable key。未使用任何 secret/service_role key。
- 目前受邀成人小范围试验，不公开发布，不自动确认通过、不支持私信图片。

## 上线前的必要配置（不能跳过）
1. Supabase Dashboard → Authentication → Email：确认 Email Provider 开启，**Confirm Email 开启**，不可为赶进度关闭验证。
2. Dashboard → Authentication → SMTP Settings：配置自有 Resend SMTP 发信。
   - Host: `smtp.resend.com`
   - Port: `465`（SSL）或供应商支持的端口
   - Username: `resend`
   - Password: 在 Resend 控制台取得的有效 API Key。**不要写进 GitHub、页面或聊天**。
   - From address: 在 Resend 已验证的发信域名下的实际地址。
   - 配置之前 Supabase 的测试邮件只能发给项目团队的预授权地址。
3. Dashboard → Authentication → URL Configuration：
   - Site URL：`https://www.aicocreatelife.com/community`（仅在上线后使用）
   - Redirect URLs：确切的 `https://www.aicocreatelife.com/community`；需要测试预览时，另添加**确切**预览链接，不用 `*.vercel.app` 通配。
4. 注册后默认为 `approved=false`；管理员确认用户是成人且自愿加入后，在 Supabase Dashboard → Table Editor → profiles，将相应用户的 `approved` 设为 true；首位管理员 `is_admin` 只能在受控后台手动设置，不在网页开放。
5. 在**受控**测试环境验证：新用户收验证邮件；未验证用户不可登录；已验证待审核者不能读取帖子或发帖；审核后发帖评论；另一普通用户不可修改或删除他人的内容；退出；重置密码；手机页面；基本滥用防护。
6. 任何真实公开邀请之前，补齐社区规则、账户删除及举报操作的固定联系方式，审核后台流程和数据备份。生产页面需移除“预览版”。
7. 通过验证并单独批准后，才把 PR 合并到主分支并开放社区注册链接。

## 费用及隐私
使用已有 Vercel + 免费 Supabase 项目和已有 Resend；以无新增月费为目标，仍需检查额度、免费项目自动暂停及备份限制。用户注册独立于活动报名；活动报名者不会自动成为社区用户。证据应来自真实用户使用，且按USPTO准确申报服务核对是否合格。

## 测试边界
预览页面的 HTTP、静态 JS 语法和 CDN可用性可以自动检查；不能替代真实用户验证邮箱、RLS跨账户、密码恢复及邮件到达测试。未完成这些测试之前不宣称功能已经正式可用。
