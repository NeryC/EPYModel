import { FC, ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout component that wraps pages with Header and Footer
 * Provides consistent page structure across the application
 */
const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div className="bg-back text-black relative">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:shadow-lg focus:text-deep-blue focus:font-bold"
        >
          Saltar al contenido principal
        </a>
        <Header />
        {children}
        <Footer />
      </div>
    </>
  );

};

export default Layout;
