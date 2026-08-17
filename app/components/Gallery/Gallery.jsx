'use client';
import { useState } from 'react';
import './Gallery.css';

const gallery = [
  {src:"/images/construction_cabin_sideview_3.webp", tag:"Б-01 · ФБС · RAL 7024", sub:"Пестово", h:"h-", col:"col-span-8"},
  {src:"/images/construction_cabin_interior_2.webp", tag:"Интерьер · ДВП", sub:"Стол прораба", h:"h-", col:"col-span-4"},
  {src:"/images/construction_cabin_sideview.webp", tag:"Экстерьер", sub:"С8 0.45", h:"h-", col:"col-span-4"},
  {src:"/images/construction_cabin_sideview_1.webp", tag:"Боковой вид", sub:"на ФБС", h:"h-", col:"col-span-4"},
  {src:"/images/construction_cabin_sideview_2.webp", tag:"На ФБС блоках", sub:"без фундамента", h:"h-", col:"col-span-4"},
  {src:"/images/construction_cabin_interior.webp", tag:"Интерьер", sub:"ДСП 16мм", h:"h-", col:"col-span-4"},
  {src:"/images/construction_cabin_interior_1.webp", tag:"Отделка ДВП", sub:"минвата 50мм", h:"h-", col:"col-span-4"},
  {src:"/images/construction_cabin_interior_3.webp", tag:"Окно ПВХ", sub:"1000×1000", h:"h-", col:"col-span-4"},
];

export default function Gallery(){
  const [lightbox, setLightbox] = useState(null);
  return (
    <section id="specs">
      <div className="sec-head">
        <h2>Б-01 вживую — <em>экстерьер и интерьер</em></h2>
        <p>Реальные фото с площадки в Пестово: RAL 7024, С8 0.45, ФБС блоки.</p>
      </div>

      <div className="grid grid-cols-12 gap-4 mt-4">
        {gallery.map((g)=>(
          <div key={g.src} className={`${g.col} g-card`} onClick={()=>setLightbox(g.src)}>
            <img src={g.src} alt={g.tag} className={`w-full ${g.h} object-cover block`}/>
            <div className="meta">
              <div>
                <div className="tag">{g.tag}</div>
                <div className="size">{g.sub}</div>
              </div>
              <span className="arrow">↗</span>
            </div>
          </div>
        ))}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={()=>setLightbox(null)}>
          <img src={lightbox}/>
        </div>
      )}
    </section>
  )
}