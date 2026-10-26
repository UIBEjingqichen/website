# 网站询价直接发送配置

代码接收接口：`/api/contact`（`functions/api/contact.js`）。网站通过 Cloudflare Pages Functions 调用 Resend，收件人固定为 `sales@tianyuelectric.com`。客户邮件地址设为 Reply-To，便于回复。附件上限为 8 MB，使用实际文件内容发送。网站询盘统一发送到销售邮箱。

## 上线前配置

1. 在 Resend 添加并验证发件域名 `tianyuelectric.com`。按 Resend 显示的完整 DNS 记录添加到 Cloudflare，等待状态变为 Verified；不能假定只加一条 TXT 就足够。不需要建立 `noreply` 收件邮箱。
2. 创建仅用于发送邮件的 Resend API Key，并限制到该域名。
3. 在 Cloudflare Turnstile 创建 Managed widget，允许 `www.tianyuelectric.com`、`tianyuelectric.com`、`website-qd8.pages.dev`，获取 Site Key 和 Secret Key。
4. 在 Pages 项目 `website` 的生产环境配置以下变量；两个 secret 必须加密保存，不要发在聊天里或提交到 GitHub：

| 变量 | 值 |
|---|---|
| `RESEND_API_KEY` | Resend API Key（secret） |
| `TURNSTILE_SECRET_KEY` | Turnstile Secret Key（secret） |
| `TURNSTILE_SITE_KEY` | Turnstile Site Key（公开值） |
| `INQUIRY_FROM` | 可选，默认 `Tianyu Electric <noreply@tianyuelectric.com>` |
| `INQUIRY_HOSTNAMES` | 可选，默认上述三个网站域名，以逗号分隔 |

预览部署需要在 Preview 环境单独配置，或保持不可发送。若要从其他预览域名发送，需同时加入 Turnstile 域名名单及 `INQUIRY_HOSTNAMES`。

5. 确认 Pages Root directory 为仓库根目录，Build output directory 为 `.`（保留现有根首页、dist、images、database、documents、public），Build command 为 `exit 0`。如果现有输出目录已正确，不要改为 dist；这会改变网站路径。`functions` 必须位于项目根目录。环境变量更改后需要重新部署。
6. 部署后打开 `https://www.tianyuelectric.com/api/contact`，应返回 `ready: true` 和公开 siteKey，不返回任何密钥。仅表示配置存在，不能证明域名验证或收信成功。
7. 在正式网站填写一个明确标注“网站测试”的询价，附一份不含敏感信息的小 PDF。检查网页返回参考号、sales@tianyuelectric.com 收件箱/垃圾邮件、附件、产品型号、来源页面和回复地址。确认收到邮件后才算上线完成。

## 运行与限制

- 本地双击 HTML 或普通静态服务器无法执行 Pages Function；会显示在线询价暂不可用，保留直接邮箱入口。可用 Cloudflare Wrangler Pages 本地环境检查函数。
- 成功状态表示 Resend 接受邮件投递请求；最终收件箱投递仍需实际检查。发送失败不清空表单，超时重试保留同一个幂等编号以降低重复投递风险。
- Turnstile 在服务端验证有效性、用途和域名，不关闭验证来测试正式接口。
- 没有把邮件 API Key、Turnstile Secret Key 写入前端，错误响应也不转发邮件服务的内部详情。
- 全部技术字段会发送到指定收件人；附件文件名、扩展名和大小在服务器检查。运营者应按业务需要保存与处理询价资料。
- 上线前必须在正式生产环境确认配置与实际收信；本地自动测试使用模拟服务，不发送真实测试邮件。

官方说明：
- https://developers.cloudflare.com/pages/functions/get-started/
- https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://resend.com/docs/api-reference/emails/send-email
- https://resend.com/docs/dashboard/domains/introduction
