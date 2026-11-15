const https = require('https');

const ALLOWED_IDENTITIES = new Set(['家长','中学生／大学生','职场人士','创业者','其他']);
const ALLOWED_TOPICS = new Set(['学业与大学升学','竞赛与企业实习','就业与职场转型','创业与AI商业项目','AI时代的人生方向']);
const trim = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';
function airtableRequest(method, path, key, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : '';
    const request = https.request({
      hostname: 'api.airtable.com', path, method, timeout: 9000,
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
        ...(body ? {'Content-Length': Buffer.byteLength(payload)} : {})
      }
    }, response => {
      let text = '';
      response.on('data', chunk => { text += chunk; if (text.length > 16000) response.destroy(); });
      response.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(text); } catch (_) { return reject(new Error('Invalid storage response')); }
        if (response.statusCode < 200 || response.statusCode >= 300) return reject(new Error('Storage request failed: ' + response.statusCode));
        resolve(parsed);
      });
    });
    request.on('timeout', () => request.destroy(new Error('Storage timeout')));
    request.on('error', reject);
    request.end(payload || undefined);
  });
}

// Notify the event organizer only after the new Airtable record is created.
// Resend accepts the message; inbox delivery is not guaranteed by this response.
function sendOrganizerNotification({name, submittedAt, testMode}) {
  const token = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL;
  const to = process.env.ADMIN_EMAIL;
  if (!token || !from || !to) return Promise.reject(new Error('Notification mail settings are missing'));
  const subject = (testMode ? '[测试] ' : '') + 'AI CoCreate Life：收到新的活动报名申请';
  const payload = JSON.stringify({
    from, to: [to], subject,
    text: [
      testMode ? '这是系统测试记录，不是真实报名。' : '网站收到一份新的活动报名申请。',
      '活动：AI时代，我的路在何方？',
      '时间：2026年11月19日 10:00–11:30',
      '报名者：' + name,
      '提交时间（UTC）：' + submittedAt,
      '请登录 Airtable → AI Personality Test Data → Event Registrations 查看详情。',
      '该申请状态为 Pending，尚未确认席位；请核对并单独通知报名者。',
      '这封邮件不包含报名者邮箱、微信号及自由填写的隐私信息。'
    ].join('\n')
  });
  return new Promise((resolve, reject) => {
    const request = https.request({
      hostname: 'api.resend.com', path: '/emails', method: 'POST', timeout: 7000,
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, response => {
      let data = '';
      response.on('data', chunk => { data += chunk; if (data.length > 5000) response.destroy(); });
      response.on('end', () => {
        if (response.statusCode === 200 || response.statusCode === 201) return resolve(true);
        reject(new Error('Mail provider returned HTTP ' + response.statusCode));
      });
    });
    request.on('timeout', () => request.destroy(new Error('Mail provider timeout')));
    request.on('error', reject);
    request.end(payload);
  });
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('Allow', 'POST');
  if (req.method !== 'POST') return res.status(405).json({error:'仅接受POST报名请求'});
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin) {
    let originHost;
    try { originHost = new URL(origin).host; } catch (_) { return res.status(403).json({error:'请求来源无效'}); }
    if (originHost !== host) return res.status(403).json({error:'请从活动报名网页提交申请'});
  }
  if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) return res.status(415).json({error:'请使用报名网页提交申请'});
  const size = Number(req.headers['content-length'] || 0);
  if (size > 8192) return res.status(413).json({error:'提交内容过长'});
  if (req.body && JSON.stringify(req.body).length > 8192) return res.status(413).json({error:'提交内容过长'});
  const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
  if (trim(body.website, 200)) return res.status(200).json({success:true,message:'报名申请已收到。'});
  const name = trim(body.name, 80), email = trim(body.email, 254).toLowerCase();
  const wechat = trim(body.wechat, 100), grade = trim(body.grade, 50), question = trim(body.question, 1500);
  const identity = trim(body.identity, 40);
  const topics = Array.isArray(body.topics) ? [...new Set(body.topics)].filter(t => ALLOWED_TOPICS.has(t)) : [];
  const inputsWithinLimits = [
    ['name',80],['email',254],['wechat',100],['identity',40],['grade',50],['question',1500]
  ].every(([k,max]) => body[k] == null || (typeof body[k] === 'string' && body[k].length <= max));
  if (!inputsWithinLimits || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !ALLOWED_IDENTITIES.has(identity) || body.consent !== true || !Array.isArray(body.topics) || body.topics.length > 10 || body.topics.some(t=>!ALLOWED_TOPICS.has(t))) {
    return res.status(400).json({error:'请填写姓名、有效邮箱、身份并同意报名信息使用说明。'});
  }
  const key = process.env.AIRTABLE_API_KEY;
  const base = process.env.EVENT_AIRTABLE_BASE_ID;
  const table = process.env.EVENT_AIRTABLE_TABLE_ID;
  if (!key || !base || !table) return res.status(503).json({error:'报名服务尚未开放，请稍后再试。'});
  const basePath = '/v0/' + encodeURIComponent(base) + '/' + encodeURIComponent(table);
  try {
    // Advisory duplicate check. Concurrent submissions may still race; confirm/edit in Airtable.
    const formula = '{Email}=' + JSON.stringify(email);
    const lookupPath = basePath + '?maxRecords=1&filterByFormula=' + encodeURIComponent(formula);
    const existing = await airtableRequest('GET', lookupPath, key);
    if (existing.records && existing.records.length) return res.status(200).json({success:true,message:'这个邮箱已有报名申请，我们将按原申请联系您。'});
    const submittedAt = new Date().toISOString();
    const created = await airtableRequest('POST', basePath, key, {records:[{fields:{
      Name:name, Email:email, WeChat:wechat, Identity:identity, Grade:grade,
      Topics:topics.join(', '), Question:question, Status:'Pending', Consent:'Yes',
      Source:'aicocreatelife.com/events', SubmittedAt:submittedAt, NotificationStatus:'Not Sent'
    }}]});
    const recordId = created.records && created.records[0] && created.records[0].id;
    // Email is a best-effort side effect. Saving the registration is the source of truth.
    let notificationStatus = 'Failed';
    try {
      await sendOrganizerNotification({
        name, submittedAt,
        testMode: email.endsWith('@example.com') && name.startsWith('NOTIFICATION TEST')
      });
      notificationStatus = 'Sent';
    } catch (mailError) {
      console.error('Event admin email notification failed:', mailError.message);
    }
    if (recordId) {
      try {
        await airtableRequest('PATCH', basePath, key, {records:[{id:recordId,fields:{NotificationStatus:notificationStatus}}]});
      } catch (trackingError) {
        console.error('Could not save notification status:', trackingError.message);
      }
    }
    return res.status(201).json({success:true,message:'报名申请已收到！席位尚待确认，我们将通过邮箱通知活动安排。'});
  } catch (error) {
    console.error('Event registration storage failure:', error.message);
    return res.status(502).json({error:'报名服务暂时不可用，请稍后再试。'});
  }
};
