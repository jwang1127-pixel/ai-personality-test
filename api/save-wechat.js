const { Resend } = require('resend');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { wechat, source } = req.body;
  if (!wechat) return res.status(400).json({ error: '微信号不能为空' });

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@aicocreatelife.com';
    const TO_EMAIL = process.env.ADMIN_EMAIL || FROM_EMAIL;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: '新用户留下微信号 - AI共创人生',
      html: `
        <h2>新用户留下微信号</h2>
        <p><strong>微信号：</strong>${wechat}</p>
        <p><strong>来源：</strong>${source || '未知'}</p>
        <p><strong>时间：</strong>${new Date().toLocaleString('zh-CN')}</p>
      `
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('发送邮件失败:', error);
    res.status(500).json({ error: '发送失败' });
  }
};