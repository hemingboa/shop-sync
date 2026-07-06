const express=require('express'),cors=require('cors'),fs=require('fs'),path=require('path');
const app=express(),PORT=process.env.PORT||3000,DATA_DIR=path.join(__dirname,'data');
app.use(cors());app.use(express.json({limit:'50mb'}));
if(!fs.existsSync(DATA_DIR))fs.mkdirSync(DATA_DIR);
function auth(req,res,next){const k=req.headers['x-sync-key'],u=req.headers['x-user-id']||'default',kf=path.join(DATA_DIR,u+'.key');if(fs.existsSync(kf)&&k!==fs.readFileSync(kf,'utf8').trim())return res.status(401).json({error:'密钥错误'});if(!fs.existsSync(kf)&&k)fs.writeFileSync(kf,k);next();}
app.get('/api/health',(req,res)=>res.json({status:'ok',time:new Date().toISOString()}));
app.post('/api/sync/push',auth,(req,res)=>{try{fs.writeFileSync(path.join(DATA_DIR,(req.headers['x-user-id']||'default')+'.json'),JSON.stringify(req.body));res.json({success:true,message:'数据已保存'});}catch(e){res.status(500).json({error:e.message});}});
app.get('/api/sync/pull',auth,(req,res)=>{try{const f=path.join(DATA_DIR,(req.headers['x-user-id']||'default')+'.json');res.json(fs.existsSync(f)?JSON.parse(fs.readFileSync(f,'utf8')):{products:[],records:[]});}catch(e){res.status(500).json({error:e.message});}});
app.listen(PORT,()=>console.log('Server running on port '+PORT));
