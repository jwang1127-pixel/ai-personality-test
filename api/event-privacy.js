const https = require('https');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') return res.status(405).json({error:'仅接受POST'});
  const origin = req.headers.origin;
  if (origin) {
    try { if (new URL(origin).host !== req.headers.host) return res.status(403).json({error:'请从网页提交'}); }
    catch (_) { return res.status(403).json({error:'请求来源无效'}); }
  }
  if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) return res.status(415).json({error:'请从网页提交'});
  const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (typeof body.website === 'string' && body.website.length > 0) return res.status(200).json({success:true,message:'申请已收到'});
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !['Access','Delete'].includes(body.type)) return res.status(400).json({error:'请输入有效邮箱并选择请求类型'});
  const key = process.env.AIRTABLE_API_KEY;
  const base = process.env.EVENT_AIRTABLE_BASE_ID;
  const table = process.env.EVENT_PRIVACY_TABLE_ID;
  if (!key || !base || !table) return res.status(503).json({error:'隐私请求服务暂不可用'});
  try {
    const payload = JSON.stringify({records:[{fields:{Email:email,RequestType:body.type,Status:'Pending',SubmittedAt:new Date().toISOString()}}]});
    const result = await new Promise((resolve,reject)=>{
      const request=https.request({hostname:'api.airtable.com',path:'/v0/'+encodeURIComponent(base)+'/'+encodeURIComponent(table),method:'POST',timeout:9000,
        headers:{Authorization:'Bearer '+key,'Content-Type':'application/json','Content-Length':Buffer.byteLength(payload)}},response=>{
        let data='';response.on('data',c=>{data+=c;if(data.length>16000)response.destroy()});
        response.on('end',()=>{if(response.statusCode===200)return resolve(true);reject(new Error('Airtable status '+response.statusCode))});
      });
      request.on('error',reject);request.on('timeout',()=>request.destroy(new Error('Timeout')));request.end(payload);
    });
    return res.status(201).json({success:result,message:'申请已收到。我们将核验请求者与报名邮箱的关系后处理。'});
  } catch(error){console.error('Privacy request submission failed:',error.message);return res.status(502).json({error:'暂时无法提交，请稍后重试'});}
};
