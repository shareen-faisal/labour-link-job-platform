import React, { useState } from 'react';
import axios from 'axios';
import styles from './adminLoginStyle.module.css';
import logo from '../images/logo.png';
import loginImage from '../images/login_image.png';


const AdminLogin = () => {

        const [formData,setFormData] = useState({
            username:"",
            password:""
        });
        const [errorMessage, setErrorMessage] = useState('');


        const handleChange = e => {
            setFormData({...formData,[e.target.name] : e.target.value});
            setErrorMessage(''); 
        };

        const handleSubmit = e => {
            e.preventDefault();
            setErrorMessage('');
            axios.post('http://localhost:3001/admin-login',formData)

                .then(response =>{
                    localStorage.setItem('adminUsername',formData.username);
                    window.location.href = '/AdminDashboard';
                })

                .catch(error => {
                    setErrorMessage('Incorrect username or password');
                    console.error('There was an error loging in for admin!',error);
                })
        };

        return (

            <div className={styles.c_login_main}>
            <div className={styles.left}>
                <header className={styles.header} style={{ justifyContent: 'center', position: 'absolute', top: 0, width: '100%', boxShadow: 'none' }}>
                    <div className={styles.logo}>
                        <img src={logo} alt="Logo" />
                        <h3 style={{ marginTop: '2px' }}>LabourLink</h3>
                    </div>
                </header>
                <div>-
                <h2 id={styles.admin_login_h2}>Login</h2>

                </div>


                <form onSubmit={handleSubmit}>
                    <input type="text" name="username" placeholder="Username" onChange={handleChange} className={styles.textAndPassowrd} maxLength={25} required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} className={styles.textAndPassowrd} maxLength={25} required />
                    { errorMessage ? <div className="error-messages" style={{ color: 'red' }}>{errorMessage}</div> : null }
                    <button type="submit" className={styles.adminSubmit}>Login</button>
                </form>
            </div>
            <div className={styles.right}>
                <img src={loginImage} alt="LoginImage" />
            </div>
        </div>

         
            
          );

}//adminlogin

export default AdminLogin;
