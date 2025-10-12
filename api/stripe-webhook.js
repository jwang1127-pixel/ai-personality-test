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

  let reportData = null;

  // 处理 checkout.session.completed 事件（推荐方式）
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    console.log('💳 收到 Checkout Session 完成事件');
    console.log('📧 客户邮箱:', session.customer_email);
    console.log('📦 Session Metadata:', session.metadata);

    // 从分散的 metadata 字段构建 scores 对象
    const scores = {
      openness: parseInt(session.metadata?.openness || '50'),
      conscientiousness: parseInt(session.metadata?.conscientiousness || '50'),
      extraversion: parseInt(session.metadata?.extraversion || '50'),
      agreeableness: parseInt(session.metadata?.agreeableness || '50'),
      neuroticism: parseInt(session.metadata?.neuroticism || '50')
    };

    console.log('📊 构建的分数对象:', scores);

    reportData = {
      email: session.customer_email || session.metadata?.email,
      name: session.metadata?.name || session.customer_details?.name || 'User',
      scores: scores
    };
  } 
  // 处理 payment_intent.succeeded 事件（当前系统使用的）
  else if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    console.log('💳 收到 Payment Intent 成功事件');
    console.log('📧 Receipt Email:', paymentIntent.receipt_email);
    console.log('📦 Payment Intent Metadata:', paymentIntent.metadata);

    // 从分散的 metadata 字段构建 scores 对象
    const scores = {
      openness: parseInt(paymentIntent.metadata?.openness || '50'),
      conscientiousness: parseInt(paymentIntent.metadata?.conscientiousness || '50'),
      extraversion: parseInt(paymentIntent.metadata?.extraversion || '50'),
      agreeableness: parseInt(paymentIntent.metadata?.agreeableness || '50'),
      neuroticism: parseInt(paymentIntent.metadata?.neuroticism || '50')
    };

    console.log('📊 构建的分数对象:', scores);

    reportData = {
      email: paymentIntent.receipt_email || paymentIntent.metadata?.email,
      name: paymentIntent.metadata?.name || 'User',
      scores: scores
    };

    if (!reportData.email) {
      console.error('❌ payment_intent 中没有邮箱地址！');
    }
  }

  // 如果有报告数据，发送报告
  if (reportData && reportData.email) {
    console.log('📊 准备发送报告，数据:', reportData);
    await sendReport(reportData);
  } else {
    console.log('⚠️ 没有足够的数据发送报告');
  }

  // 返回 200 给 Stripe，表示已收到 webhook
  return res.status(200).json({ received: true });
};

// 发送报告的函数
async function sendReport(reportData) {
  try {
    console.log('🔄 调用 send-report API...');
    console.log('📧 邮箱:', reportData.email);
    console.log('👤 姓名:', reportData.name);
    console.log('📊 分数:', reportData.scores);

    const sendReportUrl = 'https://www.aicocreatelife.com/api/send-report';
    
    console.log('🌐 调用 URL:', sendReportUrl);

    const response = await fetch(sendReportUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Stripe-Webhook-Internal'
      },
      body: JSON.stringify(reportData)
    });

    console.log('📡 响应状态码:', response.status);
    console.log('📡 响应 Content-Type:', response.headers.get('content-type'));

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ 返回的不是 JSON:', text.substring(0, 200));
      throw new Error('send-report 返回了 HTML');
    }

    const result = await response.json();

    if (response.ok) {
      console.log('✅ send-report 成功:', result);
      console.log('📧 完整报告已发送到:', reportData.email);
    } else {
      console.error('❌ send-report 失败:', result);
    }
  } catch (error) {
    console.error('❌ sendReport 执行失败:', error.message);
    console.error('错误堆栈:', error.stack);
  }
}