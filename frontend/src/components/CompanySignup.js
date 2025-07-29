import axios from 'axios';
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StyleA.module.css';
import logo from '../images/logo.png';
import login_image from '../images/login_image.png';


const CompanySignup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirm_password: '',
        registration_number: '',
        logo: ''
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [messages, setMessages] = useState([]);

    const handleEmailChange = e => {
        setFormData({ ...formData, email: e.target.value });
        checkEmail(e.target.value);
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handlePhoneChange = e => {
        setFormData({ ...formData, phoneNumber: e.target.value });
        checkPhone(e.target.value);
    };

    const handleRegistration_numberChange = e => {
        setFormData({ ...formData, registration_number: e.target.value });
        checkRegistration_number(e.target.value);
    };

    const handleNameChange = e => {
        setFormData({ ...formData, name: e.target.value });
        checkName(e.target.value);
    };

    const checkEmail = email => {
        axios.post('http://localhost:3001/check-company-email', { email })
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

    const checkPhone = phoneNumber => {
        axios.post('http://localhost:3001/check-company-phone', { phoneNumber })
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

    const checkRegistration_number = registration_number => {
        axios.post('http://localhost:3001/check-company-regNo', { registration_number })
            .then(response => {
                if (response.data.exists) {
                    setErrors(prevErrors => [...prevErrors, 'Registration number already exists!']);
                } else {
                    setErrors(prevErrors => prevErrors.filter(error => error !== 'Registration number already exists!'));
                }
            })
            .catch(error => {
                console.error("There was an error checking the registration number!", error);
            });
    };

    const checkName = name => {
        axios.post('http://localhost:3001/check-company-name', { name })
            .then(response => {
                if (response.data.exists) {
                    setErrors(prevErrors => [...prevErrors, 'Name already exists!']);
                } else {
                    setErrors(prevErrors => prevErrors.filter(error => error !== 'Name already exists!'));
                }
            })
            .catch(error => {
                console.error("There was an error checking the company name!", error);
            });
    };

    const handleChange = e => {
        if (e.target.name === 'logo') {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = e => {
        e.preventDefault();

        if (formData.password !== formData.confirm_password) {
            setErrors(prevErrors => [...prevErrors, 'Passwords do not match!']);
            return;
        } else {
          setErrors(prevErrors => prevErrors.filter(error => error !== 'Passwords do not match!'));
        }

        if (!emailRegex.test(formData.email)) {
                    setErrors(prevErrors => [...prevErrors, 'Invalid email format!']);
                    return;
            } else {
                    setErrors(prevErrors => prevErrors.filter(error => error !== 'Invalid email format!'));
        }

        if (errors.length > 0) {
            return;
        }

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        axios.post('http://localhost:3001/company-signup', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                navigate(`/CompanyLogin`);
            })
            .catch(error => {
                console.error("There was an error registering the company!", error);
                setErrors(prevErrors => [...prevErrors, 'Error submitting form. Please try again.']);
            });
    };

    useEffect(() => {
        setMessages(errors);
    }, [errors]);

    const handleJobSeekerToggle = () => {
        navigate('/SignUp'); 
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
                        <h1>Create account.</h1>
                        <h4>Already have an account? <a style={{ color: '#0A65CC', cursor: 'pointer', fontWeight: '600', textDecoration: 'none' }} href="CompanyLogin">Log In</a></h4>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* <h2>Company Signup</h2> */}
                        <input type="text" name="name" placeholder="Company Name" value={formData.name} onChange={handleNameChange} required  maxLength={100}/>
                        <input type="text" name="registration_number" placeholder="Registration Number (Maximum 7 digits)" value={formData.registration_number} onChange={handleRegistration_numberChange} required maxLength={7} minLength={7} pattern="\d*" title="Please enter only digits" />
                        <input type="text" name="phoneNumber" placeholder="Phone Number (03231234567)" value={formData.phoneNumber} onChange={handlePhoneChange} required maxLength={11} minLength={11} pattern="\d*" title="Please enter only digits" />
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleEmailChange} required maxLength={100} />
                        <input type="password" name="password" placeholder="Password (Minimun 8 characters)" value={formData.password} onChange={handleChange} required maxLength={50} minLength={8}  />
                        <input type="password" name="confirm_password" placeholder="Confirm Password" value={formData.confirm_password} onChange={handleChange} required maxLength={50}  minLength={8}/>
                        <label htmlFor='fileInput'>Choose company logo</label>
                        <input type="file" name="logo" id={styles.fileInput} accept="image/*" onChange={handleChange} required />
                        <div className={styles['error-messages']}>
                            {messages.map((errorMessage, index) => (
                                <div key={index} style={{ color: 'red' }}>
                                    {errorMessage}
                                </div>
                            ))}
                        </div>
                        <button type="submit">Signup</button>
                    </form>
                </div>
            </div>
            <div className={styles.right}>
                <img src={login_image} alt="Company Signup" />
            </div>
        </div>
    );
};

export default CompanySignup;