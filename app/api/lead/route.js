import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// The admin DB only accepts these four source values (see
// parastroy-admin/supabase/schema.sql). The site's forms send free-text
// Russian labels instead — map them here and keep the original detail
// (product/article title) in model_info so nothing is lost.
function normalizeSource(raw) {
  const value = String(raw || '').trim();
  if (value.startsWith('карточка товара:')) {
    return { source: 'quiz', model_info: value.replace('карточка товара:', '').trim() };
  }
  if (value.startsWith('статья:')) {
    return { source: 'article', model_info: value.replace('статья:', '').trim() };
  }
  if (value === 'квиз') return { source: 'quiz', model_info: null };
  if (value === 'футер') return { source: 'footer', model_info: null };
  if (value === 'контакты') return { source: 'contacts', model_info: null };
  return { source: 'footer', model_info: null };
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  }

  const { phone, name, comment, source, utm } = body || {};

  if (!phone || String(phone).replace(/\D/g, '').length < 10) {
    return NextResponse.json({ error: 'Проверьте номер телефона' }, { status: 400 });
  }

  const { source: dbSource, model_info } = normalizeSource(source);

  const { error } = await supabase.from('leads').insert({
    source: dbSource,
    name: name || null,
    phone,
    comment: comment || null,
    model_info,
    utm: utm || null,
  });

  if (error) {
    console.error('lead insert failed:', error);
    return NextResponse.json({ error: 'Не удалось сохранить заявку, попробуйте ещё раз' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
