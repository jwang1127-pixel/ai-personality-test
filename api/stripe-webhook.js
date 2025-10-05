const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sgMail = require('@sendgrid/mail');

// Vercel 需要特殊配置来获取原始请求体
export const config = {
  api: {
    bodyParser: false,
  },
};

module.exports = async (req, res) => {
  console.log('=== Webhook 被调用 ===');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  let body;

  try {
    // 读取原始请求体
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    body = Buffer.concat(chunks).toString('utf8');
    
    console.log('收到原始请求体');
    
    // 验证 webhook 签名
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log('Webhook 验证成功，事件类型:', event.type);
    
  } catch (err) {
    console.error('Webhook 处理失败:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('收到支付成功事件:', session.id);
    
    try {
      const metadata = session.metadata;
      console.log('Metadata:', metadata);
      
      const userEmail = metadata.email || session.customer_details.email;
      const userName = metadata.name || 'Valued Customer';
      
      console.log('准备发送邮件到:', userEmail);
      
      // 配置 SendGrid
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      // 简单测试邮件
      const msg = {
        to: userEmail,
        from: 'info@aicocreatelife.com',
        subject: '测试 - 您的AI共创人生报告正在生成',
        text: `${userName}，您好！我们收到了您的订单（${session.id}）。详细报告将在5分钟内发送到此邮箱。`,
        html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4facfe;">感谢您的购买！</h2>
          <p><strong>${userName}</strong>，您好！</p>
          <p>我们已收到您的订单（订单号：${session.id}）。</p>
          <p>详细的性格分析报告正在生成中，将在 <strong>5分钟内</strong> 发送到此邮箱。</p>
          <p>如果有任何问题，请联系：info@aicocreatelife.com</p>
        </div>`
      };
      
      await sgMail.send(msg);
      console.log('测试邮件发送成功到:', userEmail);
      
    } catch (error) {
      console.error('发送邮件失败:', error);
      if (error.response) {
        console.error('SendGrid 错误:', error.response.body);
      }
    }
  }

  res.status(200).json({ received: true });
};
