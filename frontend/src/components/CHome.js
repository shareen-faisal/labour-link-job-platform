import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styleCHome.module.css';
import axios from 'axios';



function CHome({message}) {

const navigate = useNavigate();

const handleLogout = () => {
    axios.post('http://localhost:3001/company-logout')
        .then(response =>{
            console.log(response.data);
            localStorage.removeItem('companyRegistrationNumber');
            localStorage.removeItem('companyEmail');
            localStorage.removeItem('companyLogo');
            localStorage.removeItem('companyName');
            navigate('/CompanyLogin');
        })

        .catch(error =>{
            console.error('Failed to logout company.' , error);
        })
};

if(!localStorage.getItem('companyRegistrationNumber')){
    return <h2 style={{textAlign:'center' , color:'red'}} >Unauthorized Access</h2>
}

  return (        
    <div>
        <div className={styles.shadow}></div>
        <div className={styles.message}>
            <div className={styles.box}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <p>Hello {localStorage.getItem('companyName')}</p>
                    <button id="c-blocked-logout" onClick={handleLogout} > Logout </button>
                </div>
                <p>
                   {message}
                </p>
            </div>
        </div>
    </div>
);
}

export default CHome
