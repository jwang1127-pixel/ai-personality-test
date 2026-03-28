const { Resend } = require('resend');
const { generateReport } = require('../report-generator/generateReport');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { wechat, source, scores } = req.body;
  if (!wechat) return res.status(400).json({ error: '微信号不能为空' });

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@aicocreatelife.com';
    const TO_EMAIL = process.env.ADMIN_EMAIL || FROM_EMAIL;

    // 如果有分数，生成报告
    let reportHtml = '';
    if (scores) {
      try {
        const report = await generateReport(scores);
        reportHtml = `
          <hr/>
          <h2>📊 用户完整报告</h2>
          ${report}
        `;
      } catch (e) {
        reportHtml = `<p>报告生成失败：${e.message}</p>`;
      }
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `新用户留下微信号 - ${wechat}`,
      html: `
        <h2>新用户留下微信号</h2>
        <p><strong>微信号：</strong>${wechat}</p>
        <p><strong>来源：</strong>${source || '未知'}</p>
        <p><strong>时间：</strong>${new Date().toLocaleString('zh-CN')}</p>
        ${reportHtml}
      `
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('失败:', error);
    res.status(500).json({ error: '发送失败' });
  }
};