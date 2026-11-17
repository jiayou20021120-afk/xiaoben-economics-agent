import system from './system.js';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization','Cache-Control':'no-store'};
export default {
 async fetch(request,env){
  const path=new URL(request.url).pathname;
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  if(path==='/health')return Response.json({service:'校本教材编审智能体',model:'deepseek-flash',configured:!!env.DEEPSEEK_API_KEY},{headers:cors});
  if(path!=='/api/chat'||request.method!=='POST')return new Response('Not found',{status:404,headers:cors});
  if(!env.DEEPSEEK_API_KEY)return Response.json({error:{message:'模型服务尚未连接。'}},{status:503,headers:cors});
  const raw=await request.text();
  if(raw.length>160000)return Response.json({error:{message:'书稿过长，请按章节审读。'}},{status:413,headers:cors});
  const body=JSON.parse(raw);
  if(!Array.isArray(body.messages)||body.messages.length>10||body.messages.some(m=>typeof m.content!=='string'))return Response.json({error:{message:'问答格式不正确。'}},{status:400,headers:cors});
  const messages=[{role:'system',content:system},...body.messages.filter(m=>['user','assistant'].includes(m.role)).map(m=>({role:m.role,content:m.content}))];
  const r=await fetch('https://api.deepseek.com/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+env.DEEPSEEK_API_KEY},body:JSON.stringify({model:'deepseek-flash',messages,stream:false,max_tokens:3500,thinking:{type:'disabled'}})});
  return new Response(r.body,{status:r.status,headers:{...cors,'Content-Type':'application/json'}});
 }
};
