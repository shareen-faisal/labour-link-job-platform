import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StyleA.module.css';
import logo from '../images/logo.png';
import login_image from '../images/login_image.png';


const CompanyLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');


    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMessage(''); 

    };

    const handleSubmit = e => {
        e.preventDefault();
        setErrorMessage(''); 
        axios.post('http://localhost:3001/company-login', formData)
            .then(response => {
                const { message, company } = response.data;
                console.log(message);
                localStorage.setItem('companyRegistrationNumber', company.registrationNumber);
                localStorage.setItem('companyEmail', company.email);
                localStorage.setItem('companyLogo', company.logo);
                localStorage.setItem('companyName', company.name);
                // navigate(`/CompanyHome/${formData.email}`);
                navigate('/CompanyHome',{state : { email: formData.email } });
            })
            .catch(error => {
                setErrorMessage('Incorrect email or password');
                console.error("There was an error logging in the company!", error);
            });
    };

    const handleJobSeekerToggle = () => {
        navigate('/Login'); 
    };

    return (

        <div className={styles.c_login_main +" "+ styles.c_signup_main}>
            <div className={styles.left}>
                <header className={styles.header} style={{ justifyContent: 'center', position: 'absolute', top: 0, width: '100%', boxShadow: 'none' }}>
                    <div className={styles.logo}>
                        <img src={logo} alt="Logo" />
                        <h3 style={{ marginTop: '2px' }}>LabourLink</h3>
                    </div>
                </header>

                <div style={{ marginTop: '70px' }}>
                    <div className={styles.toggle}>
                        <h4 id="jobSeekerToggle" onClick={handleJobSeekerToggle}>JobSeeker</h4>
                        <h4 className={styles.active}>Company</h4>
                    </div>

                <div className={styles.text}>
                    <h1>Login</h1>
                    <h4>Don’t have an account? <a href="CompanySignup" style={{ color: '#0A65CC', cursor: 'pointer', fontWeight: '600', textDecoration: 'none' }}>Create Account</a></h4>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* <h2>Company Login</h2> */}
                    <input type="email"name="email"placeholder="Email"value={formData.email} onChange={handleChange} required maxLength={100} />
                    <input type="password" name="password" placeholder="Password (Minimum 8 characters)" value={formData.password} onChange={handleChange} required  maxLength={50}/>
                    {errorMessage && <div className={styles.errorMessages}>{errorMessage}</div>}
                    <button type="submit">Login</button>
                </form>
            </div>
            </div>


            <div className={styles.right}>
                <img src={login_image} alt="Image" />
            </div>

        </div>
    );
};

export default CompanyLogin;