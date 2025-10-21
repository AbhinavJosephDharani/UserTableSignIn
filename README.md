# User Table Sign-In System

A full-stack web application for user registration, authentication, and search functionality built with React, Vercel serverless functions, and MongoDB Atlas.

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
- Vercel serverless functions
- MongoDB Atlas (cloud database)
- Mongoose ODM
- bcryptjs for password hashing
- express-validator for input validation
- CORS enabled for cross-origin requests

## Project Structure

```
DatabaseProject1/
├── api/
│   └── index.js             # Vercel serverless API with all functionality
├── frontend/
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   └── App.css          # Styling
│   └── package.json         # Frontend dependencies
├── static/                  # Built frontend assets
├── index.html              # Built React app
├── package.json            # Root dependencies
├── vercel.json             # Vercel deployment configuration
├── sql.txt                 # MongoDB queries documentation
└── README.md              # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Vercel account
- Git

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/AbhinavJosephDharani/UserTableSignIn.git
   cd UserTableSignIn
   ```

2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   ```

3. Set up environment variables:
   - Create `.env` in root directory:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/web_app
     ```

4. Start development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## Deployment

### Vercel (Full-Stack)
1. Connect your GitHub repository to Vercel
2. Add environment variable: `MONGODB_URI` with your MongoDB Atlas connection string
3. Deploy automatically on push to main branch

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Add it as `MONGODB_URI` in Vercel environment variables

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

## Live Demo

- **Frontend**: [https://user-table-sign-in-4wi2.vercel.app](https://user-table-sign-in-4wi2.vercel.app)
- **API**: `https://user-table-sign-in-4wi2.vercel.app/api/*`

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