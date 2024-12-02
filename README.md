# Web-Golden-Popcorn

Web-Golden-Popcorn is a movie review web application similar to IMDb. This application uses Node.js, React, and PostgreSQL.

## Technology Specifications

### Backend
- **Node.js**: Runs the backend server.
- **Express**: A framework for building APIs.
- **PostgreSQL**: Database for storing movie and review data.
- **pg**: Node.js module for accessing PostgreSQL.
- **jsonwebtoken**: For authentication and authorization using JWT tokens.
- **bcryptjs**: For password hashing.
- **dotenv**: For managing environment variables.

### Frontend
- **React**: A library for building user interfaces.
- **fetch**: For making HTTP requests from the frontend to the backend.
- **React Router**: For managing routing in the React application.
- **Bootstrap**: For styling and responsive layout.

## Installation Guide

Follow the steps below to install and run the Web-Golden-Popcorn application locally.

### Prerequisites
Make sure you have the following installed:
- Node.js and npm: [Download Node.js](https://nodejs.org/)
- PostgreSQL: [Download PostgreSQL](https://www.postgresql.org/download/)

### Installation Steps

#### 1. Clone the Repository
Clone the repository from GitHub to your local machine:
```bash
git clone https://github.com/RahmaDivina/Web-Golden-Popcorn.git
cd Web-Golden-Popcorn
```

#### 2. Set up the Backend
2.1 Navigate to the backend directory
```bash
cd backend
```
2.2 Install the necessary backend dependencies
```bash
npm install
```
2.3 Create a .env file for PostgreSQL configuration
Create a .env file in the backend directory with the following content:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
```
2.4 Run the backend server
```bash
node server.js
```
The backend will now be running at http://localhost:5000.

#### 3. Set up the Frontend
3.1 Navigate to the frontend directory
Return to the root directory and navigate to the frontend directory:

```bash
cd frontend
```
3.2 Install the necessary frontend dependencies
```bash
npm install
```
3.3 Run the React development server
```bash
npm start
```
The frontend will now be running at http://localhost:3000.

#### 4. Connecting the Frontend and Backend
Once both the frontend and backend are running:

The frontend will make API requests to the backend at http://localhost:5000.
Ensure the backend is properly configured to handle API requests from the frontend (Cross-Origin Resource Sharing, CORS, may need to be enabled if you encounter issues).

## Features
1. Display a list of movies with details and reviews.
2. Users can submit reviews for movies.
3. Search for movies by title.

## Contributing
If you want to contribute to this project, follow these steps:

1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Make your changes.
4. Commit your changes (git commit -am 'Add new feature').
5. Push to your branch (git push origin feature-branch).
6. Open a pull request.
7. Please provide a clear description of the changes you've made.
