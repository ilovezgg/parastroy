"use client";

import { useRef } from "react";

/* ---------- маска телефона +7 (999) 999-99-99 ---------- */

function onlyDigits(str) {
  return (str || "").replace(/\D/g, "");
}

function normalizeDigits(rawDigits) {
  let d = rawDigits;
  if (d.startsWith("8")) d = "7" + d.slice(1);
  else if (d.length > 0 && d[0] !== "7") d = "7" + d;
  return d.slice(0, 11);
}

function formatDigits(digits) {
  if (!digits) return "";
  const rest = digits.slice(1); // всё, кроме кода страны, максимум 10 цифр
  let out = "+7";
  if (rest.length > 0) out += ` (${rest.slice(0, 3)}`;
  if (rest.length >= 3) out += ")";
  if (rest.length > 3) out += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) out += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) out += `-${rest.slice(8, 10)}`;
  return out;
}

function caretPosForDigitCount(str, n) {
  if (n <= 0) return 0;
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (/\d/.test(str[i])) {
      count++;
      if (count === n) return i + 1;
    }
  }
  return str.length;
}

export default function PhoneInput({ value, onChange, placeholder = "+7", ...rest }) {
  const ref = useRef(null);

  // rawValue — то, что реально сейчас в поле (после правки браузером/нашей ручной правки);
  // digitsBeforeCaret — сколько цифр должно остаться слева от курсора после переформатирования.
  function applyEdit(rawValue, digitsBeforeCaret) {
    const rawDigits = onlyDigits(rawValue);
    const needsPrepend = rawDigits.length > 0 && rawDigits[0] !== "7" && rawDigits[0] !== "8";
    const digitsBefore = needsPrepend ? digitsBeforeCaret + 1 : digitsBeforeCaret;

    const digits = normalizeDigits(rawDigits);
    const formatted = formatDigits(digits);
    onChange(formatted);

    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const pos = caretPosForDigitCount(formatted, digitsBefore);
      el.setSelectionRange(pos, pos);
    });
  }

  // обычный ввод и вставка из буфера — браузер уже применил правку к el.value
  function handleChange(e) {
    const el = e.target;
    const raw = el.value;
    const caret = el.selectionStart ?? raw.length;
    const digitsBeforeCaret = onlyDigits(raw.slice(0, caret)).length;
    applyEdit(raw, digitsBeforeCaret);
  }

  // Backspace/Delete перехватываем сами: нужно удалять именно цифру,
  // перепрыгивая через автоматически подставленные скобки/дефисы/пробелы.
  function handleKeyDown(e) {
    if (e.key !== "Backspace" && e.key !== "Delete") return;
    const el = e.target;
    const { selectionStart, selectionEnd, value: raw } = el;

    if (selectionStart !== selectionEnd) {
      e.preventDefault();
      const newRaw = raw.slice(0, selectionStart) + raw.slice(selectionEnd);
      const digitsBeforeCaret = onlyDigits(raw.slice(0, selectionStart)).length;
      applyEdit(newRaw, digitsBeforeCaret);
      return;
    }

    if (e.key === "Backspace") {
      let cut = selectionStart - 1;
      while (cut >= 0 && !/\d/.test(raw[cut])) cut--;
      if (cut < 0) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      const newRaw = raw.slice(0, cut) + raw.slice(cut + 1);
      const digitsBeforeCaret = onlyDigits(raw.slice(0, cut)).length;
      applyEdit(newRaw, digitsBeforeCaret);
    } else {
      let cut = selectionStart;
      while (cut < raw.length && !/\d/.test(raw[cut])) cut++;
      if (cut >= raw.length) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      const newRaw = raw.slice(0, cut) + raw.slice(cut + 1);
      const digitsBeforeCaret = onlyDigits(raw.slice(0, selectionStart)).length;
      applyEdit(newRaw, digitsBeforeCaret);
    }
  }

  return (
    <input
      ref={ref}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      placeholder={placeholder}
      value={value ?? ""}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...rest}
    />
  );
}
