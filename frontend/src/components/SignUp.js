import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styleUserReg.module.css';
import logo from '../images/logo.png';
import login_image from '../images/login_image.png';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        gender: '',
        email: '',
        phone_number: '',
        password: '',
        confirm_password: ''
    });

    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);

    const handleEmailChange = e => {
        setFormData({ ...formData, email: e.target.value });
        checkEmail(e.target.value);
    };

    const handlePhoneChange = e => {
        setFormData({ ...formData, phone_number: e.target.value });
        checkPhone(e.target.value);
    };

    const checkEmail = email => {
        axios.post('http://localhost:3001/check-user-email', { email })
            .then(response => {
                if (response.data.exists) {
                    setErrors(prevErrors => [...prevErrors, 'Email already exists!']);
                } else {
                    setErrors(prevErrors => prevErrors.filter(error => error !== 'Email already exists!'));
                }
            })
            .catch(error => {
                console.error("There was an error checking the email!", error);
            });
    };

    const checkPhone = phone => {
        axios.post('http://localhost:3001/check-user-phone', { phone })
            .then(response => {
                if (response.data.exists) {
                    setErrors(prevErrors => [...prevErrors, 'Phone number already exists!']);
                } else {
                    setErrors(prevErrors => prevErrors.filter(error => error !== 'Phone number already exists!'));
                }
            })
            .catch(error => {
                console.error("There was an error checking the phone number!", error);
            });
    };

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = e => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            setErrors(prevErrors => [...prevErrors, 'Passwords do not match!']);
            return;
        } else {
          setErrors(prevErrors => prevErrors.filter(error => error !== 'Passwords do not match!'));
        }//if

        if (!emailRegex.test(formData.email)) {
          setErrors(prevErrors => [...prevErrors, 'Invalid email format!']);
          return;
        } else {
          setErrors(prevErrors => prevErrors.filter(error => error !== 'Invalid email format!'));
        }//if


        
        if (errors.length > 0) {
            return;
        }

        const userData = {
            name: `${formData.first_name} ${formData.last_name}`,
            gender: formData.gender,
            email: formData.email,
            phone_number: formData.phone_number,
            password: formData.password
        };

        axios.post('http://localhost:3001/signup', userData)
            .then(response => {
               navigate('/Login');
            })
            .catch(error => {
                console.error("There was an error registering the user!", error);
                setErrors(prevErrors => [...prevErrors, 'Error submitting form. Please try again.']);
            });
    };

    useEffect(() => {
        setMessages(errors.map(error => error));
    }, [errors]);

    const handleCompanyToggle = () => {
        navigate('/CompanySignup'); 
    };

    return (

    <div className={styles.c_login_main + " " + styles.c_signup_main}>

    <div className={styles.left}>

      <header className={styles.header} style={{ justifyContent: 'center', position: 'absolute', top: 0, width: '100%', boxShadow: 'none' }} >
        <div className={styles.logo}>
          <img src={logo} alt="Logo" />
          <h3 style={{ marginTop: '2px' }} >LabourLink</h3>
        </div>
      </header>

      <div style={{ marginTop: '70px' }}>
        <div className={styles.toggle}>
          <h4 className={styles.active}>JobSeeker</h4>
          <h4 id="companyToggle" onClick={handleCompanyToggle}>Company</h4>
        </div>

        <div className={styles.text}>
          <h1>Create account.</h1>
          <h4> Already have an account?  <a className={styles.loginLink} href="Login">Log In</a> </h4>
        </div>

        <form onSubmit={handleSubmit} id="register-form">
        {/* <h2>JobSeeker Signup</h2> */}
          <div className={styles.nameFields}>
            <input type="text" placeholder="Full Name" name="first_name" className={styles.formInput} value={formData.first_name} onChange={handleChange} required  pattern="[a-zA-Z ]*"   title="Please enter only letters"  maxLength={25}/>
            <input  type="text" placeholder="Last Name" name="last_name" className={styles.formInput} value={formData.last_name}  onChange={handleChange} required  pattern="[a-zA-Z ]*"   title="Please enter only letters"  maxLength={25} />
          </div>

          <div className={styles.gender}>
            <div id={styles.gender_male}>
            <input  type="radio"  name="gender" value="male"  checked={formData.gender === 'male'}  onChange={handleChange} />
            <label>Male</label>
            </div>

            <div id={styles.gender_female}>
            <input  type="radio"  name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange}  />
            <label>Female </label>
            </div>
          </div>

          <input  type="text" className={styles.formInput} placeholder="Phone Number (03231234567)" id="phone-num"  name="phone_number"  value={formData.phone_number}  onChange={handlePhoneChange} required minLength={11} maxLength={11}  pattern="\d{11}" title="Please enter only 11 digits"/>
          <input type="email" className={styles.formInput} placeholder="E-mail" id="email" name="email" value={formData.email}  onChange={handleEmailChange} required maxLength={100} />
          <input type="password"className={styles.formInput}  placeholder="Password (Minimum 8 characters)" id="user-reg-pass" name="password" value={formData.password} onChange={handleChange}  required minLength={8} maxLength={100} />
          <input type="password"  className={styles.formInput}  placeholder="Confirm Password"   id="user-reg-c-pass"   name="confirm_password"   value={formData.confirm_password}   onChange={handleChange} maxLength={100}   required minLength={8} />

          <div className={styles.errorMessages}>
            {messages.map((errorMessage, index) => (
              <div key={index}>{errorMessage}</div>
            ))}
          </div>

          <input type="submit" className={styles.formSubmit} id="user-signup" value="Sign Up" />

        </form>
     

    </div>
    </div>

    <div className={styles.right}>
      <img src={login_image} alt="Signup Image" />
    </div>

  </div>
    );
};

export default Signup;
