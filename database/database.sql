CREATE DATABASE labourLink;
USE labourLink;
CREATE TABLE jobSeeker (
    js_id INT AUTO_INCREMENT PRIMARY KEY,
    js_name VARCHAR(50) NOT NULL,
    js_gender ENUM('Male', 'Female') NOT NULL,
    js_email VARCHAR(100) NOT NULL UNIQUE,
    js_phoneNo VARCHAR(11) NOT NULL UNIQUE,
    js_password VARCHAR(100) NOT NULL
);

CREATE TABLE admin(
	username varchar(25) PRIMARY KEY,
    password varchar(25) NOT NULL
);


CREATE TABLE companies (
    name VARCHAR(100) UNIQUE NOT NULL,
    registrationNumber varchar(7) PRIMARY KEY,  
    phoneNumber VARCHAR(11) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    register_date date DEFAULT CURRENT_DATE, 
    password VARCHAR(50) NOT NULL,
    c_status BOOLEAN NOT NULL DEFAULT FALSE,
    logo VARCHAR(255) NOT NULL,
    username varchar(25),
    CONSTRAINT admin_c_fk FOREIGN KEY (username) REFERENCES admin (username)
);

INSERT INTO admin(admin.username,admin.password) 
VALUES("admin","admin");


CREATE TABLE IF NOT EXISTS jobs (
    j_id INT AUTO_INCREMENT PRIMARY KEY,
    job_title VARCHAR(100) NOT NULL,
    vacancies INT(2) NOT NULL,
    min_salary DECIMAL(10, 2) NOT NULL,
    max_salary DECIMAL(10, 2) NOT NULL,
    job_hours INT(2) NOT NULL,
    preferred_gender ENUM('Male', 'Female', 'Any'),
    job_description TEXT NOT NULL,
    age varchar(30) NOT NULL,
    job_city VARCHAR(15) NOT NULL,
    education VARCHAR(100) NOT NULL,
    c_registrationNo varchar(7),
    category VARCHAR(100) NOT NULL,
    experience VARCHAR(100) NOT NULL,
    j_status BOOLEAN NOT NULL DEFAULT TRUE,
    j_date DATE DEFAULT CURRENT_DATE,
    CONSTRAINT c_job_fk FOREIGN KEY (c_registrationNo) REFERENCES companies(registrationNumber)
);


CREATE TABLE IF NOT EXISTS job_days (
    j_id INT,
    day VARCHAR(20) NOT NULL,
    PRIMARY KEY (j_id, day),
     CONSTRAINT js_days_fk FOREIGN KEY (j_id) REFERENCES jobs(j_id)
);


CREATE TABLE IF NOT EXISTS job_skills (
    j_id INT,
    skill VARCHAR(100) NOT NULL,
    PRIMARY KEY (j_id, skill),
    CONSTRAINT js_skills_fk FOREIGN KEY (j_id) REFERENCES jobs(j_id)
);

CREATE TABLE applicant (
    app_id INT AUTO_INCREMENT PRIMARY KEY,
    app_gender ENUM('Male', 'Female') NOT NULL,
    app_resume VARCHAR(255) NOT NULL, 
    app_name VARCHAR(50) NOT NULL,
    app_email VARCHAR(100) NOT NULL,
    app_age INT(2) NOT NULL,
    app_education VARCHAR(200) NOT NULL,
    app_status BOOLEAN NOT NULL DEFAULT FALSE,
    app_experience VARCHAR(150) NOT NULL,
    app_phoneNo VARCHAR(11) NOT NULL,
    ats_score INT(2) NOT NULL DEFAULT 0,
    j_id INT,
    c_registrationNo varchar(7),
    CONSTRAINT job_app_fk FOREIGN KEY (j_id) REFERENCES jobs(j_id),
    CONSTRAINT c_app_fk FOREIGN KEY (c_registrationNo) REFERENCES companies(registrationNumber)
);

CREATE TABLE proofs (
    app_id INT,
    proof VARCHAR(255) NOT NULL, 
    PRIMARY KEY (app_id, proof),
    CONSTRAINT app_proofs_fk FOREIGN KEY (app_id) REFERENCES applicant(app_id)
);

CREATE TABLE apply(
    js_id INT ,
    j_id INT,
    PRIMARY KEY(js_id,j_id),
    CONSTRAINT apply_job_fk FOREIGN KEY (j_id) REFERENCES jobs(j_id), 
    CONSTRAINT apply_js_fk FOREIGN KEY (js_id) REFERENCES jobSeeker(js_id) 
);