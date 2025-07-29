import React from 'react';
import {  useNavigate } from 'react-router-dom';
import styles from './styleHeader.module.css';
import logo from '../images/logo.png';
import maleAvatar from '../images/av1.png';
import femaleAvatar from '../images/av2.png';
import axios from 'axios';




const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        axios.post('http://localhost:3001/logout')
            .then(response => {
                console.log(response.data);
                localStorage.removeItem('js_name');
                localStorage.removeItem('js_id');
                localStorage.removeItem('js_gender');
                navigate('/Login'); 
            })
            .catch(error => {
                console.error('Error logging out user:', error);
            });
    };

    const navigateToU_Home = () => {
        navigate('/U_home'); 
    };

    let userGender = localStorage.getItem('js_gender');
    let avatar = userGender === 'Male' ? maleAvatar : femaleAvatar;
    
    return (
        <header className={styles.header}>
        <div className={styles.logo}>
            <img src={logo} alt="Logo" />
            <h3 style={{ marginTop: '2px', cursor: 'pointer' }} onClick={navigateToU_Home}>LabourLink</h3>
        </div>
        <div className={styles.user_info}>
            <div className={styles.avatar}>
            <img src={avatar} alt="Avatar" />
            </div>
            <div className={styles.user_text}>
                <span>{localStorage.getItem('js_name')}</span>
                <button onClick={handleLogout} id={styles.user_logout}>Logout</button>
            </div>
        </div>
    </header>
    );
};



export default Header;