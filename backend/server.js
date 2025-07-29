const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sendMail = require('./mailer'); 
const axios = require('axios'); 
const { query } = require('express');
const { format } = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'labourLink'
});

db.connect(err => {
    if (err)  throw err;
    console.log('Database connected...');
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


//user--------------------------------------------

app.get('/live-homepage-users', (req, res) =>{
    const query = `Select count(js_id) 'liveUsers' FROM jobSeeker;`
      
    db.query(query, (err, result) =>{
        if(err){
            console.error(err);
            res.status(500).send('Internal Server Error');
        }else{
            if(result.length>0){
                res.send(result[0]);
            }
        }
    } )

})


app.get('/live-homepage-jobs', (req, res) =>{
    const query = `Select count(j_id) 'liveJobs' FROM jobs WHERE j_status = 1;`
      
    db.query(query, (err, result) =>{
        if(err){
            console.error(err);
            res.status(500).send('Internal Server Error');
        }else{
            if(result.length>0){
                res.send(result[0]);
            }
        }
    } )

});

app.get('/live-homepage-companies', (req, res) =>{
    const query = `Select count(registrationNumber) 'liveCompanies' FROM companies  WHERE c_status = 1;`
      
    db.query(query, (err, result) =>{
        if(err){
            console.error(err);
            res.status(500).send('Internal Server Error');
        }else{
            if(result.length>0){
                res.send(result[0]);
            }
        }
    } )

})

app.post('/check-user-email', (req, res) => {
    const { email } = req.body;
    const query = 'SELECT * FROM jobSeeker WHERE js_email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            if (results.length > 0) {
                res.send({ exists: true });
            } else {
                res.send({ exists: false });
            }
        }
    });
});

app.post('/check-user-phone', (req, res) => {
    const { phone } = req.body;
    const query = 'SELECT * FROM jobSeeker WHERE js_phoneNo = ?';
    db.query(query, [phone], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            if (results.length > 0) {
                res.send({ exists: true });
            } else {
                res.send({ exists: false });
            }
        }
    });
});

app.post('/signUp', (req, res) => {
    const { name, gender, email, phone_number, password } = req.body;
    const sql = 'INSERT INTO jobSeeker (js_name, js_gender, js_email, js_phoneNo, js_password) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, gender, email, phone_number, password], (err, result) => {
        if (err) {
            console.error('Error registering user:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('User registered successfully');
    });
});

app.post('/login', (req, res) => {
    const {phone_number, password } = req.body;
    const sql = 'SELECT * FROM jobSeeker WHERE js_phoneNo = ? AND js_password = ?';
    db.query(sql, [phone_number, password], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length > 0) {
            req.session.userPhoneNo = result[0].js_phoneNo;
            res.send(result[0]);
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }//if
        res.send('Logged out successfully');
    });
});


//company--------------------------------------------------

app.post('/company-signup', upload.single('logo'), (req, res) => {
    const {name, email, phoneNumber, password, registration_number } = req.body;
    const logo = req.file ? req.file.filename : null;

    const sql = 'INSERT INTO companies (name, email, phoneNumber, password, registrationNumber, logo) VALUES (?,?, ? , ?, ?, ?)';
    db.query(sql, [name, email, phoneNumber  , password, registration_number, logo], (err, result) => {
        if (err) {
            console.error('Error inserting company:', err);
            res.status(500).send('Server error');
            return;
        }
        res.status(200).send('Company registered successfully');
    });
});

app.post('/check-company-email', (req, res) => {
    const { email } = req.body;
    const query = 'SELECT * FROM companies WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            if (results.length > 0) {
                res.send({ exists: true });
            } else {
                res.send({ exists: false });
            }
        }
    });
});

app.post('/check-company-phone', (req, res) => {
    const { phoneNumber } = req.body;
    const query = 'SELECT * FROM companies WHERE phoneNumber = ?';
    db.query(query, [phoneNumber], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            if (results.length > 0) {
                res.send({ exists: true });
            } else {
                res.send({ exists: false });
            }
        }
    });
});

