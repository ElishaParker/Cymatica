const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
const btn=document.getElementById('startBtn');
let audioCtx,analyser,dataArray,time=0;

function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}
window.onresize=resize;resize();

btn.onclick=async()=>{
  try{
    audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    await audioCtx.resume();
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});
    const source=audioCtx.createMediaStreamSource(stream);
    analyser=audioCtx.createAnalyser();
    analyser.fftSize=512;
    dataArray=new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);
    btn.style.display='none';
    draw();
  }catch(e){alert('Microphone permission denied');console.error(e);}
};

function draw(){
  requestAnimationFrame(draw);
  if(!analyser)return;
  analyser.getByteFrequencyData(dataArray);
  ctx.fillStyle='rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  const cx=canvas.width/2,cy=canvas.height/2;
  const baseR=Math.min(cx,cy)/3;
  const avg=dataArray.reduce((a,b)=>a+b,0)/dataArray.length/255;
  const amp=avg*80;
  const N=180;
  time+=0.03;

  ctx.beginPath();
  for(let i=0;i<=N;i++){
    const angle=(i/N)*Math.PI*2;
    const freq=dataArray[Math.floor(i/N*dataArray.length)];
    const localAmp=(freq/255)*amp;
    const r=baseR+Math.sin(angle*6+time)*localAmp;
    const x=cx+Math.cos(angle)*r;
    const y=cy+Math.sin(angle)*r;
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  }
  ctx.closePath();
  const grad=ctx.createRadialGradient(cx,cy,baseR*0.1,cx,cy,baseR*1.1);
  grad.addColorStop(0,'rgba(0,255,255,0.8)');
  grad.addColorStop(1,'rgba(0,0,128,0.3)');
  ctx.fillStyle=grad;
  ctx.fill();
}