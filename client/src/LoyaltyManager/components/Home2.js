import React from 'react';
import ClientCount from '../utils/ClientCount';
import ChequeCadeauCount from '../utils/ChequeCadeauCount';
import ValidGiftCardsCount from '../utils/ValideCardsCount';
import ExpiredCardsCount from '../utils/ExpiredCardCount';
import ConsumedcardsCount from '../utils/ConsumedCardsCount';
import LoyaltyCardsCount from '../utils/LoyaltyCardsCount';

function Home2() {
  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item active">Dashboard v1</li>
              </ol>
            </div>
            {/* /.col */}
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </div>
      {/* /.content-header */}
      
      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          {/* Small boxes (Stat box) */}
          <div className="row">
            <div className="col-lg-3 col-6">
              {/* small box */}
              <div>
                <ClientCount />
              </div>
            </div>
            {/* ./col */}
            <div className="col-lg-3 col-6">
              {/* small box */}
              <div>
                <LoyaltyCardsCount />
              </div>
            </div>
            {/* ./col */}
            <div className="col-lg-3 col-6">
              {/* small box */}
              <div>
                <ChequeCadeauCount />
              </div>
            </div>
            {/* ./col */}
            <div className="col-lg-3 col-6">
              {/* small box */}
              <div>
                <ValidGiftCardsCount />
              </div>
            </div>
            {/* ./col */}
            <div className="col-lg-3 col-6">
              {/* small box */}
              <div>
                <ExpiredCardsCount />
              </div>
            </div>
            {/* ./col */}
            <div className="col-lg-3 col-6">
              {/* small box */}
              <div>
                <ConsumedcardsCount />
              </div>
            </div>
            {/* ./col */}
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </section>
      {/* /.content */}
    </div>
  );
}

export default Home2;