app.post('/check-company-regNo', (req, res) => {
    const { registration_number } = req.body;
    const query = 'SELECT * FROM companies WHERE registrationNumber = ?';
    db.query(query, [registration_number], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            if (results.length > 0) {
                res.send({ exists: true });
            } else {
                res.send({ exists: false });
            }
        }
    });
});

app.post('/check-company-name', (req, res) => {
    const { name } = req.body;
    const query = 'SELECT * FROM companies WHERE name = ?';
    db.query(query, [name], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            if (results.length > 0) {
                res.send({ exists: true });
            } else {
                res.send({ exists: false });
            }
        }
    });
});

app.post('/company-login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM companies WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Error logging in company:', err);
            res.status(500).send('Server error');
            return;
        }
        if (results.length > 0) {
            const company = results[0];
            req.session.companyReg=results[0].registrationNumber;
            res.status(200).json({ message: 'Company logged in successfully', company });
        } else {
            res.status(400).send('Invalid credentials');
        }
    });
});

app.post('/company-logout' , (req,res) =>{
    req.session.destroy( (err) => {
        if(err){
            return res.status(500).send('Server Error');
        }

        res.send('Session of company destroyed successfully')
    });
});


app.get('/company-status/:email', (req, res) => {
    const { email } = req.params;
    const sql = 'SELECT c_status FROM companies WHERE email = ?';
    db.query(sql, [email], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length > 0) {
            res.send(result[0]);
        } else {
            res.status(404).send('Company not found');
        }
    });
});

//admin----------------------------------------------

app.post('/admin-login' , (req,res) => {
    const {username, password} = req.body;
    const sql = 'SELECT * FROM admin WHERE username = ? AND password = ?;';

    db.query(sql , [username,password] ,(err,results) => {
        if (err) {
            console.error('Error loggin in admin:' , err);
            return res.status(500).send('Server error');
        }//if

        if(results.length>0){
            req.session.adminUsername = results[0].username;
            res.status(200).send('Admin Logged in successfully');

        } else {
            res.status(400).send('Invalid Credentials');
        }//if
    });
});

app.get('/AdminDashboard',(req,res) => {

    const sql = "SELECT companies.name, companies.register_date, companies.phoneNumber, companies.registrationNumber, companies.email, companies.c_status  FROM companies ;"

    db.query(sql, (err,results) => {
        if (err) {
            console.error('Error fetching companies:', err);
            return res.status(500).send('Internal server error');
        }

        if(results.length>0){
            
            res.status(200).send(results);

        } else {
            res.status(400).send('No companies yet');
        }//if
          
    });
});

app.post('/admin-dashboard-verify', (req, res) => {
    const { registrationNumber, username } = req.body;

    const verifyCompanyQuery = 'UPDATE companies SET c_status = true , username = ?  WHERE registrationNumber = ?';
    const getCompanyDetailsQuery = 'SELECT email, name FROM companies WHERE registrationNumber = ?';

    db.query(verifyCompanyQuery, [username , registrationNumber], (err, results) => {
        if (err) {
            console.error('Error verifying company:', err);
            return res.status(500).send('Internal server error');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send(`Company with registration number ${registrationNumber} not found`);
        } else {
          
            db.query(getCompanyDetailsQuery, [registrationNumber], (err, companyResults) => {
                if (err) {
                    console.error('Error fetching company details:', err);
                    return res.status(500).send('Internal server error');
                }

                if (companyResults.length > 0) {
                    const company = companyResults[0];
                    const to = company.email;
                    const subject = 'Your Company Has Been Successfully Verified';
                    const text = `Dear ${company.name},\n\nWe are pleased to inform you that your company,  ${company.name}  has been successfully verified on our platform. You can now post job listings and start hiring the best candidates for your company.\n\nThank you for choosing our platform.\n\nBest regards,\n LabourLink`;

                    sendMail(to, subject, text)
                        .then(() => {
                            res.status(200).send(`Company with registration number ${registrationNumber} verified and email sent.`);
                        })
                        .catch(error => {
                            console.error('Error sending email:', error);
                            res.status(500).send('Company verified, but error sending email.');
                        });
                } else {
                    res.status(404).send('Company details not found after verification.');
                }
            });
        }
    });
});

// app.delete('/admin-dashboard-delete/:registrationNumber', (req, res) => {
//     const { registrationNumber } = req.params;

