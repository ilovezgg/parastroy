"use client";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";

export default function ResultCard({ href, model, size, price, tags, caption, compact = false }) {
  return (
    <Link href={href} className={compact ? "qr-card qr-card-compact" : "qr-card"}>
      <div className="qr-photo" aria-hidden="true">
        {model.image ? (
          <Image
            src={model.image}
            alt={model.title}
            fill
            sizes="(max-width: 900px) 100vw, 33vw"
            className="qr-photo-img"
          />
        ) : (
          <span className="qr-wm mono">{model.slug}</span>
        )}
      </div>

      <div className="qr-body">
        <h3>{model.title}</h3>
        <div className="qr-meta">
          <span>{size || model.size}</span>
          <span className="qr-price mono">от {price || model.price}</span>
        </div>

        {!compact && tags && tags.length > 0 && (
          <ul className="qr-tags">
            {tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </div>

      {!compact && caption && (
        <div className="qr-upsell">
          <i aria-hidden="true">
            <Plus size={13} strokeWidth={2.2} />
          </i>
          <p>{caption}</p>
        </div>
      )}
    </Link>
  );
}
