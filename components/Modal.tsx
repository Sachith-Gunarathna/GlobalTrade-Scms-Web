'use client';

import { X } from 'lucide-react';
import { useEffect, useId } from 'react';

export function Modal({ title, subtitle, onClose, children }: { title: string; subtitle?: string; onClose: () => void; children: React.ReactNode }) {
  const titleId = useId();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === 'Escape' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal glass" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="modal-head">
          <div><h2 id={titleId}>{title}</h2>{subtitle ? <p>{subtitle}</p> : null}</div>
          <button className="icon-btn" onClick={onClose} aria-label="Close dialog" type="button"><X size={19} /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
