const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const buffer = require('micro').buffer;

module.exports = async (req, res) => {
  // 只接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // 获取原始 body - 尝试多种方式
    let rawBody;
    
    if (Buffer.isBuffer(req.body)) {
      rawBody = req.body;
    } else if (typeof req.body === 'string') {
      rawBody = req.body;
    } else {
      // 如果 body 已经被解析，尝试重新序列化
      rawBody = JSON.stringify(req.body);
    }

    // 验证 webhook 签名
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // 处理 checkout.session.completed 事件
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    console.log('Payment successful:', session.id);
    console.log('Customer email:', session.customer_details?.email);

    // 获取客户邮箱
    const customerEmail = session.customer_details?.email;

    if (customerEmail) {
      try {
        // 发送邮件
        await sendReportEmail(customerEmail);
        console.log('Report email sent successfully to:', customerEmail);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    } else {
      console.error('No customer email found in session');
    }
  }

  // 返回成功响应
  res.status(200).json({ received: true });
};

// 发送报告邮件的函数
async function sendReportEmail(toEmail) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY
    }
  });

  const mailOptions = {
    from: 'jwang1127@gmail.com',
    to: toEmail,
    subject: 'Your Biorhythm Report',
    html: `
      <h1>Thank you for your purchase!</h1>
      <p>Your biorhythm report is ready.</p>
      <p>We appreciate your business.</p>
    `
  };

  await transporter.sendMail(mailOptions);
}
