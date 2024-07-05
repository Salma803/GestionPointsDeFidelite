import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ValidGiftCardsCount() {
    const [validCardsCount, setValidCardsCount] = useState(0);
    const [validCardsPercentage, setValidCardsPercentage] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchValidGiftCardsData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/chequecadeau/admin/pourcentage');
                const { valid } = response.data;

                setValidCardsCount(valid.count);
                setValidCardsPercentage(valid.percentage);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching valid gift cards data:', error);
                setLoading(false);
            }
        };

        fetchValidGiftCardsData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="small-box bg-success">
            <div className="inner">
                <p>Valid Gift Cards</p>
                <h3>{validCardsPercentage}<sup style={{fontSize: 20}}>%</sup></h3>
            </div>
            <div className="icon">
                <i className="ion ion-checkmark" />
            </div>
            <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
        </div>
    );
}

export default ValidGiftCardsCount;
