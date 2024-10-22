Installation
To run the project locally, follow these steps:

Prerequisites
1. Node.js: Ensure you have Node.js installed.
2. Git: You'll need Git for version control.
3. MongoDB: The project uses MongoDB for the database, so ensure it's installed and running.

CLoning and starting the porject:
1. Clone the Project
First, clone the repository from GitHub to your local machine:
  git clone https://github.com/Ryuk2git/GroupUp.git
  cd GroupUp

3. Install Dependencies
After cloning the project, navigate into the project folder and install the required dependencies:
  npm install

3. Start the Database
Import the CurrentWorking.sql file into your database system(MySQL Workbench)
Use the groupproxy database:
  USE groupproxy;
  SOURCE /path/to/CurrentWorking.sql;
This will set up the database schema and initial data required for the project.

4. Start the Server
Navigate to the project folder and start the backend server using the following command:
  npm start index.js
This will start the backend service and connect it to the database.

5. Start the Frontend
Open a new terminal, navigate to the project folder, and run the following command to start the frontend development server:
  npm run dev
This will start the frontend on your local development server (usually accessible at http://localhost:3173).

Project update:
