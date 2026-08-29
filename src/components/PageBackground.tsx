// src/components/PageBackground.tsx
import React from 'react';

export default function PageBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100">
      {/* 1. Ambient Dynamic Radial Glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-[128px]" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-indigo-500/20 blur-[128px]" />

      {/* 2. Geometric SVG Grid Pattern */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* 3. Page Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}