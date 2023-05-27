import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="bg-gray-200 text-black relative">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
