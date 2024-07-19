import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductCount() {
    const [productCount, setProductCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductCount = async () => {
            try {
                const response = await axios.get('http://localhost:3001/produit/compter/count');
                setProductCount(response.data.count);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product count:', error);
                setLoading(false);
            }
        };

        fetchProductCount();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{backgroundColor: '#0f448c'}} className="small-box bg">
            <div className="inner">
                <h3>{productCount}</h3>
                <p>Products</p>
            </div>
            <div className="icon">
                <i className="ion ion-stats-bars" />
            </div>
        </div>
    );
}

export default ProductCount;
