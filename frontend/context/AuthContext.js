"use client";

import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to set the axios auth header
  const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    // Check for a token in local storage on app load
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setUser(null);
        } else {
          setUser({ id: decoded.user.id });
          setAuthHeader(token);
        }
      } catch (error) {
        console.error("Invalid token");
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, { email, password });
    const { token } = res.data;
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser({ id: decoded.user.id });
    setAuthHeader(token);
  };



  const register = async (username, email, password, genres) => { // <-- Add genres
    // Send all fields to the backend
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, { 
      username, 
      email, 
      password, 
      genres // <-- Send genres
    });
  };



  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAuthHeader(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);