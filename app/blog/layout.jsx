import Header from '../components/Header/Header';
import FreeDesign from '../components/Footer/FreeDesign';
import Footer from '../components/Footer/Footer';

export default function BlogLayout({ children }) {
  return (
    <>
      <div className="shell">
        <Header />
      </div>
      {children}
      <div className="shell">
        <FreeDesign />
        <Footer />
      </div>
    </>
  );
}
