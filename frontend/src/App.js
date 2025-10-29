import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import axios from 'axios';

// Prefer an explicit environment variable (REACT_APP_API_URL). If not set,
// default to the production Vercel deployment domain (so frontend points to
// the deployed API). When running the frontend on the same origin as the
// API, you can also set REACT_APP_API_URL to '/api' to use relative paths.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://user-table-sign-in.vercel.app/api';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Registration form state
  const [regForm, setRegForm] = useState({
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    salary: '',
    age: ''
  });

  // Sign-in form state
  const [signInForm, setSignInForm] = useState({
    username: '',
    password: ''
  });

  // Search form states
  const [nameSearch, setNameSearch] = useState({ firstname: '', lastname: '' });
  const [salarySearch, setSalarySearch] = useState({ min: '', max: '' });
  const [ageSearch, setAgeSearch] = useState({ min: '', max: '' });

  const handleInputChange = (form, setForm) => (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/users/register`, regForm);
      setUser(response.data.user);
      setError('Registration successful!');
      setRegForm({ username: '', password: '', firstname: '', lastname: '', salary: '', age: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/users/signin`, signInForm);
      setUser(response.data.user);
      setError('Sign-in successful!');
      setSignInForm({ username: '', password: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchType, params) => {
    setLoading(true);
    setError('');

    try {
      let url = `${API_BASE_URL}/users/search/${searchType}`;
      let response;

      switch (searchType) {
        case 'name':
          response = await axios.get(url, { params });
          break;
        case 'userid':
          url += `/${params.username}`;
          response = await axios.get(url);
          break;
        case 'salary':
          response = await axios.get(url, { params });
          break;
        case 'age':
          response = await axios.get(url, { params });
          break;
        case 'after-john':
          response = await axios.get(url);
          break;
        case 'never-signed-in':
          response = await axios.get(url);
          break;
        case 'same-day-as-john':
          response = await axios.get(url);
          break;
        case 'registered-today':
          response = await axios.get(url);
          break;
        default:
          throw new Error('Invalid search type');
      }

      setSearchResults(Array.isArray(response.data.users) ? response.data.users : [response.data.user]);
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setSearchResults([]);
    setError('');
  };

  const renderRegistrationForm = () => (
    <div className="form-container">
      <h2>User Registration</h2>
      <form onSubmit={handleRegistration}>
        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={regForm.username}
            onChange={handleInputChange(regForm, setRegForm)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={regForm.password}
            onChange={handleInputChange(regForm, setRegForm)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={regForm.firstname}
            onChange={handleInputChange(regForm, setRegForm)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={regForm.lastname}
            onChange={handleInputChange(regForm, setRegForm)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={regForm.salary}
            onChange={handleInputChange(regForm, setRegForm)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={regForm.age}
            onChange={handleInputChange(regForm, setRegForm)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );

  const renderSignInForm = () => (
    <div className="form-container">
      <h2>User Sign In</h2>
      <form onSubmit={handleSignIn}>
        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={signInForm.username}
            onChange={handleInputChange(signInForm, setSignInForm)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={signInForm.password}
            onChange={handleInputChange(signInForm, setSignInForm)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );

  const renderSearchForms = () => (
    <div className="search-container">
      <h2>Search Users</h2>
      
      {/* Search by Name */}
      <div className="search-form">
        <h3>Search by Name</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="First Name"
            value={nameSearch.firstname}
            onChange={(e) => setNameSearch({...nameSearch, firstname: e.target.value})}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={nameSearch.lastname}
            onChange={(e) => setNameSearch({...nameSearch, lastname: e.target.value})}
          />
          <button onClick={() => handleSearch('name', nameSearch)} disabled={loading}>
            Search by Name
          </button>
        </div>
      </div>

      {/* Search by User ID */}
      <div className="search-form">
        <h3>Search by User ID</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            id="userid-search"
          />
          <button onClick={() => {
            const username = document.getElementById('userid-search').value;
            if (username) handleSearch('userid', { username });
          }} disabled={loading}>
            Search by User ID
          </button>
        </div>
      </div>

      {/* Search by Salary Range */}
      <div className="search-form">
        <h3>Search by Salary Range</h3>
        <div className="form-group">
          <input
            type="number"
            placeholder="Min Salary"
            value={salarySearch.min}
            onChange={(e) => setSalarySearch({...salarySearch, min: e.target.value})}
          />
          <input
            type="number"
            placeholder="Max Salary"
            value={salarySearch.max}
            onChange={(e) => setSalarySearch({...salarySearch, max: e.target.value})}
          />
          <button onClick={() => handleSearch('salary', salarySearch)} disabled={loading}>
            Search by Salary
          </button>
        </div>
      </div>

      {/* Search by Age Range */}
      <div className="search-form">
        <h3>Search by Age Range</h3>
        <div className="form-group">
          <input
            type="number"
            placeholder="Min Age"
            value={ageSearch.min}
            onChange={(e) => setAgeSearch({...ageSearch, min: e.target.value})}
          />
          <input
            type="number"
            placeholder="Max Age"
            value={ageSearch.max}
            onChange={(e) => setAgeSearch({...ageSearch, max: e.target.value})}
          />
          <button onClick={() => handleSearch('age', ageSearch)} disabled={loading}>
            Search by Age
          </button>
        </div>
      </div>

      {/* Special Searches */}
      <div className="search-form">
        <h3>Special Searches</h3>
        <div className="button-group">
          <button onClick={() => handleSearch('after-john')} disabled={loading}>
            Users After John
          </button>
          <button onClick={() => handleSearch('never-signed-in')} disabled={loading}>
            Never Signed In
          </button>
          <button onClick={() => handleSearch('same-day-as-john')} disabled={loading}>
            Same Day as John
          </button>
          <button onClick={() => handleSearch('registered-today')} disabled={loading}>
            Registered Today
          </button>
        </div>
      </div>
    </div>
  );

  const renderSearchResults = () => (
    <div className="results-container">
      <h3>Search Results ({searchResults.length})</h3>
      {searchResults.length > 0 ? (
        <div className="results-grid">
          {searchResults.map((user, index) => (
            <div key={index} className="user-card">
              <h4>{user.firstname} {user.lastname}</h4>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Salary:</strong> ${user.salary}</p>
              <p><strong>Age:</strong> {user.age}</p>
              <p><strong>Registered:</strong> {new Date(user.registerday).toLocaleDateString()}</p>
              <p><strong>Last Sign In:</strong> {user.signintime ? new Date(user.signintime).toLocaleString() : 'Never'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>User Table Sign-In System</h1>
          <nav>
            <Link to="/" className="nav-button">Home</Link>
            <Link to="/register" className="nav-button">Register</Link>
            <Link to="/signin" className="nav-button">Sign In</Link>
            <Link to="/search" className="nav-button">Search</Link>
            {user && <button onClick={handleSignOut}>Sign Out</button>}
          </nav>
          {user && (
            <div className="user-info">
              <p>Welcome, {user.firstname} {user.lastname}!</p>
            </div>
          )}
        </header>

        <main className="App-main">
          {error && <div className="error-message">{error}</div>}
          
          <Routes>
            <Route path="/" element={
              <div className="home-container">
                <h2>Welcome to the User Management System</h2>
                <p>This system allows you to:</p>
                <ul>
                  <li>Register new users</li>
                  <li>Sign in existing users</li>
                  <li>Search users by various criteria</li>
                  <li>View user information securely</li>
                </ul>
                <p>Select an option from the navigation menu to get started.</p>
              </div>
            } />
            <Route path="/register" element={renderRegistrationForm()} />
            <Route path="/signin" element={renderSignInForm()} />
            <Route path="/search" element={
              <>
                {renderSearchForms()}
                {searchResults.length > 0 && renderSearchResults()}
              </>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;