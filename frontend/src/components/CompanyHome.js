import axios from 'axios';
import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
import CHome from './CHome';
import CHome2 from './CHome2';
import { useLocation } from 'react-router-dom';


const CompanyHome = () => {
    // const { email } = useParams();
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(false);
    const location = useLocation();
    const { email } = location.state || {}; 
    console.log(email);


    useEffect(() => {

        if (!email) {
            setError(true);
            return;
        }
        
        const fetchStatus = () => {
            axios.get(`http://localhost:3001/company-status/${email}`)
                .then(response => {
                    if (response.data) {
                        setStatus(response.data.c_status);
                        setError(false);
                    } else {
                        setError(true);
                        setStatus(null);
                    }
                })
                .catch(error => {
                    console.error("There was an error fetching the status!", error);
                    setError(true);
                    setStatus(null);
                });
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 5000); 

        return () => clearInterval(interval); 
    }, [email]);

    if (error) {
        return <CHome message="Your company account has been deleted or does not exist."/>;
    }

    if (status === null) {
        return <div>Loading...</div>;
    }

    if (status === 0) {
        return <CHome message="Company verification in progress. Please wait until our team has completed your verification process. You will receive a notification once this step is completed. Thank you for your cooperation!"/>;;
    }

    if(!localStorage.getItem('companyRegistrationNumber')){
        return <h2 style={{textAlign:'center' , color:'red'}} >Unauthorized Access</h2>
    }

    

    return <CHome2/>;
};

export default CompanyHome;