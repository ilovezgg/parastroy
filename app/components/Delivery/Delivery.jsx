'use client';
import { useState } from 'react';
import './Delivery.css';

export default function Delivery(){
  const [km, setKm] = useState(500);
  const delivery = km * 105;
  return (
    <section id="delivery">
      <div className="sec-head"><h2>Доставка <em>по всей России</em></h2><p>С производства в Пестово. От 105 ₽/км. Шаландой — 2 блока за цену одного.</p></div>
      <div className="card delivery-wrap">
        <div>
          <h3>Калькулятор доставки</h3>
          <div className="size mono">Ставка 105 ₽/км · Формула: цена блока + км×105</div>
          <div style={{display:'flex', gap:12, alignItems:'center', marginTop:18}}>
            <input type="range" min={50} max={2000} step={50} value={km} onChange={e=>setKm(+e.target.value)}/>
            <b className="mono">{km} км</b>
          </div>
          <ul style={{marginTop:20}}>
            <li>Доставка <b>{delivery.toLocaleString()} ₽</b></li>
            <li>1 блок с доставкой <b>{(150000+delivery).toLocaleString()} ₽</b></li>
            <li>2 блока шаландой <b>{(300000+delivery).toLocaleString()} ₽</b></li>
          </ul>
        </div>
        <div className="calc-side">
          <div className="tag">пример из ТЗ</div>
          <h3>Пестово → СПб 500км</h3>
          <ul><li>Блок <b>150 000 ₽</b></li><li>Доставка <b>52 500 ₽</b></li><li>Итого <b>202 500 ₽</b></li></ul>
        </div>
      </div>
    </section>
  )
}