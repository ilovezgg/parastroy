import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import ExcelJS from 'exceljs';

const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.jsonl');

export async function GET(request) {
  const key = request.nextUrl.searchParams.get('key');
  if (!process.env.LEADS_EXPORT_KEY || key !== process.env.LEADS_EXPORT_KEY) {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 401 });
  }

  let raw;
  try {
    raw = await readFile(LEADS_FILE, 'utf8');
  } catch {
    raw = '';
  }

  const leads = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .reverse();

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ПАРА | МОДУЛЬ';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Заявки', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  sheet.columns = [
    { header: 'Дата', key: 'date', width: 12 },
    { header: 'Время', key: 'time', width: 10 },
    { header: 'Источник', key: 'source', width: 20 },
    { header: 'Имя', key: 'name', width: 18 },
    { header: 'Телефон', key: 'phone', width: 18 },
    { header: 'Комментарий', key: 'comment', width: 45 },
    { header: 'UTM', key: 'utm', width: 30 },
  ];

  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E5A47' } };
  header.alignment = { vertical: 'middle' };
  header.height = 22;

  for (const lead of leads) {
    sheet.addRow({
      date: lead.date || '',
      time: lead.time || '',
      source: lead.source || '',
      name: lead.name || '',
      phone: lead.phone || '',
      comment: lead.comment || '',
      utm: lead.utm ? JSON.stringify(lead.utm) : '',
    });
  }

  sheet.eachRow((row, i) => {
    if (i === 1) return;
    row.alignment = { vertical: 'top', wrapText: true };
  });

  sheet.autoFilter = { from: 'A1', to: 'G1' };

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
