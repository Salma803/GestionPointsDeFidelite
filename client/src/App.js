import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import LoginClient from "./Client/pages/LoginClient";
import LoginAdmin from "./Admin/LoginAdmin";
import CreerClient from "./Admin/CreerClient";
import ClientHome from "./Client/pages/ClientHome";
import ProductDetails from "./Client/pages/ProductDetails";
import UserProfile from "./Client/pages/UserProfile";
import Panier from "./Client/pages/Panier";
import CarteFidelite from "./Client/pages/CarteFidelite";
import ChequeCadeau from "./Client/pages/ChequeCadeau";
import Achat from "./Client/pages/Achat";
import NavBar from "./Client/pages/NavBar";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    // Add any effect you want to run on component mount
  }, []);

  // Function to check if current path is /client (login page)
  const isLoginPage = location.pathname === "/client";

  return (
    <div className="App">
      {/* Render NavBar if current path is not /client */}
      {!isLoginPage && <NavBar />}
      <Routes>
        <Route path="/client" element={<LoginClient />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/creerclient" element={<CreerClient />} />
        <Route path="/client/home" element={<ClientHome />} />
        <Route path="/client/produit/:id" element={<ProductDetails />} />
        <Route path="/user" element={<UserProfile />} />
        <Route path="/panier" element={<Panier />} />
        <Route path="/cartefidelite" element={<CarteFidelite />} />
        <Route path="/chequecadeau" element={<ChequeCadeau />} />
        <Route path="/achat" element={<Achat />} />
      </Routes>
    </div>
  );
}

export default App;
