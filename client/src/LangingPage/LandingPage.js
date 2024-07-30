import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate('/admin/login');
  };

  const handleClientLogin = () => {
    navigate('/client/login');
  };

  return (
    <div className="client-cf-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="client-cf-screen__background">
                    <span className="client-cf-screen__background__shape client-cf-screen__background__shape4"></span>
                    <span className="client-cf-screen__background__shape client-cf-screen__background__shape3"></span>
                    <span className="client-cf-screen__background__shape client-cf-screen__background__shape2"></span>
                    <span className="client-cf-screen__background__shape client-cf-screen__background__shape1"></span>
            </div>
            <div className='client-cf-screen__content'>
      <h1>Bienvenue sur notre application</h1>
      <h2>Etes vous un?</h2>
      <div style={{ margin: '20px' }}>
        <button onClick={handleAdminLogin} style={{ margin: '10px', padding: '10px 20px' }}>
          Admin
        </button>
        <button onClick={handleClientLogin} style={{ margin: '10px', padding: '10px 20px' }}>
          Client
        </button>
      </div>
    </div>
    </div>
  );
}

export default LandingPage;
