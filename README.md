# ManilaPayroll Master Table Clone

A full-stack CRUD application that replicates the Master Table feature from ManilaPayroll.com. Built using React and PrimeReact on the frontend and a modern Node.js, Express, and MySQL backend.

## ✨ Features

- ✅ Create, Read, Update, and Delete (CRUD) employee records  
- 🔍 Searchable and sortable data table  
- 🧾 Input validation with clear error messages  
- 🎨 Responsive, user-friendly UI using PrimeReact
- 🕒 Activity Log to track employee actions and history
- 🌓 Light/Dark Theme Toggle with persistent selection  

## 🛠️ Tech Stack

- **Frontend**: React, PrimeReact, Axios  
- **Backend**: Node.js, Express.js  
- **Database**: MySQL  

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/jporteria/employee_management.git
```

### 2. Setup the Backend

 Navigate to the backend folder:

```bash
cd server
```

Install backend dependencies:

```bash
npm install
```

Create a .env file inside the server folder with the following content (Replace "your_mysql_password" with your actual MySQL password.):

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=manila_payroll
PORT=5000
```


Import the employees.sql file into MySQL using phpMyAdmin:

1. Open phpMyAdmin in your browser (http://localhost/phpmyadmin)

2. Create a new database named manila_payroll

3. Go to the Import tab

4. Click Choose File and select employees.sql from the server folder

5. Click Go to import the schema and sample data

Start the backend server:

```bash
npm start
```
The backend should now be running at http://localhost:5000.

### 3. Setup the Frontend
Navigate to the frontend folder:

```bash
cd client
```
Install frontend dependencies:

```bash
npm install
```
Start the React development server:

```bash
npm run dev
```
The frontend will now be available at http://localhost:5173.

## 🛡 ️Note on Backend
While the instruction suggested using a provided backend repo, it was outdated and incompatible with modern environments (requiring older Node versions and deprecated packages).

To ensure security, compatibility, and maintainability, I rebuilt the backend from scratch using:

- Node.js v18+
- Express
- mysql2

The new backend replicates the original project’s architecture and functionality while avoiding technical debt.