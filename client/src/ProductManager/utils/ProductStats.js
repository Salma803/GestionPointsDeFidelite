import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/CreerProduit.css'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const ProductStats = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/achat/stat/produit');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        
        <ResponsiveContainer  className='chart-container' width="100%" height={400}>
            <BarChart
                data={data}
                margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nom" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="nb_achats" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default ProductStats;
