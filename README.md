
# User Table Sign-In System

A full-stack web application for user registration, authentication, and advanced user search, built with React and Express/MongoDB.

## Features

- **User Registration**: Secure registration with password hashing
- **User Sign-In**: Authentication and sign-in time tracking
- **User Search**:
  - By first and/or last name
  - By username
  - By salary range
  - By age range
  - Registered after a specific user
  - Never signed in
  - Registered on the same day as a specific user
  - Registered today

## Tech Stack

- **Frontend**: React, Axios, React Router
- **Backend**: Express, MongoDB (Mongoose), bcrypt, CORS

## Project Structure

```
DBPr1/
├── Rserver/           # Express backend
│   └── index.js
├── frontend/          # React frontend
│   ├── src/
│   │   ├── App.js
│   │   └── pages/
│   └── package.json
├── sql.txt            # Query documentation
├── README.md          # Project documentation
└── .gitignore
```

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)

### Backend

1. Install dependencies:
   ```
   cd Rserver
   npm install
   ```
2. Set up `.env` in `Rserver`:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```
3. Start backend:
   ```
   npm start
   ```

### Frontend

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```
2. Start frontend:
   ```
   npm start
   ```
   The app runs at `http://localhost:3000`

## API Endpoints

- `POST /register` — Register a new user
- `POST /login` — Sign in
- `GET /users/by-name?first=X&last=Y` — Search by name
- `GET /users/by-username/:username` — Search by username
- `GET /users/salary?min=X&max=Y` — Search by salary
- `GET /users/age?min=X&max=Y` — Search by age
- `GET /users/registered-after/:username` — Users registered after
- `GET /users/never-signed-in` — Users who never signed in
- `GET /users/same-day-as/:username` — Registered same day as user
- `GET /users/registered-today` — Registered today

## Security

- Passwords hashed with bcrypt
- Input validation
- NoSQL injection protection

## License

MIT