//     const getProofsSql = 'SELECT proof FROM proofs WHERE app_id IN (SELECT app_id FROM jobs JOIN applicant ON(jobs.j_id=applicant.j_id) WHERE jobs.c_registrationNo = ?)';
//     db.query(getProofsSql, [registrationNumber], (err, proofs) => {
//         if (err) {
//             console.error('Error fetching proofs:', err);
//         } else {
//             proofs.forEach(proof => {
//                 const proofPath = path.join(__dirname, proof.proof);
//                 fs.unlink(proofPath, (err) => {
//                     if (err) {
//                         console.error('Error deleting proof file:', err);
//                     }
//                 });
//             });
//         }
//     })

//         const getResumesSql = 'SELECT app_resume FROM applicant WHERE j_id IN (Select j_id from jobs where c_registrationNo=?)';
//         db.query(getResumesSql, [registrationNumber], (err, resumes) => {
//             if (err) {
//                 console.error('Error fetching resumes:', err);
//             } else {
//                 resumes.forEach(resume => {
//                     const resumePath = path.join(__dirname, resume.app_resume);
//                     fs.unlink(resumePath, (err) => {
//                         if (err) {
//                             console.error('Error deleting resume file:', err);
//                         }
//                     });
//                 });
//             }
//         });


//      //deleting from proofs table
//     const deleteFromProofsSql = 'DELETE FROM proofs WHERE app_id IN (SELECT app_id FROM jobs JOIN applicant ON(jobs.j_id=applicant.j_id) WHERE jobs.c_registrationNo = ?)';
//     db.query(deleteFromProofsSql, [registrationNumber], (err) => {
//         if (err) {
//                 console.error('Error deleting applicants from proof table:', err);
//                 return res.status(500).send('Internal server error');
//         }


//          //deleting from applicant table
//          const deleteFromProofsSql = 'DELETE FROM applicant WHERE j_id IN (SELECT j_id FROM jobs WHERE c_registrationNo = ?)';
//          db.query(deleteFromProofsSql, [registrationNumber], (err) => {
//              if (err) {
//                      console.error('Error deleting applicants from proof table:', err);
//                      return res.status(500).send('Internal server error');
//              }    

//     //deleting from apply table
//     const deleteFromApplySql = 'DELETE FROM apply WHERE j_id IN (SELECT j_id FROM jobs WHERE c_registrationNo = ?)';
//     db.query(deleteFromApplySql, [registrationNumber], (err) => {
//         if (err) {
//             console.error('Error deleting jobs from apply table:', err);
//             return res.status(500).send('Internal server error');
//         }

  

//     // First, delete all records related to job_skills
//     const deleteJobSkillsSql = 'DELETE FROM job_skills WHERE j_id IN (SELECT j_id FROM jobs WHERE c_registrationNo = ?)';
//     db.query(deleteJobSkillsSql, [registrationNumber], (err) => {
//         if (err) {
//             console.error('Error deleting job skills:', err);
//             return res.status(500).send('Internal server error');
//         }

//         // Next, delete all records related to job_days
//         const deleteJobDaysSql = 'DELETE FROM job_days WHERE j_id IN (SELECT j_id FROM jobs WHERE c_registrationNo = ?)';
//         db.query(deleteJobDaysSql, [registrationNumber], (err) => {
//             if (err) {
//                 console.error('Error deleting job days:', err);
//                 return res.status(500).send('Internal server error');
//             }

//             // Then, delete all jobs related to the company
//             const deleteJobsSql = 'DELETE FROM jobs WHERE j_id IN (Select j_id from jobs where c_registrationNo=?)';
//             db.query(deleteJobsSql, [registrationNumber], (err) => {
//                 if (err) {
//                     console.error('Error deleting jobs:', err);
//                     return res.status(500).send('Internal server error');
//                 }

//                 // Finally, get the company record to retrieve the logo filename
//                 const getCompanySql = 'SELECT logo FROM companies WHERE registrationNumber = ?';
//                 db.query(getCompanySql, [registrationNumber], (err, results) => {
//                     if (err) {
//                         console.error('Error fetching company:', err);
//                         return res.status(500).send('Internal server error');
//                     }

