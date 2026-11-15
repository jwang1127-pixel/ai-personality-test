'use strict';
// Browser publishable key is intentionally public. Never place Supabase secret/service_role here.
const PROJECT_URL='https://kqjvyzousekhjdaihmnl.supabase.co';
const PUBLISHABLE_KEY="sb_publishable_DY4-pdIb-gbzOfzzvWv_eg_RALGcLor";
const $=id=>document.getElementById(id);
let db=null, activeUser=null;
const show=(id,yes)=>$(id).classList.toggle('hidden',!yes);
const msg=(id,value,error=false)=>{const n=$(id);n.textContent=value;n.classList.toggle('hidden',!value);n.classList.toggle('error',error)};
const cleanError=e=>String(e?.message||e||'出现错误，请稍后重试').replace(/https?:\/\/\S+/g,'[链接]');
const busy=(yes)=>['loginBtn','signupBtn','resetBtn','postBtn'].forEach(id=>$(id).disabled=yes);
async function refresh(){
  if(!db)return;
  const {data:{user},error}=await db.auth.getUser();
  if(error||!user){activeUser=null;show('authCard',true);show('memberCard',false);show('communityArea',false);return}
  activeUser=user;show('authCard',false);show('memberCard',true);show('communityArea',false);
  const {data:p,error:pe}=await db.from('profiles').select('id,nickname,approved,suspended').eq('id',user.id).maybeSingle();
  if(pe){msg('memberMsg','资料加载失败：'+cleanError(pe),true);return}
  if(!p){msg('memberMsg','账户已建立，会员资料尚在初始化。请稍后刷新。');return}
  $('nickname').value=p.nickname||'';
  show('nameArea',true);
  if(p.suspended){msg('memberMsg','账户已暂停，请联系管理员。');return}
  if(!p.approved){msg('memberMsg','邮箱：'+(user.email||'')+'\n账户已注册，正在等待管理员审核。审核通过后可参与社区讨论。');return}
  msg('memberMsg','欢迎回来，'+p.nickname+'！您已通过社区会员审核。');
  show('communityArea',true);await loadPosts();
}
async function authAction(kind){
 const email=$('email').value.trim(),password=$('password').value;
 if(!email||!$('email').validity.valid){msg('authMsg','请输入有效邮箱。',true);return}
 if(kind!=='reset' && (password.length<8||!$('adult').checked)){msg('authMsg','请确认已年满18岁，并输入至少8位密码。',true);return}
 busy(true);try{
 let result;
 if(kind==='signup')result=await db.auth.signUp({email,password,options:{emailRedirectTo:location.origin+'/community'}});
 else if(kind==='login')result=await db.auth.signInWithPassword({email,password});
 else result=await db.auth.resetPasswordForEmail(email,{redirectTo:location.origin+'/community'});
 if(result.error)throw result.error;
 if(kind==='signup')msg('authMsg','注册请求已提交。请检查邮箱中的验证邮件；通过验证后登录，等待管理员批准。');
 else if(kind==='reset')msg('authMsg','如果邮箱存在对应账户，您将收到重置密码的邮件。');
 else{msg('authMsg','登录成功。');await refresh()}
 }catch(e){msg('authMsg',cleanError(e),true)}finally{busy(false)}
}
async function loadPosts(){
 const area=$('postsArea');area.replaceChildren();
 const {data:posts,error}=await db.from('posts').select('id,author_id,body,created_at,profiles(nickname)').order('created_at',{ascending:false}).limit(50);
 if(error){area.textContent='加载失败：'+cleanError(error);return}
 if(!posts?.length){area.textContent='还没有帖子。欢迎发布第一条真实行动分享！';return}
 for(const p of posts){
 const wrap=document.createElement('div');wrap.className='post';
 const head=document.createElement('div');head.className='row';
 const title=document.createElement('strong');title.textContent=(p.profiles?.nickname||'成员')+' · '+new Date(p.created_at).toLocaleString('zh-CN');
 head.append(title);
 if(p.author_id===activeUser.id){const del=document.createElement('button');del.className='danger';del.textContent='删除帖子';del.onclick=async()=>{if(!confirm('确定删除这条帖子及其评论吗？'))return;const r=await db.from('posts').delete().eq('id',p.id);if(r.error)alert(cleanError(r.error));else await loadPosts()};head.append(del)}
 wrap.append(head);
 const body=document.createElement('p');body.className='postBody';body.textContent=p.body;wrap.append(body);
 const {data:comments,error:ce}=await db.from('comments').select('id,author_id,body,created_at,profiles(nickname)').eq('post_id',p.id).order('created_at',{ascending:true}).limit(100);
 if(ce){const warning=document.createElement('p');warning.textContent='评论暂时无法加载';wrap.append(warning)}
 for(const c of (comments||[])){const line=document.createElement('div');line.className='comment';const text=document.createElement('span');text.textContent=(c.profiles?.nickname||'成员')+'：'+c.body;line.append(text);
 if(c.author_id===activeUser.id){const remove=document.createElement('button');remove.className='danger';remove.textContent='删除';remove.onclick=async()=>{const r=await db.from('comments').delete().eq('id',c.id);if(r.error)alert(cleanError(r.error));else await loadPosts()};line.append(remove)}
 wrap.append(line)}
 const form=document.createElement('form');const inp=document.createElement('textarea');inp.maxLength=1000;inp.required=true;inp.placeholder='发表回复（最多1000字）';inp.setAttribute('aria-label','回复帖子');
 const btn=document.createElement('button');btn.type='submit';btn.textContent='发表评论';form.append(inp,btn);
 form.onsubmit=async e=>{e.preventDefault();const v=inp.value.trim();if(!v)return;btn.disabled=true;
 const r=await db.from('comments').insert({post_id:p.id,author_id:activeUser.id,body:v});
 if(r.error){alert(cleanError(r.error));btn.disabled=false}else await loadPosts()};
 wrap.append(form);area.append(wrap);
 }
}
async function init(){
 if(!window.supabase?.createClient){msg('authMsg','认证组件加载失败。请刷新网页重试。',true);return}
 db=window.supabase.createClient(PROJECT_URL,PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 $('authForm').onsubmit=e=>{e.preventDefault();authAction('login')};
 $('signupBtn').onclick=()=>authAction('signup');$('resetBtn').onclick=()=>authAction('reset');
 $('logoutBtn').onclick=async()=>{await db.auth.signOut();activeUser=null;await refresh()};
 $('saveNameBtn').onclick=async()=>{const nickname=$('nickname').value.trim();if(nickname.length<2||nickname.length>40)return alert('昵称需要2至40个字符');const r=await db.from('profiles').update({nickname}).eq('id',activeUser.id);if(r.error)alert(cleanError(r.error));else await refresh()};
 $('postForm').onsubmit=async e=>{e.preventDefault();const body=$('postText').value.trim();if(!body)return;
 $('postBtn').disabled=true;const r=await db.from('posts').insert({author_id:activeUser.id,body});
 if(r.error)msg('postMsg',cleanError(r.error),true);else{$('postText').value='';msg('postMsg','发布成功');await loadPosts()}$('postBtn').disabled=false};
 $('reloadBtn').onclick=loadPosts;
 db.auth.onAuthStateChange((event,_session)=>{
   if(event==='PASSWORD_RECOVERY'){show('recoveryCard',true);show('authCard',false);show('memberCard',false);show('communityArea',false)}
   else if($('recoveryCard').classList.contains('hidden'))window.setTimeout(refresh,0);
 });
 $('recoveryForm').onsubmit=async e=>{
   e.preventDefault();const password=$('newPassword').value;
   if(password.length<8){msg('recoveryMsg','密码至少8位',true);return}
   $('recoveryBtn').disabled=true;
   const r=await db.auth.updateUser({password});
   if(r.error)msg('recoveryMsg',cleanError(r.error),true);
   else {msg('recoveryMsg','新密码已保存，可以继续使用账户。');$('newPassword').value='';show('recoveryCard',false);await refresh()}
   $('recoveryBtn').disabled=false;
 };
 if($('recoveryCard').classList.contains('hidden'))await refresh();
 const hash=new URLSearchParams(location.hash.substring(1));
 if(hash.has('error_description'))msg('authMsg',hash.get('error_description'),true);
}
window.addEventListener('DOMContentLoaded',init);
