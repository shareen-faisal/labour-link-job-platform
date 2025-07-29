import React from 'react';
import styles from './styleCompanyHeader.module.css'; 
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import axios from 'axios';


const CompanyHeader = () => {
  const navigate = useNavigate();


  const handleLogoClick = () => {
                navigate('/CompanyHome', {state : {email : localStorage.getItem('companyEmail') } });
  };

  const handleLogoutClick = () => {
    axios.post('http://localhost:3001/company-logout')
      .then(response => {
        localStorage.removeItem('companyRegistrationNumber');
        localStorage.removeItem('companyEmail');
        localStorage.removeItem('companyLogo');
        localStorage.removeItem('companyName');
        navigate('/CompanyLogin');
      }) 

      .catch(error =>{
          console.error('Error logging out Company' , error);
      })

  };

  const handleJob = () => {
    navigate('/CompanyJobPost');
};

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="Logo" />
        <h3 style={{ marginTop: '2px' , cursor:'pointer'}} onClick={handleLogoClick} >
          LabourLink
        </h3>
      </div>
      <div className={styles.userinfo}>
        <div className={styles.avatar} style={{ marginRight: '20px' }}>
          <img  src={`http://localhost:3001/uploads/${localStorage.getItem('companyLogo')}`} alt="Avatar" />
        </div>
        <div className={styles.usertext} style={{ marginRight: '20px' }}>
          <button className={styles.btn2} id="post-job-button" onClick={handleJob}>
            Post a Job
          </button>
        </div>
        <div className={styles.usertext}>
          <button id="user-logout" onClick={handleLogoutClick}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default CompanyHeader;
