import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="bg-gray-200 text-black relative">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
