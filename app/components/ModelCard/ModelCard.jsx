'use client';
import Link from 'next/link';
import Image from 'next/image';
import '../../catalog/catalog.css';

export default function ModelCard({ href, model, size, price, caption }) {
  return (
    <div className="model-card">
      <Link href={href} className="cat-card">
        <div className="cat-card-photo" aria-hidden="true">
          {model.image ? (
            <Image
              src={model.image}
              alt={model.title}
              fill
              sizes="(max-width: 700px) 50vw, 25vw"
              className="cat-card-photo-img"
            />
          ) : (
            <span className="cat-card-wm mono">{model.slug}</span>
          )}
        </div>
        <div className="cat-card-body">
          <h2>{model.title}</h2>
          <p>{size || model.size}</p>
          <span className="cat-card-price mono">от {price || model.price}</span>
        </div>
      </Link>
      {caption && <p className="model-card-caption">{caption}</p>}
    </div>
  );
}
