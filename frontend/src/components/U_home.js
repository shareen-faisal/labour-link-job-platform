import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import styles from './styleU_home.module.css';
import Header from './Header';
import Footer from './Footer';
import Illustration from '../images/Illustration.png';
import Iconbox from '../images/Iconbox.png';
import Iconbox2 from '../images/Iconbox2.png';
import Iconbox3 from '../images/Iconbox3.png';

const U_home = () => {

    const navigate = useNavigate();
    const [liveJobs, setLiveJobs] = useState('');
    const [liveCompanies, setLiveCompanies] = useState('');
    const [liveUsers, setLiveUsers] = useState('');

  const [categories, setCategories] = useState([
    { name: 'Salesperson', openJobs: 0 },
    { name: 'Receptionist', openJobs: 0 },
    { name: 'Watchman',  openJobs: 0 },
    { name: 'Call Operator', openJobs: 0 }
  ]);


  useEffect(() => {
    const fetchJobCounts = () => {
      axios.get('http://localhost:3001/open-job-counts')
        .then((response) => {
            const updatedCategories = categories.map(category => {
            const matchingCategory = response.data.find( (item) => {return item.category === category.name} )
            return matchingCategory ? { ...category, openJobs: matchingCategory.count } : category;
          });
          setCategories(updatedCategories);
        })
        .catch((error) => {
          console.error('There was an error fetching the job counts', error);
        });
    };
    fetchJobCounts();
  }, []);


  const handleCategoryClick = (categoryName) => {
    localStorage.setItem('categoryName', categoryName);
    navigate(`/HomePage2/${categoryName}`);
  };

  useEffect(() =>{
    axios.get('http://localhost:3001/live-homepage-users')
    .then(response =>{
       setLiveUsers(response.data.liveUsers);
    })
    .catch(error => {
      console.error('There was an error fetching the live homepage data', error);
    })

  },
  
  []);
  
  useEffect(() =>{
  
    axios.get('http://localhost:3001/live-homepage-companies')
    .then(response =>{
      setLiveCompanies(response.data.liveCompanies);
      
    })
    .catch(error => {
      console.error('There was an error fetching the live homepage data', error);
    })

  },
  
  []);

  useEffect(() =>{
    axios.get('http://localhost:3001/live-homepage-jobs')
    .then(response =>{
       setLiveJobs(response.data.liveJobs);
 
    })
    .catch(error => {
      console.error('There was an error fetching the live homepage data', error);
    })

  },
  
  []);





  if(!localStorage.getItem('js_id')){
    return <h2 style={{textAlign:'center' , color:'red'}}>Unauthorized Access</h2>
  }

  return (
  <div>
  <Header />

  <div className={styles.u_home_main}>
  <div className={styles.row1}>
    <div className={styles.box1} style={{ marginTop: '40px' }}>
      <h1>Find a job that suits<br /> your interest & skills.</h1>
      <p>We provide the best non-technical jobs in cities and companies<br />
        of Pakistan. Be ready for your next job.</p>
    </div>

    <div className={styles.box2}>
      <img src={Illustration} alt="Illustration" />
    </div>
  </div>

  <div className={styles.row2}>
    <div className={styles.dis1}>
      <img src={Iconbox} alt="Iconbox" />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '6px 0' }}>
        <h3 style={{ fontWeight: 500 }}>{ liveJobs}</h3>
        <h5>Live Job{liveJobs === 1 || liveJobs === 0 ? '' : 's' }</h5>
      </div>
    </div>

    <div className={styles.dis1}>
      <img src={Iconbox2} alt="Iconbox" />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '6px 0' }}>
        <h3 style={{ fontWeight: 500 }}> {liveCompanies} </h3>
        <h5>{liveCompanies === 1 || liveCompanies === 0 ? 'Company' : 'Companies'}</h5>
      </div>
    </div>

    <div className={styles.dis1}>
      <img src={Iconbox3} alt="Iconbox" />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '6px 0' }}>
        <h3 style={{ fontWeight: 500 }}>{liveUsers}</h3>
        <h5>Candidate{liveUsers === 1 || liveUsers === 0 ? '' : 's'}</h5>
      </div>
    </div>
  </div>
</div>

<div className={styles.u_home_main_categories}>
  <h1>Categories</h1>
  <div className={styles.categoryRow1}>
    {categories.map((category, index) => (
      // id={styles.job-category}
      <div key={index} className={styles.cat1}  onClick={() => handleCategoryClick(category.name)}>
        <img src={Iconbox3} alt={category.name} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '6px 0', gap: '5px' }}>
          <h3 style={{ fontWeight: 500 }}>{category.name}</h3>
          <h5>Open position{category.openJobs === 1 || category.openJobs === 0 ? '' : 's'} {category.openJobs}</h5>
        </div>
      </div>
    ))}
  </div>
</div>

<Footer />
</div>
           
  );
};

export default U_home;
