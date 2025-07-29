import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyHeader from './CompnayHeader';
import Footer from './Footer';
import styles from './StyleA.module.css';
import icon from '../images/Icon.png';
import users from '../images/Users.png';
import CheckCircle from '../images/CheckCircle.png';
import CheckCircle2 from '../images/CheckCircle2.png';


function CHome2() {
    const [companyName, setCompanyName] = useState('');
    const [jobCount, setJobCount] = useState(0);
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const registrationNumber = localStorage.getItem('companyRegistrationNumber');
        if (registrationNumber) {
            axios.get(`http://localhost:3001/company-info/${registrationNumber}`)
                .then(response => {
                   setCompanyName(localStorage.getItem('companyName'));
                   // console.log(response.data.name);
                    setJobCount(response.data.jobCount);
                })
                .catch(error => {
                    console.error("Error fetching company info:", error);
                });

            axios.get(`http://localhost:3001/company-jobs/${registrationNumber}`)
                .then(response => {
                    setJobs(response.data);
                })
                .catch(error => {
                    console.error("Error fetching jobs:", error);
                });
        } else {
            console.log("No registration number found in local storage.");
        }
    }, []);



    const closeJob = (jobId) => {
        axios.post(`http://localhost:3001/close-job/${jobId}`)
            .then(response => {
                alert(response.data);
                setJobs(jobs.map(job => job.j_id === jobId ? { ...job, j_status: false } : job));
            })
            .catch(error => {
                console.error("Error closing job:", error);
            });
    };

    const handleViewApplicants = (jobId) => {
        // navigate(`/applicants/${jobId}`);
        // console.log(jobId);
        navigate('/applicants', {state : {jobId} });
    };

    if(!localStorage.getItem('companyRegistrationNumber')){
      return <h2 style={{textAlign:'center' , color:'red'}} >Unauthorized Access</h2>
  }

    return (
        <>
            <CompanyHeader/>

<div className={styles.c_home_main}>
      <h3>Hello, {companyName}</h3>
      <h5 style={{ fontWeight: 'normal', color: '#767F8C' }}>
        Here are your posted jobs and applications
      </h5>

      <div className={styles.jobbox}>
        <div>
          <h2>{jobCount}</h2>
          <h5 style={{ fontWeight: 'normal', color: '#767F8C' }}>Open Job{jobCount===0 || jobCount===1 ? '' : 's'}</h5>
        </div>
        <div style={{ display: 'flex' }}>
          <img src={icon} alt="Icon" />
        </div>
      </div>

      <div className={styles.jobsTable}>
        <h4>Recently Posted Jobs</h4>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div className={styles.tableCell}>Jobs</div>
            <div className={styles.tableCell}>Status</div>
            <div className={styles.tableCell}>Applications</div>
            <div className={styles.tableCell}>Actions</div>
          </div>
          
          {jobs.map(job => (
            <div className={styles.tableRow} key={job.j_id}>
              <div className={styles.tableCell}>{job.job_title}</div>
              <div className={styles.tableCell}>
                <img className={styles.avatar} src={job.j_status ? CheckCircle : CheckCircle2 } alt="Status" />
                <span style={{ color: job.j_status ? '#0BA02C' : '#B34141' }}>
                  {job.j_status ? 'Active' : 'Closed'}
                </span>
              </div>
              <div className={styles.tableCell}>
                <img className={styles.avatar} src={users} alt="Applicants" />
                <span>{job.applicantCount} {job.applicantCount===1 || job.applicantCount===0 ? 'Application' : 'Applications'}</span>
              </div>
              <div className={`${styles.tableCell} ${styles.actions}`}>
                <button className={styles.button} onClick={() => handleViewApplicants(job.j_id)}>
                  View Applications
                </button>
                {job.j_status ? (
                  <button className={styles.button} onClick={() => closeJob(job.j_id)} style={{ color: '#B34141' }}>
                    Close Job
                  </button>
                ) : (
                  <button className={styles.button} style={{ color: '#fff', background: '#A7ADB4' }} disabled>
                    Closed
                  </button>
                )}
              </div>
            </div>
          ))}
          
        </div>
      </div>
    </div>
            <Footer/>
        </>
    );
}

export default CHome2;