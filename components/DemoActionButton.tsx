'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export function DemoActionButton({ children, className = 'primary-btn', message = 'Demo mode: connect your backend to enable this action.' }: { children: React.ReactNode; className?: string; message?: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!show) return;
    const timer = window.setTimeout(() => setShow(false), 2600);
    return () => window.clearTimeout(timer);
  }, [show]);
  return <>
    <button className={className} onClick={() => setShow(true)}>{children}</button>
    {show ? <div className="toast"><CheckCircle2 size={17}/><div><strong>Static demo</strong><span>{message}</span></div></div> : null}
  </>;
}
