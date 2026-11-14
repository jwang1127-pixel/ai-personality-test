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

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Allow', 'POST');
  if (req.method !== 'POST') return res.status(405).json({error:'仅接受POST报名请求'});
  const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
  if (trim(body.website, 200)) return res.status(200).json({success:true,message:'报名申请已收到。'});
  const name = trim(body.name, 80), email = trim(body.email, 254).toLowerCase();
  const wechat = trim(body.wechat, 100), grade = trim(body.grade, 50), question = trim(body.question, 1500);
  const identity = trim(body.identity, 40);
  const topics = Array.isArray(body.topics) ? [...new Set(body.topics)].filter(t => ALLOWED_TOPICS.has(t)) : [];
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !ALLOWED_IDENTITIES.has(identity) || body.consent !== true || !Array.isArray(body.topics) || body.topics.length > 10) {
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
    await airtableRequest('POST', basePath, key, {records:[{fields:{
      Name:name, Email:email, WeChat:wechat, Identity:identity, Grade:grade,
      Topics:topics.join(', '), Question:question, Status:'Pending', Consent:'Yes',
      Source:'aicocreatelife.com/events', SubmittedAt:new Date().toISOString()
    }}]});
    return res.status(201).json({success:true,message:'报名申请已收到！席位尚待确认，我们将通过邮箱通知活动安排。'});
  } catch (error) {
    console.error('Event registration storage failure:', error.message);
    return res.status(502).json({error:'报名服务暂时不可用，请稍后再试。'});
  }
};
