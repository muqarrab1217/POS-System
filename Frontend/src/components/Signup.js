import React, { useState } from 'react';
import axios from 'axios';  // Import axios for making API requests
import './Signup.css';

function SignupPage() {
  // State hooks to manage form data
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [role, setRole] = useState('staff');  // Default role is 'staff'
  const [error, setError] = useState('');  // To store error message
  const [success, setSuccess] = useState('');  // To store success message

  // Function to validate and handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error and success messages before validation
    setError('');
    setSuccess('');

    // Basic validation to check for blank fields
    if (!username || !email || !password1 || !password2) {
      setError('All fields are required.');
      return;
    }

    // Basic validation for passwords matching
    if (password1 !== password2) {
      setError('Passwords do not match.');
      return;
    }

    // Check if the role is 'admin' and validate admin key
    if (adminKey !== '123') {
      setError('Invalid Admin Key.');
      return;
    }

    // Prepare user data to send to backend
    const userData = {
      name: username,
      email: email,
      password: password1,
      role: role,  // Send the selected role to the backend
    };

    try {
      // Make API call to backend to register user
      const response = await axios.post('http://localhost:8080/api/auth/register', userData);
      console.log(userData);

      // Check if the registration is successful
      if (response.status === 200) {
        setSuccess('User registered successfully!');
        setError('');  // Clear previous errors
      }
    } catch (err) {
      // Handle errors from backend (e.g., email already exists)
      if (err.response) {
        // Check if the error message is about the email already existing
        if (err.response.data && typeof err.response.data === 'string') {
          setError(err.response.data); // Directly set string error message
        } else if (err.response.data && err.response.data.error) {
          // If the error message is nested inside an object (e.g., {error: "message"})
          setError(err.response.data.error || 'Something went wrong!');
        } else {
          setError('An unexpected error occurred.');
        }
      } else {
        setError('No response from server.');
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <form onSubmit={handleSubmit}>
        <h3>Signup Here</h3>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="Username"
          name="username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="Email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password1">Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password1"
          name="password1"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
        />

        <label htmlFor="password2">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm Password"
          id="password2"
          name="password2"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />

        {/* Role Selection */}
        <label htmlFor="role">Role</label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}  // Update role state on change
        >
          <option value="staff">Staff Member</option>
          <option value="admin">Admin</option>
        </select>

       
          <div>
            <label htmlFor="adminKey">Admin Key (Only for Admins)</label>
            <input
              type="password"
              placeholder="Enter your Admin Key"
              id="adminKey"
              name="adminKey"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
            />
          </div>
      

        <button type="submit">Signup</button>

        {/* Display error message if any */}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <a href="/login">I have an account</a>
      </form>
    </div>
  );
}

export default SignupPage;
