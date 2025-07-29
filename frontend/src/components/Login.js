import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from  './styleLogin.module.css';
import logo from '../images/logo.png';
import login_image from '../images/login_image.png';


const Login = () => {
    const [formData, setFormData] = useState({
        phone_number: '',
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
        axios.post('http://localhost:3001/login', formData)

            .then(response => {
                localStorage.setItem('js_id', response.data.js_id);
                localStorage.setItem('js_name', response.data.js_name);
                localStorage.setItem('js_gender',response.data.js_gender);
                navigate('/U_home');
            })
            .catch(error => {
                setErrorMessage('Incorrect phone number or password');
                console.error("There was an error logging in the user!", error);
            });
    };

    const handleCompanyToggle = () => {
        navigate('/CompanyLogin'); 
    };

    return (

    <div className={styles.c_login_main + " " + styles.c_signup_main}>
      <div className={styles.left}>

        <header className={styles.header} style={{ justifyContent: 'center', position: 'absolute', top: 0, width: '100%', boxShadow: 'none' }} >
          <div className={styles.logo}>
            <img src={logo} alt="Logo" />
            <h3 style={{ marginTop: '2px' }}>LabourLink</h3>
          </div>
        </header>

        <div style={{ marginTop: '70px' }}>
        <div className={styles.toggle}>
          <h4 className={styles.active}>JobSeeker</h4>
          <h4 id={styles.companyToggle} onClick={handleCompanyToggle}>Company</h4>
        </div>

        <div className={styles.text}>
          <h1>Login</h1>
          <h4> Don’t have an account? <a className={styles.signupLink} href="Signup">Create Account</a> </h4>
        </div>

        <form onSubmit={handleSubmit}>
        {/* <h2>JobSeeker Login</h2> */}
          <input  type="text" placeholder="Phone Number (03231234567)" id="phone-num" name="phone_number" onChange={handleChange}  required maxLength={11} minLength={11} pattern="\d{11}" title="Please enter only 11 digits" />
          <input type="password"  placeholder="Password (Minimum 8 characters)"  name="password" onChange={handleChange}  required minLength={8} maxLength={100} />
          {errorMessage && <div className={styles.errorMessages}>{errorMessage}</div>}
          <input type="submit" id="user-login"  value="Login" />
        </form>

      </div>
      </div>

      <div className={styles.right}>
        <img src={login_image} alt="User Login Image" />
      </div>

    </div>
    );
};

export default Login;