import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginClient from "./Client/pages/LoginClient";
import LoginAdmin from "./Admin/pages/LoginAdmin";
import CreerClient from "./Admin/pages/CreerClient";
import ClientHome from "./Client/pages/ClientHome";
import ProductDetails from "./Client/pages/ProductDetails";
import UserProfile from "./Client/pages/UserProfile";
import Panier from "./Client/pages/Panier";
import CarteFidelite from "./Client/pages/CarteFidelite";
import Achat from "./Client/pages/Achat";
import Page from "./Admin/components/Page";
import ListeClients from "./Admin/pages/ListeClients";
import ListeCarteFidelite from "./Admin/pages/ListeCarteFidelite";
import ListesChequesCadeau from "./Admin/pages/ListesChequesCadeau";
import UseAuth from "./Admin/hooks/UseAuth";
import AdminInfo from "./Admin/pages/AdminInfo";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/client" element={<LoginClient />} />
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/admin/creerclient" element={<CreerClient />} />
          <Route path="/client/home" element={<ClientHome />} />
          <Route path="/client/produit/:id" element={<ProductDetails />} />
          <Route path="/user" element={<UserProfile />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/cartefidelite" element={<CarteFidelite />} />
          <Route path="/achat" element={<Achat />} />
          <Route path="/admin/home" element={<Page />} />
          <Route path="/admin/listeclients" element={<ListeClients />} />
          <Route path="/admin/cartefidelite" element={<ListeCarteFidelite />} />
          <Route path="/admin/chequecadeau" element={<ListesChequesCadeau />} />
          <Route path='/auth' element={<UseAuth/>} />
          <Route path='/admin/info' element={<AdminInfo/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
