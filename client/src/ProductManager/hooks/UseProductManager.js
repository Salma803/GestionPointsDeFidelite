import { useState, useEffect } from 'react';
import axios from 'axios';

const UseProductManager = () => {
    const [isProductManager, setIsProductManager] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkRole = async () => {
            try {
                const response = await axios.get('http://localhost:3001/admin/checkproductmanager', {
                    headers: {
                        accessToken: sessionStorage.getItem('accessToken'),
                    },
                });
                setIsProductManager(response.data.isProductManager);
            } catch (error) {
                console.error('Error checking loyalty manager role:', error);
            } finally {
                setLoading(false);
            }
        };

        checkRole();
    }, []);

    return { isProductManager, loading };
};

export default UseProductManager;
