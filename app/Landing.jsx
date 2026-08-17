'use client';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Models from './components/Models/Models';
import Gallery from './components/Gallery/Gallery';
import Delivery from './components/Delivery/Delivery';
import FAQ from './components/FAQ/FAQ';
import Footer from './components/Footer/Footer';

export default function Landing(){
  return (
    <div className="shell">
      <Header />
      <Hero />
      <Models />
      <Gallery />
      <Delivery />
      <FAQ />
      <Footer />
    </div>
  )
}