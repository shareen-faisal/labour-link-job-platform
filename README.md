
<a id="readme-top"></a>

<div align="center">
  <a href="https://github.com/shareen-faisal/labour-link-job-platform.git">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Labour-Link Job Platform</h3>

  <p align="center">
    A job application platform built to empower non-technical roles by connecting job seekers with verified companies.
    <br />
    <br />
    <br />
  </p>
</div>

---

## About The Project

[![Product Screenshot][product-screenshot]](https://github.com/sha-reen-04/labour-link-job-platform)

In a tech-focused job market, non-technical roles often go unnoticed despite their vital contributions to organizational success. **Labour-Link** seeks to bridge this gap by offering a dedicated platform where companies can post jobs and job seekers can find opportunities aligned with their skills — especially in customer service, sales, and administration.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

### Built With

- ![React.js](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61dafb)
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
- ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
- ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
- ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
- ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
- ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)


<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

Make sure you have the following installed:

- **Node.js** and **npm**
- **Python 3.x**
- **Apache Server** (e.g., XAMPP or WAMP) to host the MySQL database

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/shareen-faisal/labour-link-job-platform.git
   ```

2. **Navigate into the project directory**
   ```bash
   cd labour-link-job-platform
   ```

---

### 1. Set up the Backend

```bash
cd backend
npm install
nodemon server.js
```

> This will start your backend server on the configured port.

---

### 2. Set up the Frontend

In a new terminal:

```bash
cd frontend
npm install
npm start
```

> This will start the React development server, usually on [http://localhost:5173](http://localhost:5173)

---

### 3. Set up the ATS (Resume Analysis System)

In another terminal:

```bash
cd ATS
pip install -r requirements.txt
python ats_service.py
```

> This will run your ATS Python script for resume processing.

---

### 4. Set up the Database

- Use **Apache** to run your **MySQL** database.
- Import your `.sql` file from the `database/` folder into **phpMyAdmin** or any other MySQL tool.
- Ensure your **backend server** is configured with the correct database credentials in `.env`.

