import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import SideNav from './SideNav';
import UseAuth from '../hooks/UseAuth'
import UseLoyaltyManager from '../hooks/UseLoyaltyManager';

function Page() {
  const isAuthentificated = UseAuth();
  const { isLoyaltyManager, loading } = UseLoyaltyManager();

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!isLoyaltyManager) {
        return <p>You do not have access to this section.</p>;
    }

  return (
    <div className='wrapper'>
      <Header/>
      <Home/>
      <SideNav/>
      <Footer/>
    </div>
  )
}

export default Page
