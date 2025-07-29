import React from 'react';
import {  Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import CompanyHome from './components/CompanyHome';
import CompanyLogin from './components/CompanyLogin';
import CompanySignup from './components/CompanySignup';
import Login from './components/Login';
import Signup from './components/SignUp';

import './App.css';
import ApplicantsList from './components/ApplicantsList';
import CompanyJobPost from './components/CompanyJobPost';
import HomePage2 from './components/HomePage2';
import U_home from './components/U_home';
import UserOneJob from './components/UserOneJob';

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/SignUp" element={<Signup />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/CompanySignup" element={<CompanySignup />} />
                    <Route path="/CompanyLogin" element={<CompanyLogin />} />
                    <Route path="/AdminLogin" element={<AdminLogin />} />
                    <Route path="/AdminDashboard" element={<AdminDashboard />} />
                    {/* <Route path="/companyHome/:email" element={<CompanyHome />} /> */}
                    <Route path="/companyHome" element={<CompanyHome />} />
                    <Route path="/CompanyJobPost" element={<CompanyJobPost />} />
                    <Route path="/U_home" element={<U_home />} />
                    <Route path="/HomePage2/:categoryName" element={<HomePage2 />} />
                    <Route path="/UserOneJob" element={<UserOneJob />}/>
                    {/* <Route path="/applicants/:jobId" element={<ApplicantsList />} /> */}
                    <Route path="/applicants" element={<ApplicantsList />} />

                </Routes>
            </div>
        </Router>
    );
};

export default App;