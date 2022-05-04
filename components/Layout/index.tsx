import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

export default function Layout ({ children }) {
  return (
    <div className="bg-white text-black text-xl">
      <Header />
      <Sidebar >
        {children}
      </Sidebar>
      <Footer />
    </div>
  );
}