//                     if (results.length === 0) {
//                         return res.status(404).send(`Company with registration number ${registrationNumber} not found`);
//                     }

//                     const logo = results[0].logo;

//                     // Proceed with deleting the company record
//                     const deleteCompanySql = 'DELETE FROM companies WHERE registrationNumber = ?';
//                     db.query(deleteCompanySql, [registrationNumber], (err) => {
//                         if (err) {
//                             console.error('Error deleting company:', err);
//                             return res.status(500).send('Internal server error');
//                         }

//                         if (logo) {
//                             // Delete the image file from the uploads folder
//                             const filePath = path.join(__dirname, 'uploads', logo);
//                             fs.unlink(filePath, (err) => {
//                                 if (err) {
//                                     console.error('Error deleting image file:', err);
//                                 }
//                             });
//                         }

//                         res.status(200).send(`Company with registration number ${registrationNumber} and all related jobs deleted`);
//                     });
//                 });
//             });
//         });
//     });
// });
//     });
// });
// });

app.delete('/admin-dashboard-delete/:registrationNumber', (req, res) => {
    const { registrationNumber } = req.params;

    const getProofsSql = 'SELECT proof FROM proofs WHERE app_id IN (SELECT app_id FROM jobs JOIN applicant ON(jobs.j_id = applicant.j_id) WHERE jobs.c_registrationNo = ?)';
    db.query(getProofsSql, [registrationNumber], (err, proofs) => {
        if (err) {
            console.error('Error fetching proofs:', err);
        } else {
            proofs.forEach(proof => {
                const proofPath = path.join(__dirname, proof.proof);
                fs.unlink(proofPath, (err) => {
                    if (err) {
                        console.error('Error deleting proof file:', err);
                    }
                });
            });
        }
    });


    const getResumesSql = 'SELECT app_resume FROM applicant WHERE j_id IN (SELECT j_id FROM jobs WHERE c_registrationNo = ?)';
    db.query(getResumesSql, [registrationNumber], (err, resumes) => {
        if (err) {
            console.error('Error fetching resumes:', err);
        } else {
            resumes.forEach(resume => {
                const resumePath = path.join(__dirname, resume.app_resume);
                fs.unlink(resumePath, (err) => {
                    if (err) {
                        console.error('Error deleting resume file:', err);
                    }
                });
            });
        }
    });

    const deleteFromProofsSql = 'DELETE FROM proofs WHERE app_id IN (SELECT app_id FROM jobs JOIN applicant ON(jobs.j_id = applicant.j_id) WHERE jobs.c_registrationNo = ?)';
    db.query(deleteFromProofsSql, [registrationNumber], (err) => {
        if (err) {
            console.error('Error deleting from proofs table:', err);
            return res.status(500).send('Internal server error');
        }

        const deleteFromApplicantSql = 'DELETE FROM applicant WHERE j_id IN (SELECT j_id FROM jobs WHERE c_registrationNo = ?)';
        db.query(deleteFromApplicantSql, [registrationNumber], (err) => {
            if (err) {
                console.error('Error deleting from applicant table:', err);
                return res.status(500).send('Internal server error');
            }

            const deleteFromApplySql = 'DELETE FROM apply WHERE j_id IN (SELECT j_id FROM jobs WHERE c_registrationNo = ?)';
            db.query(deleteFromApplySql, [registrationNumber], (err) => {
                if (err) {
                    console.error('Error deleting from apply table:', err);
                    return res.status(500).send('Internal server error');
                }

                const deleteJobSkillsSql = 'DELETE FROM job_skills WHERE j_id IN (SELECT j_id FROM jobs WHERE c_registrationNo = ?)';
                db.query(deleteJobSkillsSql, [registrationNumber], (err) => {
                    if (err) {
                        console.error('Error deleting from job_skills table:', err);
                        return res.status(500).send('Internal server error');
                    }

                    const deleteJobDaysSql = 'DELETE FROM job_days WHERE j_id IN (SELECT j_id FROM jobs WHERE c_registrationNo = ?)';
                    db.query(deleteJobDaysSql, [registrationNumber], (err) => {
                        if (err) {
                            console.error('Error deleting from job_days table:', err);
                            return res.status(500).send('Internal server error');
                        }

                        const deleteJobsSql = 'DELETE FROM jobs WHERE c_registrationNo = ?';
                        db.query(deleteJobsSql, [registrationNumber], (err) => {
                            if (err) {
                                console.error('Error deleting jobs:', err);
                                return res.status(500).send('Internal server error');
                            }

                            const getCompanySql = 'SELECT logo FROM companies WHERE registrationNumber = ?';
                            db.query(getCompanySql, [registrationNumber], (err, results) => {
                                if (err) {
                                    console.error('Error fetching company:', err);
                                    return res.status(500).send('Internal server error');
                                }

                                if (results.length === 0) {
                                    return res.status(404).send(`Company with registration number ${registrationNumber} not found`);
                                }

                                const logo = results[0].logo;

                                const deleteCompanySql = 'DELETE FROM companies WHERE registrationNumber = ?';
                                db.query(deleteCompanySql, [registrationNumber], (err) => {
                                    if (err) {
                                        console.error('Error deleting company:', err);
                                        return res.status(500).send('Internal server error');
                                    }

                                    if (logo) {
                                        const filePath = path.join(__dirname, 'uploads', logo);
                                        fs.unlink(filePath, (err) => {
                                            if (err) {
                                                console.error('Error deleting image file:', err);
                                            }
                                        });
                                    }

                                    res.status(200).send(`Company with registration number ${registrationNumber} and all related jobs deleted`);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});





app.get('/admin-dashboard-search',  (req, res) => {
    const { name, registrationNumber } = req.query;

    let sql = 'SELECT companies.name, companies.register_date, companies.phoneNumber, companies.registrationNumber, companies.email, companies.c_status FROM companies ';
    const params = [];

    if (name) {
        sql += ' WHERE name LIKE ?';
        params.push(`%${name}%`);
    }
    
    if (registrationNumber) {
        if (name) {
          sql += ' AND registrationNumber = ?';
        } else {
          sql += ' WHERE registrationNumber = ?';
        }
        params.push(registrationNumber);
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error searching for companies', err);
            res.status(500).send('Server error');
            return;
        }

        res.send(results);
    });
});
app.post('/admin-logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out admin:', err);
            return res.status(500).send('Server error');
        }
        res.status(200).send('Admin Logged out successfully');
    });
});

//----------------------------------------------

app.post('/post-job', (req, res) => {
    const { jobTitle, jobCategory, city, education, experience, days, hours, age, gender, minSalary, maxSalary, vacancies, description, skills, c_registrationNo } = req.body;

    const sqlInsertJob = 'INSERT INTO jobs (job_title, vacancies, min_salary, max_salary, job_hours, preferred_gender, job_description, age, job_city, education, c_registrationNo, category, experience) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    db.query(sqlInsertJob, [jobTitle, vacancies, minSalary, maxSalary, hours, gender, description, age, city, education, c_registrationNo, jobCategory, experience], (err, result) => {
        if (err) return res.status(500).send(err);

        const jobId = result.insertId;

        // Insert job days into the job_days table
        const sqlInsertDays = 'INSERT INTO job_days (j_id, day) VALUES ?';
        const jobDaysData = days.map(day => [jobId, day]);

        db.query(sqlInsertDays, [jobDaysData], (err, result) => {
            if (err) return res.status(500).send(err);

            // Insert job skills into the job_skills table
            const sqlInsertSkills = 'INSERT INTO job_skills (j_id, skill) VALUES ?';
            const jobSkillsData = skills.map(skill => [jobId, skill]);

            db.query(sqlInsertSkills, [jobSkillsData], (err, result) => {
                if (err) return res.status(500).send(err);
                res.status(200).send('Job posted successfully');
            });
        });
    });
});

app.get('/company-info/:registrationNumber', (req, res) => {
    const { registrationNumber } = req.params;

    // const sql = `
    //     SELECT companies.name, COUNT(jobs.j_id) AS jobCount
    //     FROM companies
    //     LEFT JOIN jobs ON companies.registrationNumber = jobs.c_registrationNo
    //     WHERE companies.registrationNumber = ? AND jobs.j_status=TRUE
    //     GROUP BY companies.name
    // `;

    const sql =   ` SELECT COUNT(*) AS jobCount FROM companies LEFT JOIN jobs ON (companies.registrationNumber = jobs.c_registrationNo)  WHERE c_registrationNo = ? AND j_status = TRUE`;
    
    db.query(sql, [registrationNumber], (err, results) => {
        if (err) {
            console.error('Error fetching company info:', err);
            return res.status(500).send('Internal server error');
        }

        if (results.length > 0) {
            res.send(results[0]);
        } else {
            res.status(404).send('Company not found');
        }
    });
});

app.get('/open-job-counts', (req, res) => {
    const query = 'SELECT category, COUNT(*) as count FROM jobs WHERE j_status = TRUE GROUP BY category';

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving open job counts' );
    } else {
      res.send(results);
    }
  });
});


app.get('/show-user-jobs', (req, res) => {
    const  category  = req.query.category;

    let query = `SELECT j.*, c.logo AS company_logo FROM jobs j JOIN companies c ON (j.c_registrationNo = c.registrationNumber) WHERE j.category = ? AND j.j_status=1;`

    db.query(query, [category], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(results);
   }
});
});

  app.get('/user-has-applied/:jobId/:js_id', (req, res) => {
    const { jobId, js_id } = req.params;
    const query = `SELECT * FROM apply WHERE js_id = ? AND j_id = ?`;
  
    db.query(query, [js_id, jobId], (err, results) => {
      if (err) {
        console.error('Error checking application status:', err);
        return res.status(500).send('Error checking application status');
      }
  
      if (results.length > 0) {
        res.json({ hasApplied: true });
      } else {
        res.json({ hasApplied: false });
      }
    });
  });






app.get('/one-job/:jobId', (req, res) => {
    const jobId = req.params.jobId;
    const query = `SELECT jobs.*, companies.name , companies.logo FROM  jobs JOIN  companies ON (jobs.c_registrationNo = companies.registrationNumber) WHERE  jobs.j_id = ?;`;
  
    db.query(query, [jobId], (err, results) => {
      if (err) {
        console.error('Error fetching job details:', err);
        res.status(500).send('Failed to fetch job details');
      } 

      if (results.length > 0) {
        res.send(results[0]);
    } else {
        res.status(404).send('Company not found');
    }

    });
  });

  app.get('/one-job/:jobId/skills', (req, res) => {
    const jobId = req.params.jobId;
    const query = `SELECT skill FROM  job_skills WHERE  j_id =?
    `;
    db.query(query, [jobId], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: 'Error retrieving skills' });
      } else {
        const skills = results.map((row) => row.skill);
        res.send(skills);
      }
    });
  });

  app.get('/one-job/:jobId/days', (req, res) => {
    const jobId = req.params.jobId;
    const query = `SELECT day FROM  job_days WHERE  j_id =?`;
    db.query(query, [jobId], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: 'Error retrieving days' });
      } else {
        const days = results.map((row) => row.day);
        res.send(days);
      }
    });
  });
  

