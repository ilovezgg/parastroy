'use client';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Models from './components/Models/Models';
import Products from './components/Products/Products';

import Gallery from './components/Gallery/Gallery';
import Delivery from './components/Delivery/Delivery';
import FAQ from './components/FAQ/FAQ';
import Footer from './components/Footer/Footer';
import AssemblyScroll from './components/AssemblyScroll/AssemblyScroll'
export default function Landing(){
  return (
    <div className="shell">
      <Header />
      <Hero />
      
    <AssemblyScroll/>
      <Products/>
         <Models />
      <Gallery />
      <Delivery />
      <FAQ />
      <Footer />
    </div>
  )
}