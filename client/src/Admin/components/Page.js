import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import SideNav from './SideNav';

function Page() {
  return (
    <div className='wrapper'>
      <Header/>
      <Footer/>
      <Home/>
      <SideNav/>
    </div>
  )
}

export default Page