//  app.post('/user-apply-job', upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'proofs', maxCount: 10 }]), (req, res) => {
//     const {
//       name,
//       gender,
//       email,
//       phoneNo,
//       age,
//       education,
//       experience,
//       j_id,
//       //c_registrationNo,
//       js_id
//     } = req.body;
  
//     const resume = req.files['resume'][0].path;
//     const proofs = req.files['proofs'].map(file => file.path);
  
//     // Insert applicant details into the applicant table
//     db.query('INSERT INTO applicant (app_resume, app_gender, app_name, app_email, app_age, app_education, app_experience, app_phoneNo, j_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
//         [resume, gender, name, email, age, education, experience, phoneNo, j_id], (error, results) => {
//       if (error) {
//         console.error('Error inserting applicant data:', error);
//         return res.status(500).send('Error inserting applicant data');
//       }
  
//       const appId = results.insertId; // Get the inserted applicant's ID
  
//       // Insert each proof into the proofs table
//       const proofValues = proofs.map(proof => [appId, proof]);
  
//       db.query('INSERT INTO proofs (app_id, proof) VALUES ?', [proofValues], (error) => {
//         if (error) {
//           console.error('Error inserting proofs:', error);
//           return res.status(500).send('Error inserting proofs');
//         }
  
//         //res.status(200).send('Application submitted successfully');

        

