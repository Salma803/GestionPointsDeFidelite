import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LogOut() {
    const navigate = useNavigate();

    useEffect(() => {
        // Remove access token from session storage
        sessionStorage.removeItem('accessToken');
        
        // Navigate to the client page
        navigate('/admin/login');
    }, [navigate]);

    return (
        <div>
            Logging out...
        </div>
    );
}

export default LogOut;
