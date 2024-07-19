// ClientCount.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ClientCount() {
    const [clientCount, setClientCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClientCount = async () => {
            try {
                const response = await axios.get('http://localhost:3001/client/count');
                setClientCount(response.data.count);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching client count:', error);
                setLoading(false);
            }
        };

        fetchClientCount();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{backgroundColor: '#0f448c'}} className="small-box bg">
            <div className="inner">
                <h3>{clientCount}</h3>
                <p>Client accounts</p>
            </div>
            <div className="icon">
                <i className="ion ion-bag" />
            </div>
        </div>
    );
}

export default ClientCount;
