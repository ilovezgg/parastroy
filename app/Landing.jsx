'use client';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'framer-motion';
import Scene from './Scene';
import { useState, useRef, useEffect } from 'react';

function Counter({ value }){
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 90, damping: 20 });
  const [d, setD] = useState(0);
  useEffect(()=>{ if(inView) mv.set(value); }, [inView, value]);
  useEffect(()=> spring.on("change", v=> setD(Math.round(v))), [spring]);
  return <span ref={ref}>{d.toLocaleString()}</span>;
}

function MagneticButton({ children, className }){
  const ref = useRef(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });
  return (
    <motion.button ref={ref} className={className} style={{ x: sx, y: sy }}
      onMouseMove={(e)=>{ const r=ref.current.getBoundingClientRect(); x.set((e.clientX-r.left-r.width/2)*0.25); y.set((e.clientY-r.top-r.height/2)*0.35); }}
      onMouseLeave={()=>{x.set(0);y.set(0);}} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
      {children}
    </motion.button>
  );
}

function TiltCard({ children, className }){
  const ref = useRef(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const rx = useTransform(y, [-100,100], [8,-8]); const ry = useTransform(x, [-100,100], [-8,8]);
  return (
    <motion.div ref={ref} className={className} style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      onMouseMove={(e)=>{ const r=ref.current.getBoundingClientRect(); x.set(e.clientX-r.left-r.width/2); y.set(e.clientY-r.top-r.height/2); }}
      onMouseLeave={()=>{x.set(0);y.set(0);}} whileHover={{ y: -4, boxShadow: "0 22px 56px rgba(15,22,20,.14)" }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <div style={{ transform: "translateZ(18px)" }}>{children}</div>
    </motion.div>
  );
}

export default function Landing(){
  const [km, setKm] = useState(500);
  const delivery = km * 105;
  const totalOne = 150000 + delivery;
  const totalTwo = 300000 + delivery;
  const perBlock = Math.round(totalTwo/2);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 600], [0, -60]);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [lightbox, setLightbox] = useState(null);

  const STAGES = [
    ["Обвязка","швеллер 120×50×3 мм"],
    ["Пол","доска 100×40 + ДСП 16 мм"],
    ["Стены","доска 100×40 + минвата 50 мм"],
    ["Кровля","стальной лист 1 мм"],
    ["Окно и дверь","1000×1000 / 800×2000"],
    ["Обшивка","профлист С8, RAL 7024"]
  ];

  const gallery = [
    {src:"/images/construction_cabin_sideview_3.webp", tag:"Б-01 · ФБС · RAL 7024", sub:"Пестово, Лермонтова 16А", col:"col-span-8", h:420},
    {src:"/images/construction_cabin_interior_2.webp", tag:"Интерьер · ДВП · конвектор", sub:"Стол прораба, окно 1000×1000", col:"col-span-4", h:420},
    {src:"/images/construction_cabin_sideview.webp", tag:"Экстерьер", sub:"С8 0.45 оцинк.", col:"col-span-4", h:260},
    {src:"/images/construction_cabin_sideview_1.webp", tag:"Боковой вид", sub:"на ФБС блоках", col:"col-span-4", h:260},
    {src:"/images/construction_cabin_sideview_2.webp", tag:"На ФБС блоках", sub:"без фундамента", col:"col-span-4", h:260},
    {src:"/images/construction_cabin_interior.webp", tag:"Интерьер", sub:"ДВП, пол ДСП 16мм", col:"col-span-4", h:260},
    {src:"/images/construction_cabin_interior_1.webp", tag:"Отделка ДВП", sub:"минвата 50мм", col:"col-span-4", h:260},
    {src:"/images/construction_cabin_interior_3.webp", tag:"Окно ПВХ 1000×1000", sub:"вид на площадку", col:"col-span-4", h:260},
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
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h- bg-[var(--ochre)] origin-left z-[100]" />

      <motion.div className="hero" style={{ y: yParallax }}>
        <motion.div className="topbar" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}>
          <div className="brand">
            <svg width="46" height="22" viewBox="0 0 46 22" fill="none"><path d="M2 20V8l10-6 10 6v12" stroke="#0F1614" strokeWidth="1.3"/><path d="M24 20V11l10-5 10 5v9" stroke="#1E5A47" strokeWidth="1.3"/><path d="M2 13h20M24 15h20" stroke="rgba(15,22,20,.22)" strokeWidth="1"/></svg>
            <b>СЕВЕРМОДУЛЬ</b><span>бытовки и блок-контейнеры</span>
          </div>
          <nav className="nav">
            {["Бытовки","ТТХ","Опции","Доставка","FAQ"].map((t,i)=>(
              <motion.a key={t} href={`#${t.toLowerCase()}`} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i*0.05 }} className={i===0?"on":""}>{t}</motion.a>
            ))}
          </nav>
          <div className="acts">
            <button className="btn-light">Оставить заявку</button>
            <div className="phone"><i><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" fill="#fff"/></svg></i><b>8 (800) 350-24-18</b></div>
          </div>
        </motion.div>

        <div className="hero-grid">
          <div>
            <motion.div className="eyebrow" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}><s></s>В НАЛИЧИИ 12 БЛОКОВ · ОТГРУЗКА ЗА 24 ЧАСА · -52 500 ₽ НА ДОСТАВКЕ</motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} style={{ fontFamily: "Unbounded", fontWeight: 200, lineHeight: 0.95 }}>
              Бытовки и модульные здания <em style={{ fontWeight: 700 }}>от 150 000 ₽</em><br/><u style={{ textDecoration: "none", color: "var(--ochre)", fontWeight: 300 }}>доставка 2 блоков по цене 1 доставки</u> — за 48 часов под ключ
            </motion.h1>
            <motion.p className="lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>Завод в Пестово, без посредников. Доставка 105 ₽/км — шаланда везет 2 бытовки по цене одной доставки, экономия 52 500 ₽ на примере СПб 500 км. Гарантия 24 мес, паспорт и пакет документов для тендера, рассрочка 60 дней.</motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
              <MagneticButton className="cta">
                <span>Рассчитать с доставкой<br/>за 1 минуту + скидка 15%</span>
                <motion.i whileHover={{ rotate: 45 }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="#0F1614" strokeWidth="1.6" strokeLinecap="round"/></svg></motion.i>
              </MagneticButton>
            </motion.div>
            <motion.div className="assurances" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              <div className="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 11l8-6 8 6v9H4v-9z" stroke="#0F1614" strokeWidth="1.3"/><path d="M9 20v-6h6v6" stroke="#C7822B" strokeWidth="1.3"/></svg></div>
              <p>Отгрузка со склада завтра, документы для тендера в комплекте</p><div className="div"></div>
              <p>Гарантия 24 мес, установка на ФБС, разгрузка вашей или нашей техникой</p>
            </motion.div>
          </div>

          <motion.div className="stage-wrap" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45, duration: 0.8 }}>
            <div className="model-head"><div className="t">Бытовка Б 01 · 6,0 × 2,4 м — сборка по деталям</div><div className="c mono" id="stageCount">01 / 06</div></div>
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}><Scene /></motion.div>
            <div className="steps" id="steps">
              {STAGES.map((s,i)=>(
                <motion.button key={i} className="step" onClick={()=> window.__jump?.(i+1)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}><u>0{i+1}</u><b>{s[0]}</b><span className="bar"></span></motion.button>
              ))}
            </div>
            <div className="stats">
              <TiltCard className="stat"><div className="n"><Counter value={150000}/><small>₽</small></div><p>цена блока стандартного размера, без доставки</p></TiltCard>
              <TiltCard className="stat"><div className="n"><Counter value={2}/><small>дня</small></div><p>средний срок доставки с производства</p></TiltCard>
              <TiltCard className="stat"><div className="n"><Counter value={105}/><small>₽/км</small></div><p>доставка в любой регион России</p></TiltCard>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <section id="models">
        <div className="sec-head"><h2>Цена блока <em>и что меняет доставка</em></h2><p>Расчёт на примере Пестово — Санкт-Петербург, 500 км. Шаланда везёт сразу два блока по цене одной машины.</p></div>
        <div className="models">
          {[
            {tag:"Самовывоз", title:"Б 01", size:"6,0 × 2,4 м · высота 2,5 м · потолки 2,2 м", list:[["Обвязка","швеллер 120×50×3"],["Утеплитель","минвата 50 мм"],["Обшивка","профлист С8 0,45 мм"],["Пол","ДСП 16 мм"]], price:"150 000 ₽", sub:"без доставки"},
            {tag:"Один блок с доставкой", title:"Б 01 + доставка", size:"пример: Пестово — СПб, 500 км", list:[["Блок","150 000 ₽"],["Доставка","105 ₽/км"],["За 500 км","52 500 ₽"],["Срок","1–2 дня"]], price:"202 500 ₽", sub:"без разгрузки"},
            {tag:"Два блока шаландой", title:"Б 01 × 2", size:"шаланда везёт два блока по цене одной", list:[["Два блока","300 000 ₽"],["Доставка","52 500 ₽"],["Цена за блок","176 250 ₽"],["Срок","1–2 дня"]], price:"352 500 ₽", sub:"без разгрузки"},
          ].map((c,i)=>(
            <motion.div key={i} className="card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.1 }} whileHover={{ y: -4 }}>
              <div className="tag">{c.tag}</div><h3>{c.title}</h3><div className="size mono">{c.size}</div>
              <ul>{c.list.map(([k,v])=> <li key={k}>{k} <b>{v}</b></li>)}</ul>
              <div className="price"><em>{c.price}</em><u>{c.sub}</u></div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="specs" className="px-6">
        <div className="sec-head">
          <h2>Б-01 вживую — <em>экстерьер и интерьер</em></h2>
          <p>Реальные фото с площадки в Пестово: RAL 7024, С8 0.45, ФБС блоки. Клик — увеличение.</p>
        </div>

        <div className="grid grid-cols-12 gap- mt-4">
          {gallery.map((g,i)=>(
            <div key={g.src} className={`${g.col} rounded- overflow-hidden bg-white border border-white/80 shadow-sm cursor-zoom-in`} onClick={()=>setLightbox(g.src)}>
              <img src={g.src} alt={g.tag} style={{width:"100%", height:g.h, objectFit:"cover", display:"block"}}/>
              <div className="p-3 flex justify-between items-center">
                <div><div className="tag text-">{g.tag}</div><div className="text- text-gray-500">{g.sub}</div></div>
                <div className="w-7 h-7 rounded-full bg-white grid place-items-center border">↗</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="options" className="relative">
        <div className="sec-head" style={{ alignItems: "flex-start" }}>
          <h2 style={{ maxWidth: 520 }}><span style={{ fontWeight: 200, display: "block" }}>Дополнительно</span><span style={{ fontWeight: 700, display: "block", letterSpacing: "-0.02em" }}>укомплектуем</span></h2>
          <p style={{ maxWidth: 320, marginLeft: "auto", textAlign: "right" }}>Двери, окна ПВХ, электрика по ПУЭ, отопление, сантехника, слаботочка — подберем по вашему ТЗ.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
            { n: "01", title: "Двери", desc: "Входные и межкомнатные стальные / деревянные, замки повышенной безопасности, утепленные полотна и доборы", icon: "M4 11l8-6 8 6v9H4v-9z M9 20v-6h6v6" },
            { n: "02", title: "Окна", desc: "ПВХ двойное остекление, энергосберегающие, москитные сетки, вентиляция, защита от взлома", icon: "M3 3h18v18H3z M3 9h18 M9 21V9" },
            { n: "03", title: "Электрика", desc: "Щиты, автоматы, розетки, освещение, заземление по ПУЭ, влагозащищенные, уличное и аварийное", icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
            { n: "04", title: "Климат", desc: "Конвекторы, сплит-системы, тепловые завесы, котлы, терморегуляторы", icon: "M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M4.93 19.07l1.41-1.41 M17.66 6.34l1.41-1.41 M16 12a4 4 0 11-8 0 4 4 0 018 0z" },
            { n: "05", title: "Сантехника", desc: "Водопровод, сточные, бойлеры, умывальники, унитазы, душевые, насосы", icon: "M7 16V4M7 4a2 2 0 012 2v2a2 2 0 01-2 2M17 8a2 2 0 00-2-2V4a2 2 0 002-2M17 8v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8" },
            { n: "06", title: "СЛС", desc: "Оповещение, видеонаблюдение, контроль доступа, охрана, LAN, Wi-Fi", icon: "M15 10l4.55-2.28A1 1 0 0121 8.72v6.56a1 1 0 01-1.45.89L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" },
          ].map((c,i)=>(
            <motion.div key={c.n} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.06, duration: 0.6, ease: [0.16,1,0.3,1] }} whileHover={{ y: -6 }}>
              <div style={{ position: "relative", padding: "22px 20px 18px", borderRadius: 20, background: "linear-gradient(170deg, rgba(255,255,255,.92), rgba(255,255,255,.62))", border: "1px solid rgba(255,255,255,.9)", backdropFilter: "blur(18px)", boxShadow: "0 10px 30px rgba(15,22,20,.06)", minHeight: 188, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="mono" style={{ fontSize: 11, color: "var(--ochre)" }}>{c.n}</span>
                  <div style={{ width: 36, height: 36, borderRadius: 999, display: "grid", placeItems: "center", background: "rgba(255,255,255,.7)", border: "1px solid rgba(255,255,255,.9)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d={c.icon}/></svg>
                  </div>
                </div>
                <h4 style={{ margin: "18px 0 8px", fontSize: 16, fontWeight: 600 }}>{c.title}</h4>
                <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: "var(--muted)", flex: 1 }}>{c.desc}</p>
                <div className="mono" style={{ marginTop: 16, fontSize: 10.5, color: "var(--accent)" }}>по запросу к менеджеру →</div>
              </div>
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
          </div>
          <div style={{background:"#F0F2ED", borderRadius:16, padding:20}}>
            <div className="tag">Пример из ТЗ</div>
            <h3 style={{marginTop:12}}>Пестово → СПб 500км</h3>
            <ul><li>Блок <b>150 000 ₽</b></li><li>Доставка 105×500 <b>52 500 ₽</b></li><li>Итого 1 блок <b>202 500 ₽</b></li><li>2 блока <b>352 500 ₽</b></li><li>За 1 блок при 2х <b>176 250 ₽</b></li></ul>
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
            <input type="tel" placeholder="+7 (___) ___-__-__" />
            <button className="btn-light">Оставить заявку</button>
            <small>Опыт работы с госконтрактами · заводская гарантия и сервис · под ключ, без срывов</small>
          </div>
        </div>
        <footer>
          <div>СЕВЕРМОДУЛЬ · производство бытовок и блок-контейнеров</div>
          <div>г. Пестово, Новгородская обл. · <a href="tel:88003502418">8 (800) 350-24-18</a></div>
        </footer>
      </section>

      {lightbox && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} onClick={()=>setLightbox(null)} style={{position:"fixed", inset:0, background:"rgba(15,22,20,.88)", backdropFilter:"blur(12px)", zIndex:9999, display:"grid", placeItems:"center", padding:24, cursor:"zoom-out"}}>
          <img src={lightbox} style={{maxWidth:"92vw", maxHeight:"92vh", borderRadius:20, boxShadow:"0 20px 60px rgba(0,0,0,.5)"}}/>
        </motion.div>
      )}
    </div>
  );
}