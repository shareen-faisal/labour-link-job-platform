import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './styleApplicantList.module.css';
import CompanyHeader from './CompnayHeader';
import logo2 from '../images/logo2.png';
import SocialMedia from '../images/SocialMedia.png';
import maleAvatar from '../images/av1.png';
import femaleAvatar from '../images/av2.png';
import career from '../images/career.png';
import graduation from '../images/graduation-cap.png';
import genderImg from '../images/gender.png';
import cake from '../images/cake.png';
import document from '../images/document.png';
import phone from '../images/phone-call.png';
import mail from '../images/mail.png';
import match from  '../images/match.png';
import Footer from './Footer'
import { useLocation } from 'react-router-dom';

const ApplicantsList = () => {
    // const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedApplicant, setSelectedApplicant] = useState(null);   
    const [selectedProof, setSelectedProof] = useState('');
    const [selectedATSScore, setSelectedATSScore] = useState('');  
    const location = useLocation();
    const { jobId } = location.state || {}; 
    console.log(jobId);

    useEffect(() => {
        const fetchApplicants = () => {
            setLoading(true);
            axios.get(`http://localhost:3001/job-applicants/${jobId}`)
                .then(response => {
                    setApplicants(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    setError('Error fetching applicants.');
                    setLoading(false);
                });
        };

        fetchApplicants();
    }, [jobId]);

    const handleViewClick = (applicant) => {
        setSelectedApplicant(applicant);
    };

    const handleCloseDialog = () => {
        setSelectedApplicant(null);
    };

    const handleAcceptReject = (applicantId) => {
        axios.post(`http://localhost:3001/update-applicant-status`, { applicantId,  jobId})
            .then(response => {
                setApplicants(prevState => prevState.map(applicant => 
                    applicant.app_id === applicantId ? { ...applicant, app_status: 1 } : applicant
                ));
                setSelectedApplicant(null);
            })
            .catch(error => {
                console.error('Error updating applicant status:', error);
            });
    };

    const handleFilterApplications = () => {
        axios.get(`http://localhost:3001/filter-applicants`, {
            params: {
                jobId: jobId,
                atsScore: selectedATSScore,
                proofs: selectedProof
            }
        })
        .then(response => {
            setApplicants(response.data);
        })
        .catch(error => {
            console.error('Error filtering applications:', error);
            setError('Error filtering applications.');
        });
    };

    if(!localStorage.getItem('companyRegistrationNumber')){
        return <h2 style={{textAlign:'center' , color:'red'}} >Unauthorized Access</h2>
    }

    return (
        <div className={styles.bodyapp}>
            <CompanyHeader/>
            <div className={styles.filterSection}>
                <div className={styles.filterOptions}>
                <select value={selectedProof} onChange={(e) => setSelectedProof(e.target.value)}>
                        <option value="">All Proofs</option>
                        <option value="2">2 Proofs +</option>
                        <option value="5">5 Proofs +</option>
                        <option value="10">10 Proofs +</option>
                    </select>
                </div>

                <div className={styles.filterOptions}>
                <select value={selectedATSScore} onChange={(e) => setSelectedATSScore(e.target.value)}>
                        <option value="">All ATS Scores</option>
                        <option value="80">80% and above</option>
                        <option value="60">60% and above</option>
                        <option value="40">40% and above</option>
                    </select>
                    <button onClick={handleFilterApplications} className={styles.filterBtn}> Filter Applications</button>
                </div>
                
            </div>
            {loading ? (

                <p>Loading...</p>

            ) : error ? (

                <p>{error}</p>

            ) : applicants.length===0 ?  (

                <p style={{ textAlign: 'center', padding: '20px', height: '36vh' }}>No applicants available.</p>

                ) :(    
                    <div className={styles.applications} style={{minHeight:'36vh'}}>
                    {applicants.map(applicant => (
                        <div className={styles.application} key={applicant.app_id}>
                             {applicant.app_gender === 'Male' && (
                            <img src={maleAvatar} alt="Applicant" id={styles.AhmadImg} />
                        )}

                        {applicant.app_gender === 'Female' && (
                            <img src={femaleAvatar} alt="Applicant" id={styles.AhmadImg} />
                        )}
                            <div className={styles.applicationInfo}>
                                <h3>{applicant.app_name}</h3>
                                <span className={styles.proofs}>Proofs: {applicant.proofCount}</span>
                                <p className={styles.matchText} style= {{color: 'rgb(181, 173, 173)'}}>
                                <img src={match} alt="Match Icon" width="2" height="2"/>
                                    {applicant.ats_score}% Matches Your Description
                                </p>
                            </div>
                            {applicant.app_status === 0 ? (
                                <button className={styles.viewBtn} onClick={() => handleViewClick(applicant)}>View</button>
                            ) : (
                                <button className={styles.acceptedBtn} disabled>Accepted</button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            
{selectedApplicant && (
    <div className={styles.shadow} id="shadow">
        <div className={styles.message}>
            <div className={styles.box}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', justifyContent: 'space-between' }}>
                    <div style={{display: 'flex' , alignItems: 'center'}}>
                        {selectedApplicant.app_gender === 'Male' && (
                            <img src={maleAvatar} alt="Applicant" id={styles.AhmadImg} />
                        )}

                        {selectedApplicant.app_gender === 'Female' && (
                            <img src={femaleAvatar} alt="Applicant" id={styles.AhmadImg} />
                        )}
                        <h3 id={styles.h}>{selectedApplicant.app_name}</h3>
                    </div>
                    {selectedApplicant.app_status === 0 && (
                         <button id={styles.acceptbutton} onClick={() => handleAcceptReject(selectedApplicant.app_id)}>Accept Application</button>
                    )}
                </div>
                <button className={styles.closeBtn} id={styles.closeBtn} onClick={handleCloseDialog} >&times;</button>

                <div style={{display: 'flex', gap: '40px' , padding: '30px 20px'}}>
                    <div>
                        <div className={styles.container}>
                            <div>
                                <div className={styles.card}>
                                    <div className={styles.icon}>
                                        <img src={career} alt="Experience Icon" />
                                    </div>
                                    <div className={styles.label}>EXPERIENCE</div>
                                    <div className={styles.value}>{selectedApplicant.app_experience}</div>
                                </div>
                                <div className={styles.card}>
                                    <div className={styles.icon}>
                                        <img src={graduation} alt="Education Icon" />
                                    </div>
                                    <div className={styles.label}>EDUCATION</div>
                                    <div className={styles.value}>{selectedApplicant.app_education}</div>
                                </div>
                            </div>
                            <div>
                                <div className={styles.card}>
                                    <div className={styles.icon}>
                                        <img src={genderImg} alt="Gender Icon" />
                                    </div>
                                    <div className={styles.label}>GENDER</div>
                                    <div className={styles.value}>{selectedApplicant.app_gender}</div>
                                </div>
                                <div className={styles.card}>
                                    <div className={styles.icon}>
                                        <img src={cake} alt="Age Icon" />
                                    </div>
                                    <div className={styles.label}>AGE</div>
                                    <div className={styles.value}>{selectedApplicant.app_age}</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.downloadCertificates}>
                            <h4><b>Download My Resume</b></h4>
                            <img src={document} alt='Resume' id={styles.doc} />
                            <p> 
                                Resume: <a href={`http://localhost:3001/${selectedApplicant.app_resume}`} target="_blank" rel="noopener noreferrer">Download Resume</a>
                             </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div className={styles.contactCard} style={{marginBottom: '30px'}}>  
                            <h2>Contact Information</h2>
                            <div className={styles.contactItem}>
                                <div className={styles.icon}>
                                    <img src={phone} alt="Phone Icon" />
                                </div>
                                <div className={styles.details}>
                                    <div className={styles.label}>PHONE</div>
                                    <div className={styles.value}>{selectedApplicant.app_phoneNo}</div>
                                </div>
                            </div>
                            <div className={styles.contactItem}>
                                <div className={styles.icon}>
                                    <img src={mail} alt="Email Address" />
                                </div>
                                <div className={styles.details}>
                                    <div className={styles.label}>EMAIL ADDRESS</div>
                                    <div className={styles.value}>{selectedApplicant.app_email}</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.downloadCertificates2}>
                            <h4><b>Download My Proof/s</b></h4>
                            <img src={document} alt='Proofs' id={styles.doc} />
                            <ul>
                            {selectedApplicant.proofs && selectedApplicant.proofs.split(',').map((proof, index) => (
                                <li key={index}><a href={`http://localhost:3001/${proof}`} target="_blank" rel="noopener noreferrer">View Proof {index + 1}</a></li>
                            ))}
                        </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)}


{/* <footer className={styles.footer}>
        <div className={styles.footer_left}>
            <div className={styles.logo}>
                <img src={logo2} alt="Logo" />
                <h3 style={{ color: '#fff', marginTop: '2px' }}>LabourLink</h3>
            </div>
            <div className={styles.footer_contact}>
                <p style={{ marginBottom: '10px', fontWeight: 'normal' }}>
                    Call now: <span style={{ color: '#fff', fontWeight: 'normal' }}>(319) 555-0115</span>
                </p>
                <p style={{ fontWeight: 'normal' }}>
                    6391 Elgin St. Celina, Delaware 10299, New<br /> York, United States of America
                </p>
            </div>
            <hr className={styles.footer_separator} />
            <div className={styles.copyright}>
                <span style={{ fontWeight: 'normal' }}>
                    @ 2024 LabourLink - Job Portal. All rights reserved.
                </span>
                <img src={SocialMedia} alt="Social Media" />
            </div>
        </div>
    </footer> */}

    <Footer/>
                           
        </div>
    );
};

export default ApplicantsList;
