import { NextResponse } from 'next/server';
import { mkdir, appendFile } from 'fs/promises';
import path from 'path';

const LEADS_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(LEADS_DIR, 'leads.jsonl');

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

  const now = new Date();
  const record = {
    date: now.toISOString().slice(0, 10),
    time: now.toTimeString().slice(0, 8),
    source: source || 'неизвестно',
    name: name || '',
    phone,
    comment: comment || '',
    utm: utm || null,
  };

  try {
    await mkdir(LEADS_DIR, { recursive: true });
    await appendFile(LEADS_FILE, JSON.stringify(record) + '\n', 'utf8');
  } catch (err) {
    return NextResponse.json({ error: 'Не удалось сохранить заявку, попробуйте ещё раз' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
