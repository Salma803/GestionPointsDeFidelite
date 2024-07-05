import React from 'react';

function SideNav() {

  return (
    <div>
<aside className="main-sidebar sidebar-light-indigo elevation-4 " >
  {/* Brand Logo */}
  <a href="index3.html" className="brand-link">
    <img src="/dist/img/user2-160x160.jpg" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{opacity: '.8'}} />
    <span className="brand-text font-weight-light">Agent Fidélité</span>
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
          <a href="/admin/home" className="nav-link active">
            <i className="nav-icon fas fa-tachometer-alt" />
            <p>
              Dashboard
            </p>
          </a>
        </li>
  
        <li className="nav-item">
          <a href='/admin/creerclient' className="nav-link">
            <i  className="nav-icon fas fa-user" />
            <p>
              Création Client
              
              <span className="badge badge-info right">6</span>
            </p>
          </a>
          
        </li>
        <li className="nav-item">
          <a href="/admin/listeclients" className="nav-link">
            <i className="nav-icon fas fa-edit" />
            <p>
              Clients
            </p>
          </a>
        </li>
        <li className="nav-item">
          <a href="/admin/cartefidelite" className="nav-link">
            <i className="nav-icon fas fa-edit" />
            <p>
              Carte Fidélité
              
            </p>
          </a>
        </li>
        <li className="nav-item">
          <a href="/admin/chequecadeau" className="nav-link">
            <i className="nav-icon fas fa-edit" />
            <p>
              Chéques Cadeaux
            </p>
          </a>
        </li>
        <li className="nav-header">Paramétres</li>
        <li className="nav-item">
          <a href="/admin/info" className="nav-link">
            <i className="nav-icon fas fa-wrench" />
            <p>
              Mes infos
              <span className="badge badge-info right">2</span>
            </p>
          </a>
        </li>
        <li className="nav-item">
          <a href="pages" className="nav-link">
            <i className="nav-icon fas fa-wrench" />
            <p>
              Email
            </p>
          </a>
        </li>
        <li className="nav-item">
          <a href="pages/kanban.html" className="nav-link">
            <i className="nav-icon fas fa-wrench" />
            <p>
              Mot de passe
            </p>
          </a>
        </li>
        <li className="nav-header">Centre</li>
        <li className="nav-item">
          <a href="iframe.html" className="nav-link">
            <i className="nav-icon fas fa-ellipsis-h" />
            <p>Réclamations</p>
          </a>
        </li>
        <li className="nav-item">
          <a href="iframe.html" className="nav-link">
            <i className="nav-icon fas fa-ellipsis-h" />
            <p>Réponses</p>
          </a>
        </li>
        <li className="nav-item">
          <a href="https://adminlte.io/docs/3.1/" className="nav-link">
            <i className="nav-icon fas fa-file" />
            <p>Documentation</p>
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

export default SideNav
