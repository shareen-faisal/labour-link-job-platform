import React from 'react';
import styles from './styleFooter.module.css';
import logo2 from '../images/logo2.png';
import SocialMedia from '../images/SocialMedia.png';


const Footer = () => {
    return (
        <footer className={styles.footer}>
        <div className={styles.footer_left}>
            <div className={styles.logo}>
                <img src={logo2} alt="Logo" />
                <h3 style={{ color: '#fff', marginTop: '2px' }}>LabourLink</h3>
            </div>
            <div className={styles.footer_contact}>
                <p style={{ marginBottom: '10px', fontWeight: 'normal' }}>
                    Call now: <span style={{ color: '#fff', fontWeight: 'normal' }}>(055) 234-5524</span>
                </p>
                <p style={{ fontWeight: 'normal' }}>
                   GIFT UNIVERSITY, Gujranwala, Pakistan
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
    </footer>
    );
};

export default Footer;