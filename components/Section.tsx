
import React from 'react';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ title, children, className = "" }) => {
  return (
    <section className={`mb-16 md:mb-24 ${className}`}>
      {title && (
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-8 font-outfit">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
};
