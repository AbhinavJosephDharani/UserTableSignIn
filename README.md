# User Table Sign-In System

A full-stack web application for user registration, authentication, and search functionality built with React, Node.js, Express, and MongoDB Atlas.

## Features

- **User Registration**: Secure user registration with password hashing
- **User Sign-In**: Secure authentication with bcrypt password verification
- **Advanced Search**: Multiple search capabilities including:
  - Search by first and/or last name
  - Search by username (user ID)
  - Search by salary range
  - Search by age range
  - Search users who registered after a specific user
  - Search users who never signed in
  - Search users who registered on the same day as a specific user
  - Search users who registered today

## Tech Stack

### Frontend
- React 18
- Axios for API calls
- Modern CSS with glassmorphism design
- Responsive design for mobile and desktop

### Backend
- Node.js with Express
- MongoDB Atlas (cloud database)
- Mongoose ODM
- bcryptjs for password hashing
- express-validator for input validation
- CORS enabled for cross-origin requests

## Project Structure

```
DatabaseProject1/
├── Backend/
│   ├── models/
│   │   └── User.js          # User schema and model
│   ├── routes/
│   │   └── userRoutes.js    # API routes for user operations
│   ├── app.js               # Express server setup
│   ├── db.js                # MongoDB connection
│   ├── package.json         # Backend dependencies
│   └── config.example.js    # Configuration example
├── frontend/
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   ├── App.css          # Styling
│   │   └── config.js        # API configuration
│   └── package.json         # Frontend dependencies
├── sql.txt                  # MongoDB queries documentation
└── README.md               # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your MongoDB Atlas connection string:
   ```
   PORT=5050
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/web_app?retryWrites=true&w=majority
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:5050`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file for API configuration:
   ```
   REACT_APP_API_URL=http://localhost:5050/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/signin` - Sign in existing user

### Search Operations
- `GET /api/users/search/name?firstname=John&lastname=Doe` - Search by name
- `GET /api/users/search/userid/:username` - Search by username
- `GET /api/users/search/salary?min=50000&max=100000` - Search by salary range
- `GET /api/users/search/age?min=25&max=65` - Search by age range
- `GET /api/users/search/after-john` - Users who registered after John
- `GET /api/users/search/never-signed-in` - Users who never signed in
- `GET /api/users/search/same-day-as-john` - Users who registered same day as John
- `GET /api/users/search/registered-today` - Users who registered today
- `GET /api/users/all` - Get all users

### Health Check
- `GET /api/health` - API health status

## Security Features

- Password hashing with bcryptjs
- Input validation and sanitization
- NoSQL injection protection
- CORS configuration
- Error handling without sensitive data exposure

## Database Schema

The User collection includes the following fields:
- `username` (String, unique, required)
- `password` (String, hashed, required)
- `firstname` (String, required)
- `lastname` (String, required)
- `salary` (Number, required)
- `age` (Number, required)
- `registerday` (Date, auto-generated)
- `signintime` (Date, updated on sign-in)

## Deployment

### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Set the build command to `npm run build`
3. Set the output directory to `build`
4. Add environment variable: `REACT_APP_API_URL` with your backend URL

### Backend Deployment
The backend can be deployed to platforms like:
- Heroku
- Railway
- Render
- DigitalOcean App Platform

Make sure to set the `MONGODB_URI` environment variable in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Author

Abhinav Joseph Dharani
