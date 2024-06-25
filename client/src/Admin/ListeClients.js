import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ListeClients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchClients() {
           
                const response = await axios.get('http://localhost:3001/admin/test');
                setClients(response.data);
                setLoading(false);
                console.log('Fetched data:', response.data);
            
        }

        fetchClients();
    }, []); // Empty dependency array ensures useEffect runs once on component mount

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>List of Clients:</h2>
            <ul>
                {clients.map(client => (
                    <li key={client.id}>
                        {client.nom} {client.prenom} - {client.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListeClients;
