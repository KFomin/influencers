# Influencer Management App

This is a simple web application for managing influencers, allowing users to create, update, delete, and view influencer profiles. The application consists of a frontend built with React and a backend built with Node.js and Express.

## Features

- **List Influencers**: View all influencers in the system.
- **Create Influencer**: Add new influencers with their nickname, first name, last name, and social media accounts (Instagram and TikTok).
- **Edit Influencer**: Edit existing influencer details.
- **Delete Influencer**: Remove influencers from the records.
- **Search Functionality**: Search influencers by nickname, first name, or last name.

## Technologies Used

- **Frontend**: React, TypeScript, React Router, Axios
- **Backend**: Node.js, Express, TypeScript, File System (fs) for data storage
- **Development Tools**: npm, react-toastify for notifications, etc.

## Installation Instructions

**Clone the repository**
```
git clone https://github.com/KFomin/influencers.git
```
   
Navigate to the project directory

```
cd influencers
```

Install frontend dependencies
```
npm install --prefix frontend
```

Install backend dependencies
```
npm install --prefix backend
```

**Running the Application**
To start the development servers, run the following command:

```
npm start
```

Application URLs
The client will run on http://localhost:3000
The server will run on http://localhost:5123

**Usage**
After starting the application, you can:

- Visit the homepage to see the list of influencers.
- Click on "Create New Influencer" to add a new influencer.
- Click on an influencer's nickname to edit their details.
- Use the search function to filter influencers by nickname, first name, or last name.