//         //Insert into apply table
//         const applyQuery = 'INSERT INTO apply (js_id, j_id) VALUES (?, ?)';
//         db.query(applyQuery, [js_id, j_id], (err, result) => {
//         if (err) {
//             console.error('Error inserting into apply table:', err);
//             return res.status(500).send('Error submitting data into apply table');
//         }

//         res.status(200).send('Application submitted successfully and Data Submitted to apply table');
//         });


//       });
//     });
//   });


app.post('/user-apply-job', upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'proofs', maxCount: 10 }]), async (req, res) => {
    const {
        name,
        gender,
        email,
        phoneNo,
        age,
        education,
        experience,
        j_id,
        c_registrationNo,
        js_id
    } = req.body;

    const resume = req.files['resume'] ? req.files['resume'][0].path : null;
    const proofs = req.files['proofs'] ? req.files['proofs'].map(file => file.path) : [];

    try {
      
        const jobQuery = `
            SELECT j.j_id, j.job_description, GROUP_CONCAT(js.skill) AS job_skills
            FROM jobs j
            JOIN job_skills js ON (j.j_id = js.j_id)
            WHERE j.j_id = ?
            GROUP BY j.j_id,j.job_description;
        `;
        
        db.query(jobQuery, [j_id], async (err, jobResult) => {
            if (err || jobResult.length === 0) {
                console.error('Error fetching job details:', err || 'Job not found');
                return res.status(500).send('Error fetching job details');
            }

            const { job_description, job_skills } = jobResult[0];

            const applicantData = {
                name,
                gender,
                email,
                phoneNo,
                age,
                education,
                experience,
                j_id,
                c_registrationNo,
                js_id,
                resume_url: `http://localhost:3001/${resume}`,
                job_description: job_description,
                job_skills: job_skills
            };

           
            const atsResponse = await axios.post('http://127.0.0.1:5001/process-data', applicantData);
            const atsScore = atsResponse.data.ats_score;

          
            db.query('INSERT INTO applicant (app_resume, app_gender, app_name, app_email, app_age, app_education, app_experience, app_phoneNo, j_id, c_registrationNo, ats_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [resume, gender, name, email, age, education, experience, phoneNo, j_id, c_registrationNo, atsScore], (error, results) => {
                if (error) {
                    console.error('Error inserting applicant data:', error);
                    return res.status(500).send('Error inserting applicant data');
                }

                const appId = results.insertId;

                if (proofs.length > 0) {
                    const proofValues = proofs.map(proof => [appId, proof]);

                
                    db.query('INSERT INTO proofs (app_id, proof) VALUES ?', [proofValues], (error) => {
                        if (error) {
                            console.error('Error inserting proofs:', error);
                            return res.status(500).send('Error inserting proofs');
                        }

                 
                        const applyQuery = 'INSERT INTO apply (js_id, j_id) VALUES (?, ?)';
                        db.query(applyQuery, [js_id, j_id], (err, result) => {
                            if (err) {
                                console.error('Error inserting into apply table:', err);
                                return res.status(500).send('Error submitting data into apply table');
                            }
                            res.status(200).send('Application submitted successfully with ATS score');
                        });
                    });
                } else {
                  
                    const applyQuery = 'INSERT INTO apply (js_id, j_id) VALUES (?, ?)';
                    db.query(applyQuery, [js_id, j_id], (err, result) => {
                        if (err) {
                            console.error('Error inserting into apply table:', err);
                            return res.status(500).send('Error submitting data into apply table');
                        }
                        res.status(200).send('Application submitted successfully with ATS score');
                    });
                }
            });
        });
    } catch (error) {
        console.error('Error communicating with Python server:', error);
        res.status(500).send('Error processing application');
    }
});


  app.get('/company-jobs/:registrationNumber', (req, res) => {
    const { registrationNumber } = req.params;

    const sql = `
        SELECT jobs.j_id, jobs.job_title, jobs.j_status,
               COUNT(applicant.app_id) AS applicantCount
        FROM jobs
        LEFT JOIN applicant ON jobs.j_id = applicant.j_id
        WHERE jobs.c_registrationNo = ?
        GROUP BY jobs.j_id
    `;

    db.query(sql, [registrationNumber], (err, results) => {
        if (err) {
            console.error('Error fetching jobs:', err);
            return res.status(500).send('Internal server error');
        }

        res.send(results);
    });
});

app.post('/close-job/:jobId', (req, res) => {
    const { jobId } = req.params;
    
    const sql = 'UPDATE jobs SET j_status = FALSE WHERE j_id = ?';

    db.query(sql, [jobId], (err, result) => {
        if (err) {
            console.error('Error closing job:', err);
            return res.status(500).send('Internal server error');
        }

        res.send('Job closed successfully');
    });
});

app.get('/job-applicants/:jobId', (req, res) => {
    const { jobId } = req.params;
    const sql = `
        SELECT a.app_id, a.app_name, a.ats_score, a.app_status, a.app_resume, a.app_experience,a.app_education,a.app_age,a.app_gender,a.app_phoneNo,a.app_email,
               GROUP_CONCAT(p.proof) AS proofs , COUNT(p.proof) AS proofCount
        FROM applicant a
        LEFT JOIN proofs p ON a.app_id = p.app_id
        WHERE a.j_id = ?
        GROUP BY a.app_id
    `;
    
    db.query(sql, [jobId], (err, results) => {
        if (err) {
            console.error('Error fetching applicants:', err);
            return res.status(500).send('Internal server error');
        }

        res.send(results);
    });
});


app.post('/update-applicant-status', (req, res) => {
    const { applicantId,jobId } = req.body;
    const updateStatusQuery = 'UPDATE applicant SET app_status = 1, c_registrationNo = (SELECT jobs.c_registrationNo FROM jobs WHERE jobs.j_id=?) WHERE app_id = ?';
    const getApplicantQuery = 'SELECT app_email, app_name , job_title , name , phoneNumber FROM applicant JOIN jobs ON(applicant.j_id=jobs.j_id) JOIN companies ON(companies.registrationNumber = jobs.c_registrationNo) WHERE applicant.app_id = ?;';

    db.query(updateStatusQuery, [jobId,applicantId], (err, result) => {
        if (err) {
            console.error('Error updating applicant status:', err);
            return res.status(500).send('Internal Server Error');
        }

        db.query(getApplicantQuery, [applicantId], (err, results) => {
            if (err) {
                console.error('Error fetching applicant details:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (results.length > 0) {
                const applicant = results[0];
                const to = applicant.app_email;
                const subject = 'Application Accepted';
                const text = `Dear ${applicant.app_name},\n\nWe are pleased to inform you that your application for the ${applicant.job_title} position at ${applicant.name} has been accepted.\nWe will contact you shortly. If you have any queries, feel free to contact us on ${applicant.phoneNumber}.\n\nBest regards,\n${applicant.name}`;

                sendMail(to, subject, text)
                    .then(() => {
                        res.status(200).json({ message: 'Applicant status updated and email sent.' });
                    })
                    .catch(error => {
                        console.error('Error sending email:', error);
                        res.status(500).json({ message: 'Applicant status updated, but error sending email.' });
                    });
            } else {
                res.status(404).json({ message: 'Applicant not found.' });
            }
        });
    });
});

app.get('/filter-applicants', (req, res) => {
    const { jobId, atsScore, proofs } = req.query;

    let sql = `
        SELECT a.app_id, a.app_name, a.ats_score, a.app_status, a.app_resume, a.app_experience, a.app_education, a.app_age, a.app_gender, a.app_phoneNo, a.app_email,
               GROUP_CONCAT(p.proof) AS proofs, COUNT(p.proof) AS proofCount
        FROM applicant a
        LEFT JOIN proofs p ON a.app_id = p.app_id
        WHERE a.j_id = ?
    `;

    const params = [jobId];

    if (atsScore) {
        sql += ' AND a.ats_score >= ?';
        params.push(atsScore);
    }

    sql += ' GROUP BY a.app_id';

    if (proofs) {
        sql += ' HAVING COUNT(p.proof) >= ?';
        params.push(proofs);
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error filtering applicants:', err);
            return res.status(500).send('Internal server error');
        }

        res.send(results);
    });
});



const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});