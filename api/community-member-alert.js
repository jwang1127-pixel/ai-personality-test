'use strict';
// Private endpoint: Supabase Auth confirmation trigger -> Resend -> owner only.
// No Supabase service-role key or Resend credential is exposed to the browser.
const { timingSafeEqual, createHmac } = require('node:crypto');
const SAFE_EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[A-Za-z]{2,}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
module.exports = async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  if (req.method !== 'POST') return res.status(405).json({ok:false});
  const configured = process.env.COMMUNITY_ALERT_WEBHOOK_SECRET;
  const {event,user_id,email,ts} = (req.body && typeof req.body==='object') ? req.body : {};
  const signature=req.headers['x-community-alert-signature'];
  const validPayload=(event==='email_verified'||event==='test') &&
    typeof user_id==='string' && UUID.test(user_id) &&
    typeof email==='string' && SAFE_EMAIL.test(email) && email.length<=254 &&
    Number.isSafeInteger(ts) && Math.abs(Date.now()/1000 - ts)<300;
  if (!configured || !validPayload || typeof signature!=='string' || !/^[0-9a-f]{64}$/.test(signature)) return res.status(401).json({ok:false});
  const expected=createHmac('sha256',configured).update(event+'|'+user_id+'|'+email+'|'+ts).digest('hex');
  if (!timingSafeEqual(Buffer.from(expected,'hex'),Buffer.from(signature,'hex'))) return res.status(401).json({ok:false});
  const test=event==='test';
  if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) return res.status(503).json({ok:false,error:'Email service not configured'});
  const message = test ?
    '这是一封AI CoCreate Life新会员自动通知的系统测试邮件。没有真实会员等待审核。' :
    '有一位社区用户已完成邮箱验证，等待人工审核。\n\n注册邮箱：'+email+'\n会员ID：'+user_id+'\n\n请前往 Supabase Dashboard → Authentication → Users 核对邮箱和会员ID，再到 Table Editor → public.profiles 决定是否批准。\n\nhttps://supabase.com/dashboard/project/kqjvyzousekhjdaihmnl/editor\n\n提醒：注册不等于批准；请勿自动把 approved 改成 true。';
  try {
    const response=await fetch('https://api.resend.com/emails',{
      method:'POST',
      headers:{'Authorization':'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},
      body:JSON.stringify({from:'AI CoCreate Life <'+process.env.FROM_EMAIL+'>',to:['jwang1127@gmail.com'],subject:test?'【测试】AI CoCreate Life 新会员审核通知':'【待审核】AI CoCreate Life 社区新会员注册',text:message}),
      signal:AbortSignal.timeout(8000)
    });
    if (!response.ok) {
      console.error('Community email alert provider rejected request, status',response.status);
      return res.status(502).json({ok:false,error:'Email provider failed'});
    }
    return res.status(200).json({ok:true});
  } catch(e) {
    console.error('Community email alert delivery failed:', e?.name||'Error');
    return res.status(502).json({ok:false,error:'Delivery failed'});
  }
};
