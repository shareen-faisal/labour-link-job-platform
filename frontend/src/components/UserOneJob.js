import axios from 'axios';
import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import styles from './styleHomePage2.module.css';
import Header from './Header';
import Footer from './Footer';
import { format } from 'date-fns';
import icon from '../images/Icon-verify-pop-up.svg';
import calender from '../images/CalendarBlank.svg';
import brief from '../images/briefcase.svg';
import wallet from '../images/Wallet.svg';
import map from '../images/MapPinLine.svg';

const UserOneJob = () => {
 
 const location = useLocation();
 const{ jobId} = location.state || {};
 // const { jobId } = useParams();
  const js_id = localStorage.getItem('js_id');
  const MAX_PROOFS = 10;
 
  
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [skills, setSkills] = useState([]);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [hasApplied, setHasApplied] = useState(false);
  const [proofsExceedLimit, setProofsExceedLimit] = useState(false);

  //for applicants
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [gender, setGender] = useState('');
  const [resume, setResume] = useState(null);
  const [proofs, setProofs] = useState([]);

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [showAUSpopup, setShowAUSpopup] = useState(false);



  useEffect(() => {
    axios.get(`http://localhost:3001/one-job/${jobId}`)
      .then(response => {
        console.log('Job data:', response.data); 
        setJob(response.data);
      })
      .catch(error => {
        console.error('Error fetching job details:', error);
        setError('Failed to fetch job details. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [jobId]);

  useEffect(() => {
    if (job && job.j_id) {
      axios.get(`http://localhost:3001/one-job/${job.j_id}/skills`)
        .then(response => {
          setSkills(response.data);
        })
        .catch(error => {
          console.error('Error fetching job skills:', error);
        });
    }
  }, [job]);

  useEffect(() => {
    if (job && job.j_id) {
      axios.get(`http://localhost:3001/one-job/${job.j_id}/days`)
        .then(response => {
          setDays(response.data);
        })
        .catch(error => {
          console.error('Error fetching job days:', error);
        });
    }
  }, [job]);

  useEffect(() => {
    if (js_id && jobId) {
      axios.get(`http://localhost:3001/user-has-applied/${jobId}/${js_id}`)
        .then(response => {
          setHasApplied(response.data.hasApplied);
        })
        .catch(error => {
          console.error('Error checking application status:', error);
        });
    }
  }, [js_id, jobId]);

  const handleApplyForm = () => {
      setShowApplyForm(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MM/dd/yyyy');
};

  const handleConfirmApply = (event) => {
    event.preventDefault();
    if (proofsExceedLimit) {
      alert(`You cannot submit the form as the number of proofs exceeds the limit of ${MAX_PROOFS}.`);
      return;
    }
    console.log('Handle Confirm Apply');
    setShowApplyForm(false);
    setShowAUSpopup(true);
  };

  const confirmSubmit = () => {
    console.log('Confirm Submit');
    setShowAUSpopup(false);

    //const registrationNumber = localStorage.getItem('companyRegistrationNumber');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('gender', gender);
    formData.append('email', email);
    formData.append('phoneNo', phoneNo);
    formData.append('age', age);
    formData.append('education', education);
    formData.append('experience', experience);
    formData.append('j_id', jobId);
    //formData.append('c_registrationNo', registrationNumber);
    formData.append('js_id', js_id);

    if (resume) formData.append('resume', resume);
    for (let i = 0; i < proofs.length; i++) {
      formData.append('proofs', proofs[i]);
    }

    axios.post('http://localhost:3001/user-apply-job', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
        console.log(response.data);
        setShowApplyForm(false);
        setHasApplied(true);
      })
      .catch(error => {
        console.error('There was an error submitting the application!', error);
      });
  };

  const cancelSubmit = () => {
    setShowAUSpopup(false);
    setShowApplyForm(true);
  };

  const cancelSubmit2 = () => {
    setShowApplyForm(false);
  };

  const handleProofsChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > MAX_PROOFS) {
      alert(`You can only upload a maximum of ${MAX_PROOFS} files.`);
      setProofsExceedLimit(true);
      return;
    }
    setProofs(files);
    setProofsExceedLimit(false);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    const newValue = value.replace(/[0-9]/g, '');
    setName(newValue);
  };





  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!job) {
    return <div>No job details available.</div>;
  }

  if(!localStorage.getItem('js_id')){
    return <h2 style={{textAlign:'center' , color:'red'}}>Unauthorized Access</h2>
  }


return (
  <div>
      <Header />
    <div id={styles.uOneJobContent}>
      <div id={styles.job_head}>
      <img src={`http://localhost:3001/uploads/${job.logo}`} alt={job.company_name} id={styles.job_head_img} />
        <div id={styles.job_subhead}>
          <h3 id={styles.j_h_h3}>{job.job_title || 'N/A'}</h3>
          <h4 id={styles.j_h_h4}>{job.name || 'N/A'}</h4>
        </div>
        <button className={styles.applyNow2} id={styles.applyNowBut} onClick={handleApplyForm}  disabled={hasApplied} >
        {hasApplied ? 'Applied' : 'Apply Now'}
        </button>
      </div>

      <div className={styles.job_descrip}>
        <h3>Job Description</h3>
        <p id={styles.job_des_p}>{job.job_description || 'N/A'}</p>
      </div>

      <div className={styles.job_overview_container}>
        <h3 id={styles.job_overview}>Job Overview</h3>

        <div id={styles.job_overview_r1}>
          <div className={styles.jo_row}>
            <div className={styles.jo_icon}><img className={styles.jo_icon_img} src={calender} alt="Calendar Icon" /></div>
            <div className={styles.jo_info}>
              <p className={styles.row_title}>JOB POSTED:</p>
              <p className={styles.row_title_para}>{formatDate(job.j_date ) || 'N/A'}</p>
            </div>
          </div>
          <div className={styles.jo_row}>
            <div className={styles.jo_icon}><img className={styles.jo_icon_img} src={brief} alt="Briefcase Icon" /></div>
            <div className={styles.jo_info}>
              <p className={styles.row_title}>EDUCATION</p>
              <p className={styles.row_title_para}>{job.education || 'N/A'}</p>
            </div>
          </div>
          <div className={styles.jo_row}>
            <div className={styles.jo_icon}><img className={styles.jo_icon_img} src={wallet} alt="Wallet Icon" /></div>
            <div className={styles.jo_info}>
              <p className={styles.row_title}>SALARY:</p>
              <p className={styles.row_title_para}>
                {job.min_salary && job.max_salary
                  ? `Rs ${job.min_salary} - Rs ${job.max_salary}`
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div id={styles.job_overview_r2}>
          <div className={styles.jo_row}>
            <div className={styles.jo_icon}><img className={styles.jo_icon_img} src={map} alt="Map Pin Icon" /></div>
            <div className={styles.jo_info}>
              <p className={styles.row_title}>LOCATION:</p>
              <p className={styles.row_title_para}>{job.job_city || 'N/A'}</p>
            </div>
          </div>
          <div className={styles.jo_row}>
            <div className={styles.jo_icon}><img className={styles.jo_icon_img} src={brief} alt="Briefcase Icon" /></div>
            <div className={styles.jo_info}>
              <p className={styles.row_title}>EXPERIENCE</p>
              <p className={styles.row_title_para}>{job.experience || 'N/A'}</p>
            </div>
          </div>
          <div className={styles.jo_row}>
            <div className={styles.jo_icon}><img className={styles.jo_icon_img} src={brief} alt="Briefcase Icon" /></div>
              <div className={styles.jo_info}>
              <p className={styles.row_title}>VACANCIES:</p>
              <p className={styles.row_title_para}>{job.vacancies || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div id={styles.job_overview_r3}>
          <div className={styles.jo_row}>
            <div className={styles.jo_icon}><img className={styles.jo_icon_img} src={calender} alt="Calendar Icon" /></div>
            <div className={styles.jo_info}>
              <p className={styles.row_title}>AGE:</p>
              <p className={styles.row_title_para}>{job.age || 'N/A'}</p>
            </div>
          </div>
          <div className={styles.jo_row}>
            <div className={styles.jo_icon}><img className={styles.jo_icon_img} src={brief} alt="Briefcase Icon" /></div>
            <div className={styles.jo_info}>
              <p className={styles.row_title}>GENDER:</p>
              <p className={styles.row_title_para}>{job.preferred_gender || 'N/A'}</p>
            </div>
          </div>
          <div className={styles.jo_row}>
            <div className={styles.jo_icon}><img className={styles.jo_icon_img} src={calender} alt="Calendar Icon" /></div>
            <div className={styles.jo_info}>
              <p className={styles.row_title}>HOURS:</p>
              <p className={styles.row_title_para}>{job.job_hours || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className={styles.jo_row}>
          <div className={styles.jo_icon}><img className={styles.jo_icon_img} src={calender} alt="Calendar Icon" /></div>
          <div className={styles.jo_info}>
            <p className={styles.row_title}>DAYS:</p>
            <div className={styles.jo_days}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={index} className={styles.jo_day + (days.includes(day) ? " " + styles.jo_day_active: "" )}>{day}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.job_descrip} id={styles.job_descrip_skills}>
        <h3>Skills</h3>
        <ul id={styles.skills_ul}>
          {skills.length > 0
            ? skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))
            : 'No skills listed.'}
        </ul>
      </div>
    </div>

    {showApplyForm && ( 
                      <div id={styles.outerFormContainer}>
                      <div className={styles.formcontainer} id={styles.formContainer}>
                        <h2 className={styles.formtitle}>Application Form</h2>
                        <form onSubmit={handleConfirmApply} >
                          <div id={styles.leftside}>
                            <div className={styles.formgroup}>
                              <label htmlFor="name" className={styles.formlabel}>Name</label>
                              <input type="text" placeholder='First Name and Last Name' className={styles.forminput} name="name" value={name} onChange={handleNameChange} required maxLength={50}  />
                            </div>
              
                            <div className={styles.formgroup}>
                              <label htmlFor="phoneNumber" className={styles.formlabel}>Phone Number</label>
                              <input type="text" id={styles.phoneNumber} placeholder='03231234567' name="phoneNumber"  className={styles.forminput} value={phoneNo} onChange={(e) => setPhone(e.target.value)} required maxLength={11} minLength={11} pattern="\d*" title="Please enter only digits" />
                            </div>

                            <div className={styles.formgroup}>
                              <label htmlFor="education" className={styles.formlabel}>Education</label>
                              <select id={styles.education} name="education" className={styles.forminput3} value={education} onChange={(e) => setEducation(e.target.value)} required  >
                                <option value="" disabled>Select your education level</option>
                                <option value="Matric">Matric</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Under Graduatation">Under Graduatation</option>
                                <option value="Post Graduatation">Post Graduatation</option>
                              </select>
                            </div>
                                          
                            <div className={styles.formgroup}>
                              <label htmlFor="age" className={styles.formlabel}>Age</label>
                              <input type="number" id={styles.age} name="age" placeholder='Age' className={styles.forminput} value={age} onChange={(e) => setAge(e.target.value)} required min="18" max="99"/>
                            </div>
              
                            <div className={styles.formgroupuploadfile}>
                              <label htmlFor="resume" className={styles.filelabel}>Upload resume (PDF Format)</label>
                              <br />
                              <input type="file"  id={styles.resume} name="resume"className={styles.fileinput} accept=".pdf" onChange={(e) => setResume(e.target.files[0])} required/>
                            </div>
                          </div>
              
                          <div id={styles.otherside}>
                            <div className={styles.formgroup2}>
                              <label htmlFor="email" className={styles.formlabel}>Email</label>
                              <input type="email" id={styles.email} placeholder='abc@example.com' name="email" className={styles.forminput} value={email} onChange={(e) => setEmail(e.target.value)} maxLength={100} required/>
                            </div>
              
                            <div className={styles.formgroup2}>
                              <label className={styles.formlabel}>Gender</label>
                              <input type="radio" name="gender" value="male" className={styles.radio} onChange={(e) => setGender(e.target.value)} required  />
                              <label htmlFor="gender" className={styles.radioinput}>Male</label>
                              <input type="radio" name="gender" value="female" className={styles.radio} onChange={(e) => setGender(e.target.value)} required />
                              <label htmlFor="gender" className={styles.radioinput}>Female</label>
                            </div>

                            <div className={styles.formgroup2}>
                              <label htmlFor="experience" className={styles.formlabel}>Experience</label>
                              <select id={styles.experience} name="experience" className={styles.forminput3} value={experience} onChange={(e) => setExperience(e.target.value)} required >
                                <option value="" disabled>Select your experience level</option>
                                <option value="0-1 years">0-1 years</option>
                                <option value="2-4 years">2-4 years</option>
                                <option value="5-7 years">5-7 years</option>
                                <option value="8-10 years">8-10 years</option>
                                <option value="10+ years">10+ years</option>
                              </select>
                            </div>
              
                            <div className={styles.formgroupuploadfile2}>
                              <label htmlFor="proofupload" className={styles.filelabel}>Upload any proof (optional) up to {MAX_PROOFS} files: (PDF Format)</label>
                              <br />
                              <input type="file" id={styles.proofupload} name="proofupload" className={styles.fileinput} accept=".pdf" multiple  onChange={handleProofsChange}   />
                            </div>
                          </div>
              
                          <button type="submit" id={styles.formbutton}>Submit</button>
                        </form>
                        <button className="closebutton" id={styles.close_btn_verify} onClick={cancelSubmit2}>&times;</button>
                      </div>
                    </div>

    )}



    

    {showAUSpopup && (
            <div className={styles.admin_popup_container}>
            <div className={styles.admin_popup}>
              <img src={icon} alt="Verify" className="admin-popup-icon" />
              <div className={styles.admin_popup_info}>
                <h2>Submit Application</h2>
                <pre>Are you sure you want to submit application for this job?</pre>
              </div>
              <button className={styles.yes_btn} onClick={confirmSubmit} >Yes, Confirm</button>
              <button className={styles.close_btn} onClick={cancelSubmit}> &times; </button>
            </div>
          </div>
      
    )}

<Footer />
</div>


    
)

}

export default UserOneJob;
