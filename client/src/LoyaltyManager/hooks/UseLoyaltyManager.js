import { useState, useEffect } from 'react';
import axios from 'axios';

const UseLoyaltyManager = () => {
    const [isLoyaltyManager, setIsLoyaltyManager] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkRole = async () => {
            try {
                const response = await axios.get('http://localhost:3001/admin/checkloyaltymanager', {
                    headers: {
                        accessToken: sessionStorage.getItem('accessToken'),
                    },
                });
                setIsLoyaltyManager(response.data.isLoyaltyManager);
            } catch (error) {
                console.error('Error checking loyalty manager role:', error);
            } finally {
                setLoading(false);
            }
        };

        checkRole();
    }, []);

    return { isLoyaltyManager, loading };
};

export default UseLoyaltyManager;
