import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';   
import { useRole } from './RoleContext'; 
import "./Login.css";

function LoginPage() {
  const [username, setUsername] = useState('');  // Email input field
  const [password, setPassword] = useState('');  // Password input field
  const [role, setUserRole] = useState('');  // State to hold user role
  const [error, setError] = useState(null);  // State to hold error message
  const [loading, setLoading] = useState(false);  // State to handle loading state
  const navigate = useNavigate();  // Hook to navigate to the next page
  const { login } = useAuth(); 
  const { setRole } = useRole();

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission

    // Basic form validation
    if (!username || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);  // Set loading state to true

    const data = {
      email: username,
      password,
    };

    try {
      // Step 1: Attempt to login and retrieve user role from the API
      const loginResponse = await axios.post('http://localhost:8080/api/auth/login', data);
      console.log('Login successful:', loginResponse.data);

      // Step 2: Get the role of the user based on the email entered
      const roleResponse = await axios.get(`http://localhost:8080/api/auth/role?email=${username}`);
      console.log('Role Response:', roleResponse.data);

      // Directly assign the role since it's returned as a string (e.g., "admin")
      const userRole = roleResponse.data || 'guest';  // Fallback to 'defaultRole' if undefined
      setUserRole(userRole);  // Save the role in state
      setRole(userRole);
      console.log('In Login Role:', userRole);  // Log the role for debugging

      const staffIdResponse = await axios.get(`http://localhost:8080/api/auth/getUserId?email=${username}`);
      const staffId = staffIdResponse.data; // Extract staffId from the response
      console.log('Staff ID:', staffId);

      login(); 
      
      // Step 3: Navigate to the Take Order page and pass the role as state
      //navigate('/takeorder', { state: { role: userRole } });
      navigate('/takeorder', { state: { role: userRole, staffId } });
  
    } catch (err) {
      console.log(err);
      setError('Invalid Email/Password');
    } finally {
      setLoading(false);  // Reset loading state after the request
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-shape"></div>
        <div className="login-shape"></div>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <h3>Login Here</h3>

        <label htmlFor="username">Email</label>
        <input
          type="email"
          placeholder="Enter your Email"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}  // Set username when input changes
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Enter your Password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}  // Set password when input changes
        />

        <div className="login-button">
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        <a href="/signup">Create an account</a>
      </form>
    </div>
  );
}

export default LoginPage;

