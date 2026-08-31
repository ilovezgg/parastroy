import Header from '../components/Header/Header';
import FreeDesign from '../components/Footer/FreeDesign';
import Footer from '../components/Footer/Footer';

export default function ProductsLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <div className="shell">
        <FreeDesign />
        <Footer />
      </div>
    </>
  );
}
