import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyHeader from './CompnayHeader';
import styles from './StyleA.module.css';
import Footer from './Footer';



const CompanyJobPost = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobCategory, setJobCategory] = useState('');
  const [city, setCity] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [days, setDays] = useState([]);
  const [hours, setHours] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [vacancies, setVacancies] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [tags, setTags] = useState([]);

  const handleTagAddition = (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      const skill = skills.trim();
      if (skill && !tags.includes(skill)) {
        setTags([...tags, skill]);
        setSkills('');
      }
    }
  };

  const handleTagRemoval = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const navigate = useNavigate();


  const handleSubmit = (event) => {
    event.preventDefault();

    if (tags.length === 0) {
      alert("Please add at least one skill.");
      return;
    }
  
    if (days.length === 0) {
      alert("Please select at least one day.");
      return;
    }

    const registrationNumber = localStorage.getItem('companyRegistrationNumber');

    const jobData = {
      jobTitle,
      jobCategory,
      city,
      education,
      experience,
      days,
      hours,
      age,
      gender,
      minSalary,
      maxSalary,
      vacancies,
      description,
      skills: tags,
      c_registrationNo: registrationNumber  
    };


    axios.post('http://localhost:3001/post-job', jobData)
      .then(response => {
        console.log(response.data);
        alert('Job posted successfully');
        navigate(`/CompanyHome/` , {state : {email : localStorage.getItem('companyEmail') }});
      })
      .catch(error => {
        console.error('There was an error posting the job!', error);
      });
  };

  const handleHoursChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && (value === '' || (Number(value) >= 1 && Number(value) < 12))) {
      setHours(value);
    } else if (value !== '') {
      alert('Please enter a number between 0 and 12.');
    }
  };

  if(!localStorage.getItem('companyRegistrationNumber')){
    return <h2 style={{textAlign:'center' , color:'red'}} >Unauthorized Access</h2>
}

  return (
    <>
    <CompanyHeader/>
    <div class={styles.c_home_main}>
    <h2>Post a job</h2>
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <label htmlFor="job-title">Job Title</label>
          <input
            type="text"
            id="job-title"
            name="job-title"
            placeholder="Add job title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        {/* Second Row */}
        <div className={styles.formRow +" "+ styles.doubleColumn}>
          <div className={styles.column}>
            <label htmlFor="job-category">Job Category</label>
            <select
              id="job-category"
              name="job-category"
              value={jobCategory}
              onChange={(e) => setJobCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="Salesperson">Salesperson</option>
              <option value="Watchman">Watchman</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Call Operator">Call Operator</option>
            </select>
          </div>
          <div className={styles.column}>
            <label htmlFor="city">City</label>
            <select
              id="city"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            >
              <option value="">Select City</option>
              <option value="Gujranwala">Gujranwala</option>
              <option value="Sialkot">Sialkot</option>
              <option value="Lahore">Lahore</option>
              <option value="Karachi">Karachi</option>
              <option value="Islamabad">Islamabad</option>

            </select>
          </div>
          <div className={styles.emptySpace}></div>
        </div>

        <br />
        <div className={styles.formRow}>
          <label htmlFor="additional-info">Additional Information</label>
        </div>
        <div className={styles.formRow +" "+ styles.doubleColumn}>
          <div className={styles.column} style={{ width: 'fit-content'}}>
            <label htmlFor="education">Education</label>
            <select
              id="education"
              name="education"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              required
            >
                                <option value="" disabled>Select your education level</option>
                                <option value="Matric">Matric</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Under Graduatation">Under Graduatation</option>
                                <option value="Post Graduatation">Post Graduatation</option>
            </select>
          </div>
          <div className={styles.column} style={{ width: 'fit-content' }}>
            <label htmlFor="experience">Experience</label>
            <select
              id="experience"
              name="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
            >
                                <option value="" disabled>Select your experience level</option>
                                <option value="0-1 years">0-1 years</option>
                                <option value="2-4 years">2-4 years</option>
                                <option value="5-7 years">5-7 years</option>
                                <option value="8-10 years">8-10 years</option>
                                <option value="10+ years">10+ years</option>
            </select>
          </div>
          <div className={styles.column} style={{ width: 'fit-content' }}>
            <label>Days of Week</label>
            <div className={styles.checkboxGroup} style={{ marginTop: '10px' }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <label key={day}>
                  <input
                    type="checkbox"
                    name="day"
                    value={day}
                    checked={days.includes(day)}
                    onChange={(e) => {
                      const selectedDays = e.target.checked ? [...days, day]  : days.filter(d => d !== day);
                      setDays(selectedDays);
                    }}
                  />
                  <span>{day.charAt(0).toUpperCase()}</span>
                </label>
              ))}
            </div>
          </div>
          <div className={styles.column} style={{ width: 'fit-content' }}>
            <label htmlFor="hours">Hours per Day</label>
            <input
              type="number"
              id="hours"
              name="hours"
              placeholder="Hours"
              value={hours}
              onChange={handleHoursChange}
              required
              
            />
          </div>
        </div>

        <div className={styles.formRow +" "+ styles.doubleColumn}>
          <div className={styles.column} style={{ width: '20%' }}>
            <label htmlFor="age">Age</label>
            <select  id="age" name="age"  value={age}   onChange={(e) => setAge(e.target.value)} required >
                  <option value="">Select Age Range</option>
                  <option value="18-25">18 to 25</option>
                  <option value="26-35">26 to 35</option>
                  <option value="36-45">36 to 45</option>
                  <option value="46-55">46 to 55</option>
                  <option value="56-65">56 to 65</option>
                  <option value="65+">65 and above</option>
            </select>
          </div>
          <div className={styles.column} style={{ width: '20%' }}>
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="any">Both</option>

            </select>
          </div>
          <div className={styles.emptySpace}></div>
        </div>

        {/* Third Row */}
        <div className={styles.formRow +" "+styles.doubleColumn}>
          <div className={styles.column}>
            <label htmlFor="min-salary">Minimum Salary</label>
            <input
              type="number"
              id="min-salary"
              name="min-salary"
              placeholder="Add min salary"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              required
              max={maxSalary}
              min={1}
            />
          </div>
          <div className={styles.column}>
            <label htmlFor="max-salary">Maximum Salary</label>
            <input
              type="number"
              id="max-salary"
              name="max-salary"
              placeholder="Add max salary"
              value={maxSalary}
              onChange={(e) => setMaxSalary(e.target.value)}
              required
              min={minSalary}
              max={99999999}
            />
          </div>
          <div className={styles.emptySpace}></div>
        </div>

        {/* Fourth Row */}
        <div className={styles.formRow +" "+ styles.doubleColumn}>
          <div className={styles.column}>
            <label htmlFor="vacancies">Vacancies</label>
            <input
              type="number"
              id="vacancies"
              name="vacancies"
              placeholder="Add vacancies"
              value={vacancies}
              onChange={(e) => setVacancies(e.target.value)}
              required
              min={1}
              max={99}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <label htmlFor="description">Job Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Add job description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className={styles.formRow}>
          <label htmlFor="skills">Skills</label>
          <input
            type="text"
            id="skills"
            name="skills"
            placeholder="Type and press space to add skill"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            onKeyDown={handleTagAddition}
          />
          <div className={styles.tagsContainer}>
            {tags.map(tag => (
              <span key={tag} className={styles.tag}>
                {tag}
                <button type="button" onClick={() => handleTagRemoval(tag)}>x</button>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.formRow}>
          <button type="submit" className={styles.postJobButton}>Post Job</button>
        </div>
      </form>
    </div>
    </div>
    <Footer/>
    </>
  );
};

export default CompanyJobPost;