'use client';
import { useState } from 'react';
import './Quiz.css';

const STEPS = [
  { type: 'single', q: 'Для чего вам нужно помещение?', opts: ['Стройка / рабочие','Охрана / КПП','Дача / хозблок','Офис / прорабская','Жить / общежитие','Передвижной пункт'] },
  { type: 'single', q: 'Сколько человек и на какой срок?', opts: ['1-2 чел, на сезон','3-4 чел, на год','5-10 чел, на долго','10+ чел, здание','Под склад / оборудование'] },
  { type: 'single', q: 'Где будет стоять? Какие условия?', opts: ['Подмосковье, ровно','Регион, далеко везти','Бездорожье / север','В городе, антивандал','Зима до -40, теплое'] },
  { type: 'single', q: 'Что важнее всего?', opts: ['Самая низкая цена','Тепло зимой','Перевезти за 1 день','Чтобы не вскрыли','Приличный вид'] },
  { type: 'multi', q: 'Что должно быть внутри?', opts: ['Пустая коробка','Кровати / спальные','Стол, стулья, свет','Туалет / Душ / Кухня','2 входа, тамбур, окна'] },
  { type: 'double', q: 'Когда нужно и кто решает?' },
  { type: 'lead', q: 'Финал' }
];

export default function QuizUnistroy(){
  const [step,setStep]=useState(0);
  const [ans,setAns]=useState({});
  const [multi,setMulti]=useState([]);
  const [when,setWhen]=useState('');
  const [who,setWho]=useState('');
  const [phone,setPhone]=useState('');
  const [done,setDone]=useState(false);

  const cur = STEPS[step];
  const progress = ((step+1)/7)*100;
  const canNext = cur.type==='multi'? multi.length>0 : cur.type==='double'? (when && who) : true;

  if(done) return (
    <div className="uni-wrap">
      <div className="uni-card thanks">
        <div className="uni-pill"><span className="dot">•</span> ЗАЯВКА ПРИНЯТА</div>
        <h3>Заявка принята • считаем доставку</h3>
        <p>Перезвоним за 7 минут на {phone}</p>
      </div>
    </div>
  );

  if(step===6) return (
    <div className="uni-wrap">
      <div className="uni-header">
        <div className="top">
          <div className="uni-pill"><span className="dot">•</span> РАСЧЕТ ГОТОВ • 3 КОМПЛЕКТАЦИИ</div>
          <div className="step">07 / 07</div>
        </div>
        <h1>Готово! <b>Подобрали 3 варианта</b> под ваш запрос</h1>
        <div className="progress"><div style={{width:`${progress}%`}} /></div>
      </div>
      <div className="uni-black-card">
        <div className="bonus-grid">
          <div className="bonus"><i>✓</i> Расчет доставки до участка</div>
          <div className="bonus"><i>✓</i> 3 варианта под бюджет</div>
          <div className="bonus"><i>✓</i> Фикс цены на 14 дней</div>
          <div className="bonus"><i>✓</i> Чертеж и фото вживую</div>
        </div>
        <div className="form-row">
          <input className="uni-input light" placeholder="+7 999 123-45-67" value={phone} onChange={e=>setPhone(e.target.value)} />
          <button className="btn-white" onClick={()=> phone.length>6 && setDone(true)}>Получить расчет <span className="circle">↗</span></button>
        </div>
        <div className="small">Нажимая кнопку, вы соглашаетесь с обработкой данных</div>
      </div>
    </div>
  );

  return (
    <div className="uni-wrap">
      <div className="uni-header">
        <div className="top">
          <div className="uni-pill"><span className="dot">•</span> КВИЗ ЗА 60 СЕКУНД</div>
          <div className="step">0{step+1} / 07</div>
        </div>
        <h1>Подберем блок и посчитаем доставку <b>за 60 секунд</b></h1>
        <div className="progress"><div style={{width:`${progress}%`}} /></div>
      </div>

      <div className="uni-card">
        <div className="q-head">
          <h2>{cur.q}</h2>
          <span className="num">0{step+1}</span>
        </div>

        {cur.type==='single' && (
          <div className="grid">
            {cur.opts.map((o,i)=>(
              <div key={o} className={`opt ${ans[step]===o?'sel':''}`} onClick={()=>{ setAns({...ans,[step]:o}); setTimeout(()=>setStep(s=>s+1),250); }}>
                <div><div className="meta">0{i+1} / ВАРИАНТ</div><div className="label">{o}</div></div>
                <div className="check" />
              </div>
            ))}
          </div>
        )}

        {cur.type==='multi' && (
          <>
            <div className="grid">
              {cur.opts.map((o,i)=>(
                <div key={o} className={`opt ${multi.includes(o)?'sel':''}`} onClick={()=> setMulti(m=>m.includes(o)?m.filter(x=>x!==o):[...m,o])}>
                  <div><div className="meta">0{i+1} / ОПЦИЯ</div><div className="label">{o}</div></div>
                  <div className="check" />
                </div>
              ))}
            </div>
            <div className="nav">
              <button className="back" onClick={()=>setStep(s=>Math.max(0,s-1))}>Назад</button>
              <button className="btn-black" disabled={!canNext} onClick={()=>{ setAns({...ans,[step]:multi}); setMulti([]); setStep(s=>s+1); }}>Далее <span className="circle">↗</span></button>
            </div>
          </>
        )}

        {cur.type==='double' && (
          <>
            <div className="sec">Срок</div>
            <div className="grid">
              {['Срочно, на этой неделе','В этом месяце','Через 2-3 месяца','Просто считаю'].map(o=>(
                <div key={o} className={`opt ${when===o?'sel':''}`} onClick={()=>setWhen(o)}><div className="label">{o}</div><div className="check"/></div>
              ))}
            </div>
            <div className="sec">Кто решает</div>
            <div className="grid">
              {['Решаю я сам','Надо согласовать','Тендер / юр.лицо'].map(o=>(
                <div key={o} className={`opt ${who===o?'sel':''}`} onClick={()=>setWho(o)}><div className="label">{o}</div><div className="check"/></div>
              ))}
            </div>
            <div className="nav">
              <button className="back" onClick={()=>setStep(s=>Math.max(0,s-1))}>Назад</button>
              <button className="btn-black" disabled={!canNext} onClick={()=>{ setAns({...ans,[step]:{when,who}}); setStep(s=>s+1); }}>Далее <span className="circle">↗</span></button>
            </div>
          </>
        )}

        {cur.type==='single' && <div className="nav single"><button className="back" disabled={step===0} onClick={()=>setStep(s=>Math.max(0,s-1))}>Назад</button></div>}
      </div>
    </div>
  );
}