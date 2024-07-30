import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginClient from "./Client/pages/LoginClient";
import LoginAdmin from "./LoyaltyManager/pages/LoginAdmin";
import CreerClient from "./LoyaltyManager/pages/CreerClient";
import ClientHome from "./Client/pages/ClientHome";
import ProductDetails from "./Client/pages/ProductDetails";
import UserProfile from "./Client/pages/UserProfile";
import Panier from "./Client/pages/Panier";
import CarteFidelite from "./Client/pages/CarteFidelite";
import Achat from "./Client/pages/Achat";
import Page from "./LoyaltyManager/components/Page";
import ListeClients from "./LoyaltyManager/pages/ListeClients";
import ListeCarteFidelite from "./LoyaltyManager/pages/ListeCarteFidelite";
import ListesChequesCadeau from "./LoyaltyManager/pages/ListesChequesCadeau";
import UseAuth from "./LoyaltyManager/hooks/UseAuth";
import AdminInfo from "./LoyaltyManager/pages/AdminInfo";
import Home2 from "./LoyaltyManager/components/Home2";
import Reclamations from "./Client/pages/Reclamations";
import ReclamationsAdmin from "./LoyaltyManager/pages/ReclamationsAdmin";
import Page2 from "./ProductManager/components/Page2";
import CreerProduit from "./ProductManager/pages/CreerProduit";
import CreerRayon from "./ProductManager/pages/CreerRayon";
import Produits from "./ProductManager/pages/Produits";
import Rayons from "./ProductManager/pages/Rayons";
import PromotionsProduits from "./ProductManager/pages/PromotionsProduits";
import PromotionsRayons from "./ProductManager/pages/PromotionsRayons";
import Regles from "./ProductManager/pages/Regles";
import ClientInfo from "./Client/pages/ClientInfo";
import ProductManagerInfo from "./ProductManager/pages/ProductManagerInfo";
import ProductStats from "./ProductManager/utils/ProductStats";

import config from "./config/config.json";

function App() {
	return (
		<Router basename={config?.server?.base}>
			<div className="App">
				<Routes>
					<Route path="/client/login" element={<LoginClient />} />
					<Route path="/client/magasin" element={<ClientHome />} />
					<Route
						path="/client/produit/:id"
						element={<ProductDetails />}
					/>
					<Route path="/user" element={<UserProfile />} />
					<Route path="/panier" element={<Panier />} />
					<Route path="/cartefidelite" element={<CarteFidelite />} />
					<Route path="/achat" element={<Achat />} />
					<Route path="/admin/login" element={<LoginAdmin />} />
					<Route
						path="/loyaltymanager/creerclient"
						element={<CreerClient />}
					/>
					<Route path="/loyaltymanager/home" element={<Page />} />
					<Route
						path="/loyaltymanager/listeclients"
						element={<ListeClients />}
					/>
					<Route
						path="/loyaltymanager/cartefidelite"
						element={<ListeCarteFidelite />}
					/>
					<Route
						path="/loyaltymanager/chequecadeau"
						element={<ListesChequesCadeau />}
					/>
					<Route path="/auth" element={<UseAuth />} />
					<Route
						path="/loyaltymanager/info"
						element={<AdminInfo />}
					/>
					<Route path="/admin/graph" element={<Home2 />} />
					<Route
						path="/loyaltymanager/reclamations"
						element={<ReclamationsAdmin />}
					/>
					<Route
						path="/client/reclamations"
						element={<Reclamations />}
					/>
					<Route path="/productmanager/home" element={<Page2 />} />
					<Route
						path="/productmanager/creerproduit"
						element={<CreerProduit />}
					/>
					<Route
						path="/productmanager/creerrayon"
						element={<CreerRayon />}
					/>
					<Route
						path="/productmanager/produits"
						element={<Produits />}
					/>
					<Route path="/productmanager/rayons" element={<Rayons />} />
					<Route
						path="/productmanager/promotions"
						element={<PromotionsProduits />}
					/>
					<Route
						path="/productmanager/promotions1"
						element={<PromotionsRayons />}
					/>
					<Route path="/productmanager/regles" element={<Regles />} />
					<Route path="/client/info" element={<ClientInfo />} />
					<Route path="/count" element={<ProductStats />} />
					<Route
						path="/productmanager/info"
						element={<ProductManagerInfo />}
					/>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
