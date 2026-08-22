'use client';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Models from './components/Models/Models';
import Products from './components/Products/Products';
import About from './components/About/About'
import Gallery from './components/Gallery/Gallery';
import Delivery from './components/Delivery/Delivery';
import FAQ from './components/FAQ/FAQ';
import Footer from './components/Footer/Footer';
import AssemblyScroll from './components/AssemblyScroll/AssemblyScroll'
import Socials from './components/Socials/Socials'
import Quiz from './components/Quiz/Quiz'
import Contacts from './components/Contacts/Contacts'
export default function Landing(){
  return (
    <div className="shell">
      <Header />
      <Hero />
    
       <Products/>
       <Models />
       <Gallery/>
       <Delivery/>
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