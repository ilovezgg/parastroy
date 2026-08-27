'use client';
import dynamic from 'next/dynamic';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Models from './components/Models/Models';
import Products from './components/Products/Products';
import Footer from './components/Footer/Footer';

// Ниже первого экрана — код этих секций не нужен для первой отрисовки и гидратации,
// поэтому выносим их в отдельные чанки вместо того, чтобы тащить всё в главный бандл Landing.
const About = dynamic(() => import('./components/About/About'));
const Gallery = dynamic(() => import('./components/Gallery/Gallery'));
const Delivery = dynamic(() => import('./components/Delivery/Delivery'));
const FAQ = dynamic(() => import('./components/FAQ/FAQ'));
const AssemblyScroll = dynamic(() => import('./components/AssemblyScroll/AssemblyScroll'));
const Socials = dynamic(() => import('./components/Socials/Socials'));
const Quiz = dynamic(() => import('./components/Quiz/Quiz'));
const Contacts = dynamic(() => import('./components/Contacts/Contacts'));
const Options = dynamic(() => import('./components/Options/Options'));
export default function Landing(){
  return (
    <div className="shell">
      <Header />
      <Hero />

       <Products/>
       <Models />
       <Gallery/>
       <Delivery/>
       <Options/>
      <About/>
       <FAQ />
       <Socials/>
<Quiz/>

    <AssemblyScroll/>
       <Contacts/>
      <Footer />
    </div>
  )
}