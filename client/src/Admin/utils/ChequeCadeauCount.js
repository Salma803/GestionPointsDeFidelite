import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChequeCadeauCount() {
    const [chequeCadeauCount, setChequeCadeauCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChequeCadeauCount = async () => {
            try {
                const response = await axios.get('http://localhost:3001/chequecadeau/admin/count');
                setChequeCadeauCount(response.data.count);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching gift card count:', error);
                setLoading(false);
            }
        };

        fetchChequeCadeauCount();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="small-box bg-purple">
            <div className="inner">
                <h3>{chequeCadeauCount}</h3>
                <p>Gift Cards</p>
            </div>
            <div className="icon">
                <i className="ion ion-bag" />
            </div>
            <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
        </div>
    );
}

export default ChequeCadeauCount;