
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen max-w-4xl mx-auto px-6 py-12 md:py-24">
      {children}
      <footer className="mt-24 pt-12 border-t border-gray-200 text-gray-400 text-xs flex flex-col md:flex-row justify-between items-center gap-4 text-center">
        <p>© {new Date().getFullYear()} Promil Hesaplayıcı. Bilgilendirme amaçlıdır.</p>
        <div className="flex gap-4">
          <span className="hover:text-black transition-colors cursor-pointer">Kullanım Koşulları</span>
          <span className="hover:text-black transition-colors cursor-pointer">Metodoloji</span>
        </div>
      </footer>
    </div>
  );
};
