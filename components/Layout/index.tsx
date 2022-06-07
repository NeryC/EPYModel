import Header from "./Header";
import Footer from "./Footer";

export default function Layout ({ children }) {
  return (
    <div className="bg-white text-black text-xl relative">
      <Header />
      <div className="pb-12">
        {children}
      </div>
      <Footer />
    </div>
  );
}

