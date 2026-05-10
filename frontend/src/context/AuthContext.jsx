import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // IMPORTANT FIX
  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(true);

  // Load token on app start
  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    console.log('STORED TOKEN:', storedToken);

    if (
      storedToken &&
      storedToken !== 'undefined' &&
      storedToken !== 'null'
    ) {
      setToken(storedToken);

      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      console.log('LOGIN RESPONSE:', response.data);

      const token = response.data.token;
      const user = response.data.user;

      // Save token
      localStorage.setItem('token', token);

      // Set axios header
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`;

      // Update state
      setToken(token);
      setUser(user);

      return { success: true };

    } catch (error) {
      console.log(error);

      return {
        success: false,
        error:
          error.response?.data?.error ||
          'Login failed',
      };
    }
  };

  // REGISTER
  const register = async (email, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        {
          email,
          password,
        }
      );

      console.log('REGISTER RESPONSE:', response.data);

      const token = response.data.token;
      const user = response.data.user;

      // Save token
      localStorage.setItem('token', token);

      // Set axios header
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`;

      // Update state
      setToken(token);
      setUser(user);

      return { success: true };

    } catch (error) {
      console.log(error);

      return {
        success: false,
        error:
          error.response?.data?.error ||
          'Registration failed',
      };
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem('token');

    setToken(null);
    setUser(null);

    delete axios.defaults.headers.common[
      'Authorization'
    ];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};