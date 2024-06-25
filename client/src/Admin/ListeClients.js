import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './AdminClients.css';

function ListeClients() {
  const [listClients, setListClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch list of clients
    axios.get("http://localhost:3001/admin/listclients")
      .then((response) => {
        setListClients(response.data);
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
      });
  }, []);

  const fetchClientDetails = (id) => {
    // Fetch client details by ID
    axios.get(`http://localhost:3001/admin/client/${id}`)
      .then((response) => {
        setSelectedClient(response.data);
        setShowDetails(true); // Show details after fetching
      })
      .catch((error) => {
        console.error(`Error fetching client ${id} details:`, error);
      });
  };

  const deleteClient = (id) => {
    if (window.confirm("Êtes-vous sûr(e) de vouloir supprimer ce client ?")) {
      axios.delete(`http://localhost:3001/admin/client/${id}`, {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          console.error(response.data.error);
        } else {
          // Remove the deleted client from the list
          setListClients(listClients.filter((client) => client.id !== id));
          setSelectedClient(null); // Clear selected client details after deletion
          setShowDetails(false); // Hide details after deletion
        }
      })
      .catch((error) => {
        console.error("There was an error deleting the client!", error);
      });
    }
  };

  return (
    <div className="Home11">
      <div className="container11">
        <div className="compte11">
          <Link to="/admin/account" className="backButton11">
            Accueil
          </Link>
          <h2>Liste des Clients</h2>
        </div>
        <div className="clients11">
          {/* List of clients */}
          {listClients.map((client) => (
            <div className="client11" key={client.id}>
              <h3>{client.nom} {client.prenom}</h3>
              {/* Toggle between "Voir Détails" and "Cacher Détails" */}
              {showDetails && selectedClient && selectedClient.id === client.id ? (
                <div>
                  <button onClick={() => setShowDetails(false)}>Cacher Détails</button>
                  <button onClick={() => deleteClient(client.id)} className="deleteButton11">Supprimer le Client</button>
                  {/* Display selected client details */}
                  <div>
                    <h4>Détails du Client</h4>
                    <p><strong>Nom :</strong> {selectedClient.nom}</p>
                    <p><strong>Prénom :</strong> {selectedClient.prenom}</p>
                    <p><strong>Adresse :</strong> {selectedClient.adresse}</p>
                    {/* Add more details here */}
                  </div>
                </div>
              ) : (
                <button onClick={() => fetchClientDetails(client.id)}>Voir Détails</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListeClients;
