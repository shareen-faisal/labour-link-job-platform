import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminDashboard.module.css';
import icon from '../images/Icon-verify-pop-up.svg';
import pageTitle from '../images/pageTitle.svg';
import iconDelete from '../images/Icon-delete-pop-up.svg';
import adminSidebar from '../images/adminSidebar.svg';
import { format } from 'date-fns';

const Dashboard = () =>{
    const [company,setCompany] = useState([]);

    const fetch = () =>{
        axios.get('http://localhost:3001/AdminDashboard')
        .then(response => {
            setCompany(response.data);
        })

        .catch(error => {
            console.log(error);
        })
    }

    useEffect(() => {
            fetch();
    },[company])
   

    
    return(
        <div></div>
    );
}

export default Dashboard;