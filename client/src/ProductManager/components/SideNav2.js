import React from 'react';
import { useNavigate } from 'react-router-dom';

function SideNav2() {
  let navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem('accessToken');
    navigate('/admin/login');
};
  return (
    <div>
<aside className="main-sidebar sidebar-light-yellow elevation-4 " >
  {/* Brand Logo */}
  <a href="index3.html" className="brand-link">
    <img src="/dist/img/user2-160x160.jpg" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{opacity: '.8'}} />
    <span className="brand-text font-weight-light">Agent Magasin</span>
  </a>
  {/* Sidebar */}
  <div className="sidebar">
    {/* Sidebar user panel (optional) */}
    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
      <div className="image">
        <img src="/dist/img/user2-160x160.jpg" className="img-circle elevation-2"  />
      </div>
      <div className="info">
        <a href="#" className="d-block">SALMA</a>
      </div>
    </div>
    {/* SidebarSearch Form */}
    <div className="form-inline">
      <div className="input-group" data-widget="sidebar-search">
        <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
        <div className="input-group-append">
          <button className="btn btn-sidebar">
            <i className="fas fa-search fa-fw" />
          </button>
        </div>
      </div>
    </div>
    {/* Sidebar Menu */}
    <nav className="mt-2">
      <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
        {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
        <li className="nav-item menu-open">
          <a href="/productmanager/home" className="nav-link active">
            <i className="nav-icon fas fa-tachometer-alt" />
            <p>
              Dashboard
            </p>
          </a>
        </li>
  
        <li className="nav-item">
          <a href='/productmanager/creerproduit' className="nav-link">
            <i  className="nav-icon fas fa-user" />
            <p>
              Ajouter un produit
            </p>
          </a>
        </li>
        <li className="nav-item">
          <a href='/productmanager/creerrayon' className="nav-link">
            <i  className="nav-icon fas fa-user" />
            <p>
              Ajouter un Rayon
            </p>
          </a>
        </li>
        <li className="nav-item">
          <a href="/productmanager/produits" className="nav-link">
            <i className="nav-icon fas fa-edit" />
            <p>
              Gestion Produits
            </p>
          </a>
        </li>
        <li className="nav-item">
          <a href="/productmanager/rayons" className="nav-link">
            <i className="nav-icon fas fa-edit" />
            <p>
              Gestion Rayon
            </p>
          </a>
        </li>
        <li className="nav-item">
          <a href="/productmanager/promotions" className="nav-link">
            <i className="nav-icon fas fa-edit" />
            <p>
              Gestion Promo Produits
              
            </p>
          </a>
        </li>
        <li className="nav-item">
          <a href="/productmanager/promotions1" className="nav-link">
            <i className="nav-icon fas fa-edit" />
            <p>
              Gestion Promo Rayons
              
            </p>
          </a>
        </li>
        <li className="nav-item">
          <a href="/productmanager/regles" className="nav-link">
            <i className="nav-icon fas fa-edit" />
            <p>
              Gestion Regles
            </p>
          </a>
        </li>
        <li className="nav-header">Centre</li>
        
        <li className="nav-item">
          <a href="#" className="nav-link">
            <i className="nav-icon fas fa-file" />
            <p>Documentation</p>
          </a>
        </li>
        <li className="nav-header">Paramétres</li>
        <li className="nav-item">
          <a href="/productmanager/info" className="nav-link">
            <i className="nav-icon fas fa-wrench" />
            <p>
              Mes infos
            </p>
          </a>
        </li>
        <li className="nav-item">
          <a  onClick={logout} className="nav-link active">
            <i   className="nav-icon fas fa-sign-out-alt" />
            <p>
              Se déconnecter
            </p>
          </a>
        </li>
        

      </ul>
    </nav>
    {/* /.sidebar-menu */}
  </div>
  {/* /.sidebar */}
</aside>

    </div>
  )
}

export default SideNav2;
