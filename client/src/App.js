import axios from "axios";
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginClient from "./Client/LoginClient";
import LoginAdmin from "./Admin/LoginAdmin";
import CreerClient from "./Admin/CreerClient";
// import ListeClients from "./Admin/ListeClients";
import ClientHome from "./Client/ClientHome";
import ProductDetails from "./Client/ProductDetails";
import UserProfile from "./Client/UserProfile";
import Panier from "./Client/Panier";
import CarteFidelite from "./Client/CarteFidelite";

function App() {
  useEffect(()=>{


  },[])
  return (
    <div className="App">
      <Router>
          <Routes>
            <Route path="/client" element={<LoginClient />} />
            <Route path="/admin/login" element={<LoginAdmin />} />
            <Route path="/admin/creerclient" element={<CreerClient />} />
            {/* <Route path="/admin/listeclients" element={<ListeClients />} /> */}
            <Route path="/client/home" element={<ClientHome />} />
            <Route path="/client/produit/:id" element={<ProductDetails />} />
            <Route path="/user" element={<UserProfile />} />
            <Route path="/panier" element={<Panier />} />
            <Route path="/cartefidelite" element={<CarteFidelite />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
