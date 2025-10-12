import { buffer } from 'micro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // 验证 webhook 签名
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      // 测试环境，跳过签名验证
      event = JSON.parse(buf.toString());
    }
  } catch (err) {
    console.error('❌ Webhook 签名验证失败:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log('✅ Webhook 验证成功');
  console.log('📦 事件类型:', event.type);

  // 处理 checkout.session.completed 事件
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    console.log('💳 收到支付成功事件');
    console.log('📧 客户邮箱:', session.customer_email);
    console.log('👤 元数据:', session.metadata);

    // 准备发送报告的数据
    const reportData = {
      email: session.customer_email,
      name: session.metadata?.user_name || session.customer_details?.name || 'User',
      scores: JSON.parse(session.metadata?.test_scores || '{}')
    };

    console.log('📊 报告数据:', reportData);

    // 调用新的 send-report API
    try {
      console.log('🔄 调用 send-report API...');
      
      const sendReportUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}/api/send-report`
        : 'https://www.aicocreatelife.com/api/send-report';

      console.log('🌐 API URL:', sendReportUrl);

      const response = await fetch(sendReportUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData)
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ send-report 返回成功:', result);
        console.log('📧 完整报告已发送到:', reportData.email);
      } else {
        console.error('❌ send-report 返回失败:', result);
        console.error('状态码:', response.status);
      }
    } catch (error) {
      console.error('❌ 调用 send-report 失败:', error);
      console.error('错误详情:', error.message);
    }
  }

  // 返回 200 给 Stripe，表示已收到 webhook
  res.status(200).json({ received: true });
};