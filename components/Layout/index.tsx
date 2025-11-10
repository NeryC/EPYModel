import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout component that wraps pages with Header and Footer
 * Provides consistent page structure across the application
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-gray-200 text-black relative">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
