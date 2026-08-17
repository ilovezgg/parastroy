'use client';
import { useEffect, useRef, useState } from 'react';
import './AssemblyScroll.css';

const FRAME_COUNT = 90;

export default function AssemblyScroll(){
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [frames, setFrames] = useState([]);
  const [p, setP] = useState(0);

  useEffect(()=>{
    const arr = [];
    for(let i=0;i<FRAME_COUNT;i++){
      const img = new Image();
      img.src = `/assembly_frames/frame_${String(i).padStart(3,'0')}.webp`;
      arr.push(img);
    }
    setFrames(arr);
  },[]);

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas || !frames.length) return;
    const ctx = canvas.getContext('2d');

    const draw = (idx)=>{
      const img = frames[idx];
      if(!img?.complete || !img.naturalWidth) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = img.naturalWidth * dpr;
      canvas.height = img.naturalHeight * dpr;
      canvas.style.width = `${img.naturalWidth}px`;
      canvas.style.height = `${img.naturalHeight}px`;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.clearRect(0,0,img.naturalWidth,img.naturalHeight);
      ctx.drawImage(img,0,0);
    };

    const onScroll = ()=>{
      const el = wrapRef.current;
      if(!el) return;
      const progress = Math.min(Math.max(-el.getBoundingClientRect().top / (el.offsetHeight - window.innerHeight), 0), 1);
      setP(progress);
      const idx = Math.floor(progress * (FRAME_COUNT-1));
      requestAnimationFrame(()=>draw(idx));
    };

    const first = setInterval(()=>{
      if(frames[0]?.complete) { draw(0); clearInterval(first); }
    }, 100);

    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
    return ()=>window.removeEventListener('scroll', onScroll);
  },[frames]);

  return (
    <section ref={wrapRef} className="assembly-wrap" id="assembly">
      <div className="assembly-sticky">
        <div className="sec-head">
          <h2>Собирается <em>по деталям</em></h2>
          <p>Скролль — смотри как из каркаса получается готовая бытовка</p>
        </div>

        <canvas ref={canvasRef} className="assembly-canvas" />

        <div className="assembly-steps">
          <div className={`a-step ${p < 0.25 ? 'on' : ''}`}><b>01</b><span>Каркас 40×80, сварка</span></div>
          <div className={`a-step ${p >= 0.25 && p < 0.5 ? 'on' : ''}`}><b>02</b><span>Утепление 150мм + пароизоляция</span></div>
          <div className={`a-step ${p >= 0.5 && p < 0.78 ? 'on' : ''}`}><b>03</b><span>Обшивка, окна, дверь, электрика</span></div>
          <div className={`a-step ${p >= 0.78 ? 'on' : ''}`}><b>04</b><span>Готово к отгрузке</span></div>
        </div>

        <div className="assembly-bar"><div style={{width:`${p*100}%`}}/></div>
      </div>
    </section>
  )
}