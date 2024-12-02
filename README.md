# Web Movie Review Platform

This is a web application for movie reviews, similar to IMDb, built using **Node.js**, **React**, and **PostgreSQL**. Users can view movie information and submit reviews.

## Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **API**: RESTful API using Express.js
- **State Management (Frontend)**: React Hooks
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (usually installed with Node.js)
- [PostgreSQL](https://www.postgresql.org/)

## Installation

Follow these steps to get the project up and running on your local machine:

### 1. Clone the Repository

```bash
git clone https://github.com/RahmaDivina/Web-Golden-Popcorn.git
cd Web-Golden-Popcorn
2. Set up the Backend
Navigate to the backend directory:

bash
Copy code
cd backend
Install dependencies for the backend:

bash
Copy code
npm install
Create a .env file in the backend directory for PostgreSQL configuration. Add the following database parameters:

env
Copy code
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
Start the backend server:

bash
Copy code
node server.js
3. Set up the Frontend
Return to the root directory and navigate to the frontend directory:

bash
Copy code
cd frontend
Install dependencies for the frontend:

bash
Copy code
npm install
Start the React application in development mode:

bash
Copy code
npm start
The frontend will be running at http://localhost:3000, and the backend will be running at http://localhost:5000.

Features
Display a list of movies with details and reviews.
Users can submit reviews for movies.
Search for movies by title.
Contributing
If you would like to contribute, please fork this repository, create a new branch, and submit a pull request with a description of the changes you've made.

License
This project is licensed under the MIT License.

markdown
Copy code

### Explanation:
- **Technology Stack**: Lists the key technologies used in the project.
- **Prerequisites**: Specifies the necessary software that needs to be installed before starting the project.
- **Installation**: Provides step-by-step instructions for setting up both the backend and frontend environments.
- **Features**: Highlights the key features of the application.
- **Contributing**: Encourages open-source collaboration with instructions for contributing.
- **License**: States the licensing terms for the project.
