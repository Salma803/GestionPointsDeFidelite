import React from 'react';
import ProductCount from '../utils/ProductCount';
import RayonCount from '../utils/RayonCount';
import AchatTotal from '../utils/AchatTotal';
import ProductStats from '../utils/ProductStats';
import DashboardCalendar from '../utils/DashboardCalendar';

function Home() {
  return (
    <div>
 <div className="content-wrapper">
  {/* Content Header (Page header) */}
  <div className="content-header">
    <div className="container-fluid">
      <div className="row mb-2">
        <div className="col-sm-6">
          <h1 className="m-0">Dashboard</h1>
        </div>{/* /.col */}
        <div className="col-sm-6">
          <ol className="breadcrumb float-sm-right">
            <li className="breadcrumb-item"><a href=" #">Home</a></li>
            <li className="breadcrumb-item active">Dashboard v1</li>
          </ol>
        </div>{/* /.col */}
      </div>{/* /.row */}
    </div>{/* /.container-fluid */}
  </div>
  {/* /.content-header */}
  {/* Main content */}
  <section className="content">
  <div className='client-cf-screen__content'>
    
    <div className="client-cf-screen__background">
        <span className="client-cf-screen__background__shape client-cf-screen__background__shape4"></span>
        <span className="client-cf-screen__background__shape client-products-screen__background__shape6"></span>
        <span className="client-cf-screen__background__shape client-cf-screen__background__shape5"></span>
        <span className="client-cf-screen__background__shape client-cf-screen__background__shape3"></span>
        <span className="client-cf-screen__background__shape client-cf-screen__background__shape2"></span>
        <span className="client-cf-screen__background__shape client-cf-screen__background__shape1"></span>
    </div>
    <div className="container-fluid">
      {/* Small boxes (Stat box) */}
      <div className="row">
        <div className="col-lg-3 col-6">
          {/* small box */}
        <div>
            <ProductCount/>
        </div>
        </div>
        {/* ./col */}
          <div className="col-lg-3 col-6">
          {/* small box */}
          <div>
            <RayonCount/>
        </div>
        </div>
        <div className="col-lg-3 col-6">
          {/* small box */}
          <div>
            <AchatTotal/>
        </div>
        </div>
        {/* ./col */}
        <div className="col-lg-3 col-6">
        <div>

        </div>
        </div>
        <div className="col-lg-3 col-6">
        <div>
      
        </div>
        </div>
        <div className="col-lg-3 col-6">
        <div>
            
        </div>
        </div>
        {/* ./col */}
        <div className="col-lg-3 col-6">

        </div>
      </div>
      {/* /.row */}
      {/* Main row */}
      <div className="row">
        {/* Left col */}
        <section className="col-lg-7 connectedSortable">
          
        <div >
            <div className="card-header border-0">
              <h3 className="card-title">
                <i className=" fa fa-chart-line mr-2" />
                Produits Selon Achats
              </h3>
              
              {/* /. tools */}
            </div>
            
            <ProductStats/>
          </div>
          
          
          
</section>
{/* /.Left col */}
        {/* right col (We are only adding the ID to make the widgets sortable)*/}
        <section className="col-lg-5 connectedSortable">
        <div >
            <div className="card-header border-0">
              <h3 className="card-title">
                {/* <i className="far fa-chart-bar mr-2" />
                Gift card status */}
              </h3>
              {/* tools card */}
              
              {/* /. tools */}
            </div>
            
          </div>
        </section>
          <div className="card bg-white">
            <div className="card-header border-0">
              <h3 className="card-title">
                <i className="far fa-calendar-alt mr-2" />
                Calendar
              </h3>
              {/* tools card */}
              <div className="card-tools">
                {/* button with a dropdown */}
                
                <button type="button" className="btn btn-white btn-sm" data-card-widget="remove">
                  <i className="fas fa-times" />
                </button>
              </div>
              {/* /. tools */}
            </div>
            <DashboardCalendar/>
          </div>
      </div>
    </div>
    </div>
  </section>
  {/* /.content */}
</div>

    </div>
  )
}

export default Home
