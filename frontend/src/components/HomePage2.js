import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './styleHomePage2.module.css';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';



const HomePage2 = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    jobTitle: '',
    city: '',
    salary: ''
  });

  const navigate = useNavigate();
  const { categoryName } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3001/show-user-jobs', { params: { category: categoryName } })
      .then(response => {
        setJobs(response.data);
        setFilteredJobs(response.data);
        setLoading(false);
     
      })
      .catch(error => {
        setError('Error fetching jobs. Please try again later.');
        setLoading(false);
      });
  }, [categoryName]);

  // const handleFilterChange = (e) => {
  //   setFilters({ ...filters, [e.target.name]: e.target.value });
  // };



  const handleSearch = () => {
    const filtered = jobs.filter(job => 
      (!filters.jobTitle || job.job_title.toLowerCase().includes(filters.jobTitle.toLowerCase())) &&
      (!filters.city || job.job_city.toLowerCase().includes(filters.city.toLowerCase())) &&
      (!filters.salary || ((parseInt(filters.salary) >= parseInt(job.min_salary) ) &&  (parseInt(filters.salary) <= parseInt(job.max_salary) ) ) || parseInt(job.min_salary) === parseInt(filters.salary) ||  
      parseInt(job.max_salary) === parseInt(filters.salary))
      
    );
    setFilteredJobs(filtered);
  };

  const handleApplyClick = (jobId) => {
    //navigate(`/UserOneJob/${jobId}`);
    navigate('/UserOneJob',{ state:  {jobId}  });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === 'city' || name === 'jobTitle') {
      const newValue = value.replace(/[^a-zA-Z\s]/g, '');
      setFilters({ ...filters, [name]: newValue });
    } else {
      setFilters({ ...filters, [name]: value });
}
};



  if(!localStorage.getItem('js_id')){
    return <h2 style={{textAlign:'center' , color:'red'}}>Unauthorized Access</h2>
  }

  return (

    <div className={styles.job_listings_container}>
      <Header />
      <div id={styles.d1}>
        <input type="text"name="jobTitle" value={filters.jobTitle} placeholder="Job Title" maxLength={100} className={styles.filter1}  onChange={handleFilterChange} />
        <input type="text" name="city" value={filters.city} placeholder="City" maxLength={10} className={styles.filter}   onChange={handleFilterChange}/>
        <input type="number" name="salary" value={filters.salary} placeholder="Salary"  className={styles.filter} onChange={handleFilterChange}/>
        <input type="button"  value="Search" id={styles.searchbutton} style={{cursor:'pointer'}} onClick={handleSearch}/>
      </div>

        {loading ? (
          <p>Loading...</p>
          
        ) : error ? (
          <p className={styles.error_message}>{error}</p>
        ) : (
          <div className={styles.job_listings}>
            {filteredJobs.length === 0 ? (
              <p id={styles.job_p}>No jobs available.</p>
            ) : ( filteredJobs.map(job => (
              <div key={job.j_id} className={styles.job}>
                <img src={`http://localhost:3001/uploads/${job.company_logo}`} alt={job.company_name} className={styles.imtiaz} />
                
                <div className={styles.job_info}>
                  <h5 id={styles.jobTitle}>
                    {job.job_title}
                  </h5>

                  <div className={styles.job_info_para}>
                      {job.job_city}, Pakistan
                  </div>

                  <div className={styles.job_info_para}>
                    Rs: {job.min_salary} - Rs: {job.max_salary}
                  </div>

                  <div className={styles.job_info_para}>
                    {job.vacancies} Openings
                  </div>
                  
                </div>
                <button className={styles.applyNow1} onClick={() => handleApplyClick(job.j_id)}>
                  Apply
                </button>
              </div>
              ))
            )}
          </div>
        )}

        <Footer />
    </div>

  );
};

export default HomePage2;
