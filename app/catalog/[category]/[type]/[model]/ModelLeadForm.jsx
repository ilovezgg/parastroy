'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PhoneInput from '../../../../components/PhoneInput/PhoneInput';

export default function ModelLeadForm({ modelTitle, modelSlug, sku, price }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [message, setMessage] = useState('');

  async function submit(e) {
    e.preventDefault();
    if (status === 'sending' || status === 'done') return;
    if (phone.replace(/\D/g, '').length < 10) {
      setStatus('error');
      setMessage('Проверьте номер телефона');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          name,
          source: `карточка товара: ${modelTitle}`,
          comment: `Модель: ${modelTitle}${sku ? ` (${sku})` : ''}, слаг: ${modelSlug}, цена: ${price}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Не отправилось');
      setStatus('done');
      setMessage('Заявка принята — перезвоним и уточним доставку.');
    } catch (err) {
      setStatus('error');
      setMessage(`${err.message}. Можно позвонить: +7 921 199 23 03`);
    }
  }

  return (
    <motion.form
      className="cat-lead-form"
      onSubmit={submit}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="cat-lead-form-note">
        Заявка по модели «{modelTitle}», {price} — оставьте телефон, менеджер перезвонит с расчётом доставки.
      </p>
      <div className="cat-lead-form-fields">
        <input
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={status === 'done'}
        />
        <PhoneInput value={phone} onChange={setPhone} required disabled={status === 'done'} />
      </div>
      <button type="submit" className="cat-lead-form-submit" disabled={status === 'sending' || status === 'done'}>
        {status === 'sending' ? 'Отправляем…' : status === 'done' ? 'Отправлено' : 'Получить расчёт'}
        <i aria-hidden="true">
          <ArrowRight size={16} strokeWidth={1.6} />
        </i>
      </button>
      <small className={status === 'error' ? 'cat-lead-form-msg err' : 'cat-lead-form-msg'}>
        {message || 'Нажимая кнопку, вы соглашаетесь на обработку персональных данных.'}
      </small>
    </motion.form>
  );
}
