'use client';
import { motion } from 'framer-motion';
import Scene from './Scene';
import { useState } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i=0) => ({ opacity: 1, y: 0, transition: { delay: i*0.08, duration: 0.6, ease: [0.16,1,0.3,1] } })
};

export default function Landing(){
  const [km, setKm] = useState(500);
  const delivery = km * 105;
  const totalOne = 141000 + delivery;
  const totalTwo = 282000 + delivery;
  const perBlock = Math.round(totalTwo/2);

  const STAGES = [
    ["Обвязка","швеллер 120×50×3 мм"],
    ["Пол","доска 100×40 + ДСП 16 мм"],
    ["Стены","доска 100×40 + минвата 50 мм"],
    ["Кровля","стальной лист 1 мм"],
    ["Окно и дверь","1000×1000 / 800×2000"],
    ["Обшивка","профлист С8, RAL 7024"]
  ];

  const faqs = [
    {q:"Какие типы бытовок вы производите и какие задачи они решают?", a:"Производим строительные, жилые, санитарные и охранные бытовки. Строительные — на стройплощадках, жилые — для временного проживания рабочих, санитарные оснащены душем/туалетом, охранные/КПП имеют смотровые окна и компактную планировку."},
    {q:"Какие размеры и планировки доступны?", a:"Типовой размер 2.4 на 6м. Предлагаем разные планировки с перегородками, тамбуром, санузлом. Готовы сделать по индивидуальным размерам. Возможна компоновка нескольких бытовок в модульное здание."},
    {q:"Что входит в конструкцию бытовки?", a:"Сварной металлический каркас, утепление 50-100мм, внешняя обшивка оцинкованным профлистом С8 0.45мм, внутренняя отделка ДВП, деревянные окна и двери, проводка и розетка в базе."},
    {q:"Какие опции можно добавить и во сколько это обойдется?", a:"Двери стальные/деревянные, окна ПВХ, электрика по ПУЭ, конвекторы, сплит-системы, тепловые завесы, сантехника, бойлеры, слаботочка (видеонаблюдение, СКС). Цена по запросу у менеджера."},
    {q:"Это готовый товар или изготавливается под заказ?", a:"Популярные модели есть на складе, отгрузка за 1-2 дня. Индивидуальные конфигурации — за 3-5 дней. Срок зависит от сложности и загрузки производства."},
    {q:"Как организуется доставка и установка?", a:"Доставляем по России собственным автопарком или партнерами. Установка на подготовленное место (можно без фундамента) на ФБС блоки. Требуется подъездная дорога. Разгрузка краном-манипулятором за счет заказчика. Средний срок 1-2 дня, от 105 ₽/км."},
    {q:"Какая гарантия и как подать заявку на ремонт?", a:"Гарантия 24 месяца на каркас и конструкцию, 12 месяцев на отделку и инженерные системы. Заявка по телефону +7 (812) 250-10-25 или info@unistroy.pro, выезд специалиста 5-7 рабочих дней."},
    {q:"Как оформить заказ и каков график платежей?", a:"Заказ онлайн или по телефону +7 (812) 250-10-25. Аванс 50%, остаток при сдаче. Для постоянных клиентов рассрочка до 60 дней. Со складских вариантов скидка до 15%."},
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="shell">
      <div className="hero">
        <div className="topbar">
          <div className="brand">
            <svg width="46" height="22" viewBox="0 0 46 22" fill="none"><path d="M2 20V8l10-6 10 6v12" stroke="#0F1614" strokeWidth="1.3"/><path d="M24 20V11l10-5 10 5v9" stroke="#1E5A47" strokeWidth="1.3"/><path d="M2 13h20M24 15h20" stroke="rgba(15,22,20,.22)" strokeWidth="1"/></svg>
            <b>СЕВЕРМОДУЛЬ</b><span>бытовки и блок-контейнеры</span>
          </div>
          <nav className="nav">
            <a href="#models" className="on">Бытовки</a><a href="#specs">ТТХ</a><a href="#options">Опции</a><a href="#delivery">Доставка</a><a href="#faq">FAQ</a>
          </nav>
          <div className="acts">
            <button className="btn-light">Оставить заявку</button>
            <div className="phone"><i><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" fill="#fff"/></svg></i><b>8 (800) 350-24-18</b></div>
          </div>
        </div>

        <div className="hero-grid">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="eyebrow"><s></s>собственное производство в г. Пестово</div>
            <motion.h1 variants={fadeUp} custom={1}>Металлическая бытовка <em>Б 01</em><br/><u>6 × 2,4 м</u> с отделкой —<br/>с собственного производства</motion.h1>
            <motion.p className="lede" variants={fadeUp} custom={2}>Утеплённая бытовка на металлокаркасе: надёжное пространство для работы или отдыха на стройплощадке. Делаем сами, поэтому цена идёт без посредников, а доставка — в любой регион России.</motion.p>
            <motion.button className="cta" variants={fadeUp} custom={3} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <span>Рассчитать бытовку<br/>с доставкой за 1 минуту</span><i><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="#0F1614" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></i>
            </motion.button>
            <div className="assurances">
              <div className="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 11l8-6 8 6v9H4v-9z" stroke="#0F1614" strokeWidth="1.3"/><path d="M9 20v-6h6v6" stroke="#C7822B" strokeWidth="1.3"/></svg></div>
              <p>Утеплитель — минвата 50 мм по полу, стенам и потолку, пол ДСП 16 мм</p><div className="div"></div>
              <p>Доставка по всей России от 105 ₽/км, разгрузка — вашей или нашей техникой</p>
            </div>
          </motion.div>

          <div className="stage-wrap">
            <div className="model-head"><div className="t">Бытовка Б 01 · 6,0 × 2,4 м — сборка по деталям</div><div className="c mono" id="stageCount">01 / 06</div></div>
            <Scene />
            <div className="steps" id="steps">
              {STAGES.map((s,i)=>(
                <button key={i} className="step" onClick={()=> window.__jump?.(i+1)}><u>0{i+1}</u><b>{s[0]}</b><span className="bar"></span></button>
              ))}
            </div>
            <div className="stats">
              <motion.div className="stat" whileHover={{ y: -4 }}><div className="ic"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="8" width="18" height="11" rx="2" stroke="#0F1614" strokeWidth="1.3"/><path d="M3 12h18" stroke="#C7822B" strokeWidth="1.3"/></svg></div><div className="n">141 000<small>₽</small></div><p>цена блока стандартного размера, без доставки</p></motion.div>
              <motion.div className="stat" whileHover={{ y: -4 }}><div className="ic"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="#0F1614" strokeWidth="1.3"/><path d="M12 8v4.5l3 2" stroke="#C7822B" strokeWidth="1.3" strokeLinecap="round"/></svg></div><div className="n">1–2<small>дня</small></div><p>средний срок доставки с производства</p></motion.div>
              <motion.div className="stat" whileHover={{ y: -4 }}><div className="ic"><svg viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-10" stroke="#C7822B" strokeWidth="1.4" strokeLinecap="round"/><circle cx="12" cy="12" r="9" stroke="#0F1614" strokeWidth="1.1" opacity=".6"/></svg></div><div className="n">105<small>₽/км</small></div><p>доставка в любой регион России</p></motion.div>
            </div>
          </div>
        </div>
      </div>

      <section id="models">
        <div className="sec-head"><h2>Цена блока <em>и что меняет доставка</em></h2><p>Расчёт на примере Пестово — Санкт-Петербург, 500 км. Шаланда везёт сразу два блока по цене одной машины.</p></div>
        <div className="models">
          {[
            {tag:"Самовывоз", title:"Б 01", size:"6,0 × 2,4 м · высота 2,5 м · потолки 2,2 м", list:[["Обвязка","швеллер 120×50×3"],["Утеплитель","минвата 50 мм"],["Обшивка","профлист С8 0,45 мм"],["Пол","ДСП 16 мм"]], price:"141 000 ₽", sub:"без доставки"},
            {tag:"Один блок с доставкой", title:"Б 01 + доставка", size:"пример: Пестово — СПб, 500 км", list:[["Блок","141 000 ₽"],["Доставка","105 ₽/км"],["За 500 км","52 500 ₽"],["Срок","1–2 дня"]], price:"193 500 ₽", sub:"без разгрузки"},
            {tag:"Два блока шаландой", title:"Б 01 × 2", size:"шаланда везёт два блока по цене одной", list:[["Два блока","282 000 ₽"],["Доставка","52 500 ₽"],["Цена за блок","167 500 ₽"],["Срок","1–2 дня"]], price:"334 500 ₽", sub:"без разгрузки"},
          ].map((c,i)=>(
            <motion.div key={i} className="card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.1 }} whileHover={{ y: -4 }}>
              <div className="tag">{c.tag}</div><h3>{c.title}</h3><div className="size mono">{c.size}</div>
              <ul>{c.list.map(([k,v])=> <li key={k}>{k} <b>{v}</b></li>)}</ul>
              <div className="price"><em>{c.price}</em><u>{c.sub}</u></div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="specs">
        <div className="sec-head"><h2>Конструкция Б 01 — <em>всё по ТТХ</em></h2><p>Металлокаркас, деревянный каркас, отделка — как в паспорте изделия. Цвет RAL 7024 или другой стандартный.</p></div>
        <div className="models">
          <div className="card"><div className="tag">Металлокаркас</div><h3>Силовой каркас</h3><ul><li>Верхняя обвязка <b>швеллер 120×50×3</b></li><li>Нижняя обвязка <b>швеллер 120×50×3</b></li><li>Угловая стойка <b>угол 90×90×3</b></li><li>Усиление пола <b>сдвоенный уголок 1200мм</b></li><li>Кровля <b>лист 1мм сплошной шов</b></li></ul></div>
          <div className="card"><div className="tag">Деревянный каркас</div><h3>Второстепенный</h3><ul><li>Каркас стен <b>доска 100×40 1 сорт</b></li><li>Каркас потолка <b>100×40 + 25×100</b></li><li>Каркас пола <b>25×100 + 100×40</b></li><li>Настил <b>обрезная доска</b></li></ul></div>
          <div className="card"><div className="tag">Отделка и окна</div><h3>Базовая комплектация</h3><ul><li>Наружка <b>профлист С8 0.45мм</b></li><li>Утепление <b>минвата 50мм 11кг/м³</b></li><li>Парозащита <b>ПВХ 80мкр</b></li><li>Пол <b>ДСП 16мм</b></li><li>Дверь <b>800×2000 каркасная ДВП</b></li><li>Окно <b>1000×1000 двойное</b></li></ul></div>
        </div>
        <div className="models" style={{marginTop:16}}>
          <div className="card" style={{gridColumn:"span 3"}}><div style={{display:"flex", gap:16, flexWrap:"wrap"}}><img src="/images/construction_cabin_sideview.webp" alt="Бытовка Б 01 экстерьер" style={{width:"49%", borderRadius:16, objectFit:"cover"}}/><img src="/images/construction_cabin_interior.webp" alt="Бытовка Б 01 интерьер" style={{width:"49%", borderRadius:16, objectFit:"cover"}}/></div></div>
        </div>
      </section>

      <section id="options">
        <div className="sec-head"><h2>Дополнительно <em>укомплектуем</em></h2><p>Двери, окна ПВХ, электрика по ПУЭ, отопление, сантехника, слаботочка — подберем по вашему ТЗ.</p></div>
        <div className="flow">
          {[
            ["Двери","Входные и межкомнатные стальные/деревянные, замки повышенной безопасности, утепленные полотна и доборы"],
            ["Окна","ПВХ двойное остекление, энергосберегающие, москитные сетки, вентиляция, защита от взлома"],
            ["Электрика","Щиты, автоматы, розетки, освещение, заземление по ПУЭ, влагозащищенные, уличное и аварийное"],
            ["Климат","Конвекторы, сплит-системы, тепловые завесы, котлы, терморегуляторы"],
            ["Сантехника","Водопровод, сточные, бойлеры, умывальники, унитазы, душевые, насосы"],
            ["СЛС","Оповещение, видеонаблюдение, контроль доступа, охрана, LAN, Wi-Fi"],
          ].map(([h,p],i)=>(
            <motion.div key={h} className="s" whileHover={{ y: -3 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.05 }}>
              <u>0{i+1}</u><h4>{h}</h4><p>{p}</p><div className="when">по запросу к менеджеру</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="delivery">
        <div className="sec-head"><h2>Доставка <em>по всей России</em></h2><p>С производства в Пестово. Средний срок 1-2 дня. От 105 ₽/км. Шаландой — 2 блока за цену одного.</p></div>
        <div className="card" style={{display:"grid", gridTemplateColumns:"1.1fr 0.9fr", gap:24, alignItems:"center"}}>
          <div>
            <h3 style={{marginTop:0}}>Калькулятор доставки</h3>
            <div className="size mono">Ставка 105 ₽/км · Формула: цена блока + км*105</div>
            <div style={{marginTop:18, display:"flex", gap:12, alignItems:"center"}}>
              <input type="range" min={50} max={2000} value={km} onChange={e=>setKm(parseInt(e.target.value))} style={{flex:1}} />
              <b className="mono">{km} км</b>
            </div>
            <ul style={{marginTop:20}}>
              <li>Доставка <b>{delivery.toLocaleString()} ₽</b></li>
              <li>1 блок с доставкой <b>{totalOne.toLocaleString()} ₽</b></li>
              <li>2 блока шаландой <b>{totalTwo.toLocaleString()} ₽</b></li>
              <li>Цена за блок при 2х <b>{perBlock.toLocaleString()} ₽</b></li>
            </ul>
            <p style={{fontSize:12, color:"var(--muted)", marginTop:12}}>Установка на ФБС блоки, можно без фундамента. Требуется подъездная дорога. Разгрузка краном-манипулятором за счет заказчика.</p>
          </div>
          <div style={{background:"#F0F2ED", borderRadius:16, padding:20}}>
            <div className="tag">Пример из ТЗ</div>
            <h3 style={{marginTop:12}}>Пестово → СПб 500км</h3>
            <ul><li>Блок <b>141 000 ₽</b></li><li>Доставка 105×500 <b>52 500 ₽</b></li><li>Итого 1 блок <b>193 500 ₽</b></li><li>2 блока <b>334 500 ₽</b></li><li>За 1 блок при 2х <b>167 500 ₽</b></li></ul>
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="sec-head"><h2>Частые <em>вопросы</em></h2><p>Отвечаем на 8 самых популярных вопросов — производство, доставка, гарантия, оплата.</p></div>
        <div style={{display:"grid", gap:12}}>
          {faqs.map((f,i)=>(
            <div key={i} className="card" style={{padding:0, overflow:"hidden"}}>
              <button onClick={()=> setOpenFaq(openFaq===i?null:i)} style={{width:"100%", textAlign:"left", padding:"22px 26px", display:"flex", justifyContent:"space-between", gap:12, background:"transparent", border:"none", cursor:"pointer"}}>
                <b style={{fontSize:15}}>{f.q}</b><span style={{fontFamily:"JetBrains Mono", color:"var(--ochre)"}}>{openFaq===i?"−":"+"}</span>
              </button>
              <motion.div initial={false} animate={{ height: openFaq===i? "auto" : 0, opacity: openFaq===i? 1 : 0 }} style={{overflow:"hidden"}}>
                <p style={{padding:"0 26px 22px", margin:0, color:"var(--muted)", fontSize:14, lineHeight:1.6}}>{f.a}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact">
        <div className="final">
          <div><h2>Оставьте заявку <em>для расчёта в тендер</em></h2><p>Готовы рассмотреть предложения по участию в тендерах на строительство, монтаж и поставку бытовок, блок-контейнеров и модульных зданий.</p></div>
          <div className="form">
            <input type="tel" placeholder="+7 (___) ___-__-__" aria-label="Телефон" />
            <button className="btn-light">Оставить заявку</button>
            <small>Опыт работы с госконтрактами · заводская гарантия и сервис · под ключ, без срывов</small>
          </div>
        </div>
        <footer>
          <div>СЕВЕРМОДУЛЬ · производство бытовок и блок-контейнеров</div>
          <div>г. Пестово, Новгородская обл. · <a href="tel:88003502418">8 (800) 350-24-18</a></div>
          <div><a href="#">Договор</a> · <a href="#">Политика данных</a></div>
        </footer>
      </section>
    </div>
  );
}