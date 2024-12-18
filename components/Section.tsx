import { ReactNode } from 'react';

interface SectionProps {
  id: string;
  children: ReactNode;
}

export function Section({ id, children }: SectionProps) {
  return (
    <section id={id} style={{ scrollMarginTop: '40px' }}>
      {children}
    </section>
  );
} 