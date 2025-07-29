import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminDashboard.module.css';
import icon from '../images/Icon-verify-pop-up.svg';
import pageTitle from '../images/pageTitle.svg';
import iconDelete from '../images/Icon-delete-pop-up.svg';
import adminSidebar from '../images/adminSidebar.svg';
import { format } from 'date-fns';



const AdminDashboard = () => {

    const [companyData,setCompanyData] = useState([]); 
    const [searchName, setSearchName] = useState('');
    const [searchRegNumber, setSearchRegNumber] = useState('');
    const [showVerifyPopup, setShowVerifyPopup] = useState(false);
    const [showVerifiedPopup, setShowVerifiedPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showDeletedPopup, setShowDeletedPopup] = useState(false);
    const [currentCompany, setCurrentCompany] = useState(null);
   

    const fetchCompanyData = () =>{
        axios.get('http://localhost:3001/AdminDashboard')

        .then(response => {
            setCompanyData(response.data);
        })

        .catch(error =>{
             console.error('There was an error fetching the data', error);
        })

    };

    useEffect( () =>{
        fetchCompanyData();

    } , []);

    const handleVerify = (company) => {
      setCurrentCompany(company);
      setShowVerifyPopup(true);
    };
  



  const handleConfirmVerify = () => {
      if (currentCompany) {
        const data = {
            registrationNumber : currentCompany.registrationNumber,
            username : localStorage.getItem('adminUsername')
        }
          axios.post('http://localhost:3001/admin-dashboard-verify', data )
              .then(response => {
                  fetchCompanyData();
                  setShowVerifyPopup(false);
                  setShowVerifiedPopup(true);
              })
              .catch(error => {
                  console.error('Error verifying company:', error);
                  alert('Failed to verify company');
              });
      }
   };

const handleDelete = (company) => {
    setCurrentCompany(company);
    setShowDeletePopup(true);
};

    const handleConfirmDelete = () => {
        if (currentCompany) {
            axios.delete(`http://localhost:3001/admin-dashboard-delete/${currentCompany.registrationNumber}`)
                .then(response => {
                    fetchCompanyData();
                    setShowDeletePopup(false);
                    setShowDeletedPopup(true);
                })
                .catch(error => {
                    console.error('Error deleting company:', error);
                    alert('Failed to delete company');
                    //setShowDeletePopup(false);
                });
        }
    };
  

    const handleSearch = () => {
      axios.get('http://localhost:3001/admin-dashboard-search', {
          params: {
              name: searchName,
              registrationNumber: searchRegNumber 
          }
      })
      .then(response => {
          console.log(response.data);
          setCompanyData(response.data);
      })
      .catch(error => {
          console.error('Error searching companies', error);
      })
    };

    const handleLogout = () => {
        axios.post('http://localhost:3001/admin-logout')
            .then(response => {
                localStorage.removeItem('adminUsername');
                window.location.href = '/AdminLogin';
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'MM/dd/yyyy');
    };

    if(!localStorage.getItem('adminUsername')){
        return <h2 style={{textAlign:'center' , color:'red'}} >Unauthorized Access</h2>
    }

  return (
    <div>

    {showVerifyPopup && (
        <div className={styles.admin_popup_container}>
            <div className={styles.admin_popup}>
                <img src={icon} alt="icon" className={styles.admin_popup_icon} />
                <div className={styles.admin_popup_info}>
                    <h2>Verification Of Company</h2>
                    <pre>Are you sure you want to verify the company with<br />registration number {currentCompany?.registrationNumber}?</pre>
                </div>
                <button className={styles.yes_btn} id={styles.yes_verify_btn} onClick={handleConfirmVerify}>Yes, Confirm</button>
                <button className={styles.close_btn} onClick={() => setShowVerifyPopup(false)}>&times;</button>
            </div>
        </div>
    )}

    {showVerifiedPopup && (
        <div className={styles.admin_popup_container}>
            <div className={styles.admin_popup}>
                <img src={icon} alt="icon" className={styles.admin_popup_icon} />
                <div className={styles.admin_popup_info_after}>
                    <h2>Successfully Verified</h2>
                    <pre>The company with registration number {currentCompany?.registrationNumber} has been<br />successfully verified.</pre>
                </div>
                <button className={styles.close_btn} onClick={() => setShowVerifiedPopup(false)}>&times;</button>
            </div>
        </div>
    )}

    {showDeletePopup && (
        <div className={styles.admin_popup_container}>
            <div className={styles.admin_popup}>
                <img src={iconDelete} alt="icon" className={styles.admin_popup_icon} />
                <div className={styles.admin_popup_info}>
                    <h2>Deletion Of Company</h2>
                    <pre>Are you sure you want to remove the company with<br />registration number {currentCompany?.registrationNumber}?</pre>
                </div>
                <button className={styles.yes_btn} id={styles.yes_delete_btn} onClick={handleConfirmDelete}>Yes, Remove</button>
                <button className={styles.close_btn} onClick={() => setShowDeletePopup(false)}>&times;</button>
            </div>
        </div>
    )}

    {showDeletedPopup && (
        <div className={styles.admin_popup_container}>
            <div className={styles.admin_popup}>
                <img src={iconDelete} alt="icon" className={styles.admin_popup_icon} />
                <div className={styles.admin_popup_info_after}>
                    <h2>Successfully Deleted</h2>
                    <pre>The company with registration number {currentCompany?.registrationNumber} has been<br />successfully deleted.</pre>
                </div>
                <button className={styles.close_btn} onClick={() => setShowDeletedPopup(false)}>&times;</button>
            </div>
        </div>
    )}

    <div className={styles.topnav}>
        <img src={pageTitle} alt="Dashboard" id={styles.topnav_title} />
        <button id={styles.admin_logout} onClick={handleLogout}>Logout</button>
    </div>

    <div className={styles.sidebar}>
        <img src={adminSidebar} alt="" id={styles.sidebar_img} />
    </div>

    <div id={styles.admin_company_search}>
        <h2 id={styles.admin_company_info}>Companies Information</h2>
        <div id={styles.admin_search_inner}>
            <div id={styles.admin_search_name}>
                <label htmlFor="Name">Name</label> <br /> <br />
                <input type="text" className={styles.admin_search_input} placeholder="Enter Company Name" value={searchName} onChange={(e) => setSearchName(e.target.value.replace(/[0-9]/g, '')) }  maxLength={100}/>
            </div>
            <div id={styles.admin_search_regNo}>
                <label htmlFor="regName">Registration Number</label> <br /> <br />
                <input type="text" maxLength={7} minLength={7} className={styles.admin_search_input} placeholder="Enter Registration Number" value={searchRegNumber}   onChange={(e) => setSearchRegNumber(e.target.value.replace(/\D/, '')) } />
            </div>
            <div id={styles.admin_search_button_div}>
                <button id={styles.admin_search_button} onClick={handleSearch}>Search</button>
            </div>
        </div>
    </div>

    <div id={styles.admin_company_table_div}>
        <table cellPadding="15px" cellSpacing="20px" id={styles.admin_company_table}>
            <thead id={styles.admin_table_head}>
                <tr>
                    <th className={styles.admin_company_table_head}>Name</th>
                    <th className={styles.admin_company_table_head}>Date</th>
                    <th className={styles.admin_company_table_head}>Phone Number</th>
                    <th className={styles.admin_company_table_head}>Registration Number</th>
                    <th className={styles.admin_company_table_head}>Email</th>
                    <th className={styles.admin_company_table_head}>Action</th>
                </tr>
            </thead>

            <tbody id={styles.admin_table_body}>
            {companyData.length === 0 ? (
                <tr>
                    <td style={{ textAlign: 'center', padding: '20px' }}>No company registered.</td>
                </tr>
            ) : (
                companyData.map(company => (
                    <tr key={company.registrationNumber}>
                        <td className={styles.admin_table_company_name}>{company.name}</td>
                        <td>{formatDate(company.register_date)}</td>
                        <td>{company.phoneNumber}</td>
                        <td>{company.registrationNumber}</td>
                        <td>{company.email}</td>
                        <td>
                            {!company.c_status && (
                                <button onClick={() => handleVerify(company)} className={styles.admin_company_verify_delete + " " + styles.admin_company_verify}>Verify</button>
                            )}
                            <button onClick={() => handleDelete(company)} className={styles.admin_company_verify_delete +" "+ styles.admin_company_delete}>Delete</button>
                        </td>
                    </tr>
                ))
            )}
            </tbody>
        </table>
    </div>
</div>

);


}

export default AdminDashboard;